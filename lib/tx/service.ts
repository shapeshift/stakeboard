import { pathHorizontalLine } from "@visx/shape";
import { getAllTx, ValidatorTx, ValidatorTxType } from "./client";

const delegateMemos = [
  "Delegated with ShapeShift",
  "Compounded by ShapeShift DAO",
  "REStaked by ShapeShift DAO",
  "First stake scapeshift",
];

// Data from chain txs:
// Total stakers - sum the amount of staked tokens for each unique address, filter out the empty ones, take count
// Shapeshift stakers - same but only for shapeshift memo tx

type DelegatorMapEntry = {
    value: number
    type: DelegatorType,
    tx: ValidatorTx[]
}

enum DelegatorType{
    Shapeshift,
    NonShapeshift
}

export const getStakerData = async () => {
  const allTx = await getAllTx();
  const stakersOverTime = getStakersOverTime(allTx);
};

const getStakersOverTime = (allTx: ValidatorTx[]) => { 
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

    console.log(`Full map size: `, addressStakedValueMap.size)
    const nonEmptyAddresses = filterAMap(addressStakedValueMap, entry => { return entry.value > 0 } )
    console.log(`Non-empty entries size: `, nonEmptyAddresses.size)

    const shapeshiftAddresses = filterAMap(addressStakedValueMap, entry => { return entry.type == DelegatorType.Shapeshift } )
    const nonEmptyShapeshiftAddresses = filterAMap(shapeshiftAddresses, entry => { return entry.value > 0 } )

    console.log(`Shapeshift size: `, shapeshiftAddresses.size)
    console.log(`Non-empty shapeshift size: `, nonEmptyShapeshiftAddresses.size)
    
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
        console.log(current)
    }else{
        console.warn(`Found an unstake operation for address ${tx.address} but no stake operations found`)
    }
 }


 const filterAMap = (addressStakedValueMap : Map<string, DelegatorMapEntry>, condition : (entry: DelegatorMapEntry) => Boolean) => {
    return new Map(
        Array.from(addressStakedValueMap).filter(([key, entry]) => {
          if (condition(entry)) {
            return true;
          }
      
          return false;
        }),
      );
 }

