import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";
import { Fee, Tx } from "@/lib/types";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { getTokenPrice } from "./coingecko";
import { HistoryData } from "./staking";
import { getStakerData } from "./tx/service";
import { getValidatorDetails } from "./validator";

// Data from /validators from unchained:
// Total delegated - Sum the amount of staked tokens from all validators which are not jailed
// Shapeshift delegated - the amount of staked tokens by shapeshift validator


export const getDashboardData = async () => {

  const stakerData = await getStakerData();
  // const allTx = await getAllTx()
  // const validatorTx = convertToValidatorTx(allTx)

  // const totalStaked = _.sumBy(validatorTx.filter(p => p.type === ValidatorTxType.Stake), x => x.amount)
  // const totalUnstaked = _.sumBy(validatorTx.filter(p => p.type === ValidatorTxType.Unstake), x => x.amount)

  

  // const delegationsOverTime = getDelegationsOverTime(validatorTx);
  

  const validatorDetails = await getValidatorDetails()
  const coinPrice = (await getTokenPrice("cosmos"))["cosmos"].usd;

  return {
    coinStats: {
      totalStaked: 0,
      totalUnstaked: 0,
      coin: "ATOM",
      coinUsdPrice: coinPrice
    },
    historyData: [],
    // stakersOverTime: stakersOverTime,
    validatorDetails: validatorDetails
  };
};

// const getDelegationsOverTime = (validatorTx: ValidatorTx[]) => {

//   var totalValue = 0;

//   return validatorTx.map(x => {
//     const tmp = x.amount
//     if(x.type == ValidatorTxType.Stake){
//       totalValue = totalValue + tmp;
//     }else{
//       totalValue = totalValue - tmp;
//     }
//     return {
//       amount: uAtomToAtom(totalValue),
//       timestamp: x.timestamp * 1000, // convert to millis
//     } as HistoryData
//   })
// };

const getStakersOverTime = () => {

}

const uAtomToAtom = (amount: number) => amount / 1000000;
const atomtoUAtom = (amount: number) => amount * 1000000;
