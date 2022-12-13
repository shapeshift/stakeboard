import { TX_COLLECTION } from "@/lib/const";
import { Fee, Tx } from "@/lib/types";
import Redis from "ioredis";
import _ from "lodash";


export type ValidatorTx = {
    validatorAddr: string
    stakerAddr: string
    amount: number
    type: ValidatorTxType
    timestamp: number
    memo: string
  }
  
  export enum ValidatorTxType{
    Stake,
    Unstake
  }


export const getAllTx = async (): Promise<ValidatorTx[]> => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
    });
  
    const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1))
    .map((x) => JSON.parse(x))
  
    return convertToValidatorTx(allTx);
  }



const convertToValidatorTx = (allTx: Tx[]): ValidatorTx[] => {
    const stakeOps = allTx.filter(tx => tx.messages[0] !== undefined && tx.messages[0].type === "delegate").map(tx => {
      // TODO split address into "from" and "to" since currently we are not summing up the data for validators /facepalm
      return {
        stakerAddr: tx.messages[0].from,
        validatorAddr: tx.messages[0].to,
        amount: getUAtomAmount(tx.messages[0].value),
        type: ValidatorTxType.Stake,
        timestamp: tx.timestamp,
        memo: tx.memo
      }
    })
    const unstakeOps = allTx.filter(tx => tx.messages[0] !== undefined && tx.messages[0].type === "begin_unbonding").map(tx => {
      return {
        validatorAddr: tx.messages[0].from,
        stakerAddr: tx.messages[0].to,
        amount: getUAtomAmount(tx.messages[0].value),
        type: ValidatorTxType.Unstake,
        timestamp: tx.timestamp,
        memo: tx.memo
      }
    })
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