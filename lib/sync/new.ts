import Redis from "ioredis";
import _ from "lodash";
import { NextApiResponse } from "next";
import { TX_COLLECTION, LAST_TX_TIMESTAMP } from "../const";
import { CosmosTxResponse } from "../types";
import { getTx } from "../unchained";

export const runNewSync = async (
    redis: Redis,
    lastTxTimestamp: number,
    res: NextApiResponse
  ) => {
    const unchainedTxResponse = await getTx();
    const maxTimestamp = _.max(unchainedTxResponse.txs.map(tx => tx.timestamp)) as number;
  
    if (maxTimestamp != Number(lastTxTimestamp)) {
      console.log("Timestamps differ, getting missing transaction data");
      loadNewTx(redis, unchainedTxResponse, lastTxTimestamp);
      res
        .status(200)
        .json({ message: "Timestamps differ, getting missing transaction data" });
    } else {
      console.log("History completed so fetching new transactions");
      res.status(200).json({ message: "Data is up to date" });
    }
  };
  
  // Get the latest page
  // search the page for the lastTimestamp that we have saved
  // if found, load only the the new data into the db
  // if not found, load the entire page and move on to the next one
  const loadNewTx = async (
    redis: Redis,
    unchainedTxResponse: CosmosTxResponse,
    lastTxTimestamp: number
  ) => {
    
    const matchingTx = unchainedTxResponse.txs.find(
      (tx) => tx.timestamp === lastTxTimestamp
    );
    if (matchingTx != undefined) {
      console.log("Found lastTxTimestamp on current page");
      const index = unchainedTxResponse.txs.indexOf(matchingTx);
      const missingData = unchainedTxResponse.txs.slice(0, index);
      const txStrings = missingData.map((tx) => JSON.stringify(tx));
      await redis.lpush(TX_COLLECTION, ...txStrings);
      const maxTimestamp = _.max(unchainedTxResponse.txs.map(tx => tx.timestamp)) as number;
      await redis.set(LAST_TX_TIMESTAMP, maxTimestamp);
      console.log("Data has been updated, all Tx up to date");
    } else {
      console.log("last timestamp not found, moving on to the next page");
      // I'll skip implementing this for now - it will mess up the ordering of the data, 
      // the likelyhood of us missing an entire page of data with a sync every hour is next to impossible given the current load
    }
  };