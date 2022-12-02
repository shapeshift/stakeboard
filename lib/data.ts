import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";
import { HistoryData } from "@/lib/history";
import { Fee, Tx } from "@/lib/types";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { getValidatorDetails } from "./validator";


const delegateMemos = [
  "Delegated with ShapeShift",
  "Compounded by ShapeShift DAO",
  "REStaked by ShapeShift DAO",
  "First stake scapeshift",
]


type ValidatorTx = {
  address: string
  amount: number
  type: ValidatorTxType
  timestamp: number
}

enum ValidatorTxType{
  Stake,
  Unstake
}

export const getAllTx = async () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1))
  .map((x) => JSON.parse(x))

  return allTx;
}

const convertToValidatorTx = (allTx: Tx[]): ValidatorTx[] => {
  const stakeOps = allTx.filter(tx => tx.messages[0] !== undefined && delegateMemos.includes(tx.memo)).map(tx => {
    return {
      address: tx.messages[0].from,
      amount: getUAtomAmount(tx.messages[0].value),
      type: ValidatorTxType.Stake,
      timestamp: tx.timestamp
    }
  })
  const validatorStakingAddressList = _.uniq(stakeOps.map(op => op.address))

  const unstakeOps = allTx.filter(tx => tx.messages[0] !== undefined && tx.messages[0].type === "begin_unbonding").map(tx => {
    return {
      address: tx.messages[0].to,
      amount: getUAtomAmount(tx.messages[0].value),
      type: ValidatorTxType.Unstake,
      timestamp: tx.timestamp
    }
  }).filter(x => validatorStakingAddressList.includes(x.address))
  const allValidatorTx = _.sortBy([...stakeOps, ...unstakeOps], x => x.timestamp)
  return allValidatorTx
}

const getUAtomAmount = (data: Fee) => {
  if (data.denom == "uatom") {
    return Number(data.amount);
  } else {
    return 0;
  }
}


// 1. Get All Tx
// 2. Filter them into stake and unstake types
// 3. Aggregate the data into a meaningful result 

export const getCoinStakingData = async () => {
  const allTx = await getAllTx()
  const validatorTx = convertToValidatorTx(allTx)

  const totalStaked = _.sumBy(validatorTx.filter(p => p.type === ValidatorTxType.Stake), x => x.amount)
  const totalUnstaked = _.sumBy(validatorTx.filter(p => p.type === ValidatorTxType.Unstake), x => x.amount)

  const historyData = getHistoryData(validatorTx);
  const validatorDetails = await getValidatorDetails()

  return {
    coinStats: {
      totalStaked: uAtomToAtom(totalStaked),
      totalUnstaked: uAtomToAtom(totalUnstaked),
      coin: "ATOM",
    },
    historyData: historyData,
    validatorDetails: validatorDetails
  };
};

const getHistoryData = (validatorTx: ValidatorTx[]) => {

  var totalValue = 0;

  return validatorTx.map(x => {
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

const uAtomToAtom = (amount: number) => amount / 1000000;
const atomtoUAtom = (amount: number) => amount * 1000000;
