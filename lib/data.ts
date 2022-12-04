import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";
import { Fee, Tx } from "@/lib/types";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { getTokenPrice } from "./coingecko";
import { HistoryData } from "./staking";
import { ValidatorTx, ValidatorTxType } from "./tx/client";
import { getStakerData, StakerData } from "./tx/service";
import { getValidatorDetails } from "./validator";

// Data from /validators from unchained:
// Total delegated - Sum the amount of staked tokens from all validators which are not jailed
// Shapeshift delegated - the amount of staked tokens by shapeshift validator


export const getDashboardData = async () => {
  const stakerData = await getStakerData();
  const validatorDetails = await getValidatorDetails()
  const coinPrice = (await getTokenPrice("cosmos"))["cosmos"].usd;

  return {
    coinStats: {
      coin: "ATOM",
      coinUsdPrice: coinPrice
    },
    stakerData: stakerData,
    validatorDetails: validatorDetails
  };
};