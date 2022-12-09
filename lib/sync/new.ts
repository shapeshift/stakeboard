import Redis from "ioredis";
import _ from "lodash";
import { NextApiResponse } from "next";
import { TX_COLLECTION, LAST_TX_TIMESTAMP, CURSOR } from "../const";
import { CosmosTxResponse, Tx } from "../types";
import { getTx } from "../unchained";
import { serializeTx } from "./shared";

const latestTxFromResp = (unchainedTxResponse): Number => { return _.max(unchainedTxResponse.txs.map(tx => tx.timestamp)) as number }

const isAllDataUpToDate = (unchainedTxResponse, lastTxTimestamp) => {
  return latestTxFromResp(unchainedTxResponse) == Number(lastTxTimestamp)
}

export const runNewSync = async (
    redis: Redis,
    lastTxTimestamp: number,
    res: NextApiResponse
  ) => {
    const unchainedTxResponse: CosmosTxResponse = await getTx();
    
    if(isAllDataUpToDate(unchainedTxResponse, lastTxTimestamp)){
      const msg = "Data is up to date"
      console.log(msg);
      res.status(200).json({ message: msg });
    }else{
      await saveCurrentResponse(redis, unchainedTxResponse, lastTxTimestamp)
      const msg = `Data not up to date, starting sync: ${lastTxTimestamp} != ${latestTxFromResp(unchainedTxResponse)}`
      console.log(msg);
      syncHistoryLoop(redis, lastTxTimestamp);
      res.status(200).json({ message: msg });
    }
  };

  const syncHistoryLoop = async (redis: Redis, lastTxTimestamp: number) => {
    const cursor: string = (await redis.get(CURSOR)) || "";
    const unchainedTxResponse = await getTx(cursor);
    console.log("Getting next data page");
    await saveCurrentResponse(redis, unchainedTxResponse, lastTxTimestamp)

    if(responseContainsLatestTx(unchainedTxResponse, lastTxTimestamp)){
      await finishSync(redis)
    }else{
      await syncHistoryLoop(redis, lastTxTimestamp)
    }
  };

  const responseContainsLatestTx = (unchainedTxResponse: CosmosTxResponse, lastTxTimestamp: number): boolean => {
    return unchainedTxResponse.txs.find(
      (tx) => tx.timestamp === lastTxTimestamp
    ) !== undefined;
  }

  const saveCurrentResponse = async (
    redis: Redis,
    unchainedTxResponse: CosmosTxResponse,
    lastTxTimestamp: number
  ) => {
    const matchingTx = unchainedTxResponse.txs.find(
      (tx) => tx.timestamp === lastTxTimestamp
    );

    if (matchingTx !== undefined) {
      console.log("Found lastTxTimestamp on current page");
      const index = unchainedTxResponse.txs.indexOf(matchingTx);
      const data: string[] = unchainedTxResponse.txs.slice(0, index).map((tx) => JSON.stringify(tx))
      await redis.lpush(TX_COLLECTION, data);
      console.log("Data has been updated, all Tx up to date");
    } else {
      // save entire page, set cursor for next request
      console.log("Saved a new page, moving cursor");
      await redis.lpush(TX_COLLECTION, serializeTx(unchainedTxResponse));
      await redis.set(CURSOR, unchainedTxResponse.cursor);
    }
  }

// data can be unordered, so we need to sort it
const finishSync = async (redis: Redis) => {
  const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1)).map((x) => JSON.parse(x))
  const newLatestTx = _.max(allTx.map(x => x.timestamp))
  console.log(`Sync completed, setting lastestTx to ${newLatestTx}`)
  await redis.set(LAST_TX_TIMESTAMP, newLatestTx);
  await redis.set(CURSOR, "");
}