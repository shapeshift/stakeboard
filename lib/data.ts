import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";
import { HistoryData } from "@/lib/history";
import { Tx } from "@/lib/unchained";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";


export const getCoinStakingData = async () => {

  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  
  const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1))
    .map((x) => JSON.parse(x))
    .filter((tx) => tx.memo === "Delegated with ShapeShift");

  const totalStaked = allTx
    .map((tx) => {
      const data = tx.messages[0].value;
      if (data.denom == "uatom") {
        return Number(data.amount);
      } else {
        return atomtoUAtom(Number(data.amount));
      }
    })
    .reduce((x, y) => x + y, 0);

  const historyData = getHistoryData(allTx);
  return {
    coinStats: {
      totalStaked: uAtomToAtom(totalStaked),
      coin: "ATOM",
    },
    historyData: historyData,
  };
};

const getHistoryData = (allTx: Tx[]) => {
  const sortedDelegations = _.sortBy(allTx, (x) => x.timestamp);
  var totalValue = 0;

  const stakedData = sortedDelegations.map((x) => {
    const tmp = Number(_.first(x.messages).value.amount);
    totalValue = totalValue + tmp;
    return {
      amount: uAtomToAtom(totalValue),
      timestamp: x.timestamp * 1000, // convert to millis
    } as HistoryData;
  });
  return stakedData;
};

const uAtomToAtom = (amount: number) => amount / 1000000;
const atomtoUAtom = (amount: number) => amount * 1000000;
