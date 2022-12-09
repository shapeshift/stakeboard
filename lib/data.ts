import _ from "lodash";
import { getTokenPrice } from "./coingecko";
import { getStakerData } from "./tx/service";
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