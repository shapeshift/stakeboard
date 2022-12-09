import Redis from "ioredis";
import _ from "lodash";
import { NextApiResponse } from "next";
import { CURSOR, LAST_TX_TIMESTAMP, pageSize, SYNC_COMPLETE, TX_COLLECTION } from "../const";
import { getTx } from "../unchained";
import { isInitialSyncCompleted, serializeTx } from "./shared";


export const runInitialSync = async (
    redis: Redis,
    lastTxTimestamp: string | null,
    res: NextApiResponse
  ) => {
    if (lastTxTimestamp != null) {
      console.log("History sync started but not completed, resuming");
      syncHistoryLoop(redis);
      res.status(200).json({ message: "Resuming initial history sync" });
    } else {
      await startHistorySync(redis);
      res.status(200).json({ message: "Starting initial history sync" });
    }
  };

  
// loads the latest transactions, set the LAST_TX_TIMESTAMP, CURSOR and run sync loop in background
const startHistorySync = async (redis: Redis) => {
    console.log("Last timestamp not found, syncing full history");
  
    const unchainedTxResponse = await getTx();
    await redis.lpush(TX_COLLECTION, ...serializeTx(unchainedTxResponse));
    await redis.set(CURSOR, unchainedTxResponse.cursor);
  
    const maxTimestamp = _.last(unchainedTxResponse.txs)?.timestamp as number;
  
    console.log(`Setting ${LAST_TX_TIMESTAMP} to ${maxTimestamp}`);
    await redis.set(LAST_TX_TIMESTAMP, maxTimestamp);
    // lack of await is on purpose here
    syncHistoryLoop(redis);
  };
  
  const syncHistoryLoop = async (redis: Redis) => {
    const cursor: string = (await redis.get(CURSOR)) || "";
  
    if (!(await isInitialSyncCompleted(redis))) {
      const unchainedTxResponse = await getTx(cursor);
      if(unchainedTxResponse){
        if (unchainedTxResponse.txs.length < pageSize) {
          console.log(
            `Sync completed, last page size ${unchainedTxResponse.txs.length}`
          );
          await redis.set(SYNC_COMPLETE, "true");
        }
    
        const txStrings = unchainedTxResponse.txs.map((tx) => JSON.stringify(tx));
        await redis.lpush(TX_COLLECTION, ...txStrings);
        await redis.set(CURSOR, unchainedTxResponse.cursor);
        const total = await redis.llen(TX_COLLECTION)
        console.log(
          `Saved ${txStrings.length} txs, total at ${total}, moving cursor`
        );
        await syncHistoryLoop(redis);
      }
    } else {
      console.log("Completed full history sync");
    }
  };