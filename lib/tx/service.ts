import { pathHorizontalLine } from "@visx/shape";
import Redis from "ioredis";
import _ from "lodash";
import { HistoryData } from "../staking";
import { getAllTx, ValidatorTx, ValidatorTxType } from "./client";
import { filterAMap, uAtomToAtom } from "./util";

const delegateMemos = [
  "Delegated with ShapeShift",
  "Compounded by ShapeShift DAO",
  "REStaked by ShapeShift DAO",
  "First stake scapeshift",
];

// Data from chain txs:
// Total stakers - sum the amount of staked tokens for each unique address, filter out the empty ones, take count
// Shapeshift stakers - same but only for shapeshift memo tx

export type DelegatorMapEntry = {
    value: number
    type: DelegatorType,
    tx: ValidatorTx[]
}

export enum DelegatorType{
    Shapeshift,
    NonShapeshift
}

export interface StakerData {
    totalStakers: number
    shapeshiftStakers: number
    stakersOverTime: HistoryData[]
    delegationsOverTime: HistoryData[]
    allStakersOverTime: HistoryData[]
    allDelegationsOverTime: HistoryData[]
}

const saveAddressMapForDebugging = async (addressMap) => {
    const redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
      });
    console.log("Saving addressMap for debugging")
    await redis.set("addressMap", JSON.stringify(Object.fromEntries(addressMap)))
}

export const getStakerData = async (): Promise<StakerData> => {

    const allTx = await getAllTx();
    const addressStakedValueMap = new Map<string, DelegatorMapEntry>([])

    allTx.forEach(tx => {
        switch(tx.type) {
            case ValidatorTxType.Stake:
                handleStakeTx(addressStakedValueMap, tx)
                break;
            case ValidatorTxType.Unstake:
                handleUnstakeTx(addressStakedValueMap, tx)
                break;
        }
    })

    await saveAddressMapForDebugging(addressStakedValueMap)

    const nonEmptyAddressesMap = filterAMap(addressStakedValueMap, entry => { return entry.value > 0 } )
    const shapeshiftAddressesMap = filterAMap(addressStakedValueMap, entry => { return entry.type == DelegatorType.Shapeshift } )
    const nonEmptyShapeshiftAddressesMap = filterAMap(shapeshiftAddressesMap, entry => { return entry.value > 0 } )

    const adressList = Array.from(nonEmptyShapeshiftAddressesMap).map(([key, entry]) => key)
    const shapeshiftTx = _.uniq(allTx.filter(tx => adressList.includes(tx.address)))

    const delegationsOverTime = getDelegationsOverTime(shapeshiftTx)
    const stakersOverTime = getStakersOverTime(shapeshiftTx)

    const allDelegationsOverTime = getDelegationsOverTime(allTx)
    const allStakersOverTime  = getStakersOverTime(allTx)


    return {
        totalStakers: nonEmptyAddressesMap.size,
        shapeshiftStakers: nonEmptyShapeshiftAddressesMap.size,
        stakersOverTime,
        delegationsOverTime,
        allStakersOverTime,
        allDelegationsOverTime
    }
 }


const handleStakeTx = (addressStakedValueMap: Map<string, DelegatorMapEntry>, tx: ValidatorTx) => {
    if(addressStakedValueMap.has(tx.address)){
        const current = addressStakedValueMap.get(tx.address)
        current.value += tx.amount
        current.tx.push(tx)
        addressStakedValueMap.set(tx.address, current)
    }else{
        addressStakedValueMap.set(tx.address, {
            type: getDelegatorType(tx),
            value: tx.amount,
            tx: [tx]
        })
    }
}

const getDelegatorType = (tx: ValidatorTx) => {
    if(tx.type == ValidatorTxType.Stake && delegateMemos.includes(tx.memo)){
        return DelegatorType.Shapeshift
    }else{
        return DelegatorType.NonShapeshift
    }
}

const handleUnstakeTx = (addressStakedValueMap: Map<string, DelegatorMapEntry>, tx: ValidatorTx) => { 
    if(addressStakedValueMap.has(tx.address)){
        const current = addressStakedValueMap.get(tx.address)
        current.value -= tx.amount
        current.tx.push(tx)
        addressStakedValueMap.set(tx.address, current)
    }else{
        // console.warn(`Found an unstake operation for address ${tx.address} but no stake operations found`)
    }
 }


 const getDelegationsOverTime = (shapeshiftTx: ValidatorTx[]) => {

    var totalValue = 0;
  
    return shapeshiftTx.map(x => {
      const tmp = x.amount
      if(x.type == ValidatorTxType.Stake){
        totalValue = totalValue + tmp;
      }else{
        totalValue = totalValue - tmp;
      }
      return {
        amount: uAtomToAtom(totalValue),
        timestamp: x.timestamp * 1000, // convert to millis
      } as HistoryData
    })
  };
  
  // This is almost identical to the previous loop, however in order to not overcomplicate the logic we split this into two loops. 
  // Otherwise on each handle of stake/unstake we need to see if this operation is happening a shapeshift address or not and include all of this logic in the handling
  // Feel free to merge the two loops into one as it makes perfect sense to do so
  
  const getStakersOverTime = (shapeshiftTx: ValidatorTx[]) => {

    const shapeshiftAddressesMap = new Map<string, number>([])
    let stakersOverTime: HistoryData[] = [];
    let total = 0

    shapeshiftTx.forEach(tx => {
        switch(tx.type) {
            case ValidatorTxType.Stake:
                if(shapeshiftAddressesMap.has(tx.address)){
                    let current = shapeshiftAddressesMap.get(tx.address)
                    current += tx.amount
                    shapeshiftAddressesMap.set(tx.address, current)
                }else{
                    shapeshiftAddressesMap.set(tx.address, tx.amount)
                    total+=1;
                    stakersOverTime.push({
                        amount: total,
                        timestamp: tx.timestamp * 1000
                    })
                }
                break;
            case ValidatorTxType.Unstake:
                if(shapeshiftAddressesMap.has(tx.address)){
                    let current = shapeshiftAddressesMap.get(tx.address)
                    current -= tx.amount
                    shapeshiftAddressesMap.set(tx.address, current)
                    if(current <=0){
                        total -= 1
                        stakersOverTime.push({
                            amount: total,
                            timestamp: tx.timestamp * 1000
                        })
                    }
                }else{
                    // console.warn(`Found an unstake operation for address ${tx.address} but no stake operations found`)
                }
                break;
        }
    })

    return stakersOverTime
  }
