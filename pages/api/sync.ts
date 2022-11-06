import axios from "axios";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { CosmosTxResponse } from "../../lib/types";

const LAST_TX_TIMESTAMP = "lastTxTimestamp";
const CURSOR = "cursor"
const SYNC_COMPLETE = "syncComplete"
const TX_COLLECTION = "txCollection";
const VALIDATOR_ADDR = "cosmosvaloper199mlc7fr6ll5t54w7tts7f4s0cvnqgc59nmuxf";
const pageSize = 20

const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lastTxTimestamp = await redis.get(LAST_TX_TIMESTAMP);
  const completed = await isSyncCompleted()

  if(!completed && lastTxTimestamp != null){
    console.log("History sync started but not completed, resuming")
    syncFullHistory()
    res.status(200).json({ message: "Completing full history sync" })
  }

  if (lastTxTimestamp == null) {
    await startHistorySync();
    res.status(200).json({ message: "Starting full history sync" })
  } else {
    console.log(`Found last timestamp at ${lastTxTimestamp}`);
  }
}

// loads the latest transactions, set the LAST_TX_TIMESTAMP, CURSOR and run sync loop in background
const startHistorySync = async () => {
  console.log("Last timestamp not found, syncing full history");

  const unchainedTxResponse = await getTx();
  const txStrings = unchainedTxResponse.txs.map((tx) => JSON.stringify(tx));
  redis.lpush(TX_COLLECTION, ...txStrings);

  console.log(`Setting cursor to ${unchainedTxResponse.cursor}`)
  redis.set(CURSOR, unchainedTxResponse.cursor)

  const timestamps = unchainedTxResponse.txs.map((tx) => tx.timestamp);
  const maxTimestamp = _.max(timestamps) as number;

  console.log(`Setting ${LAST_TX_TIMESTAMP} to ${maxTimestamp}`);
  redis.set(LAST_TX_TIMESTAMP, maxTimestamp);
  // lack of await is on purpose here
  syncFullHistory()
};

const syncFullHistory = async () => {
  const cursor: string = await redis.get(CURSOR) || ""

  if(!(await isSyncCompleted())){
    console.log(`Sync not yet completed, getting a page for cursor ${cursor}`)

    const unchainedTxResponse = await getTx(cursor)
    if(unchainedTxResponse.txs.length < pageSize){
      console.log(`Sync completed, last page size ${unchainedTxResponse.txs.length}`)
      redis.set(SYNC_COMPLETE, "true")
    }

    const txStrings = unchainedTxResponse.txs.map((tx) => JSON.stringify(tx));
    redis.lpush(TX_COLLECTION, ...txStrings);
    redis.set(CURSOR, unchainedTxResponse.cursor)
    console.log(`Saved ${txStrings.length} txs, moving cursor to ${unchainedTxResponse.cursor}`)
    await syncFullHistory()
  }else{
    console.log("Completed full history sync")
  }
}




export const getTx = async (cursor?: string): Promise<CosmosTxResponse> => {
  const { data } = await axios.get(
    `http://localhost:3000/api/v1/validators/${VALIDATOR_ADDR}/txs`,
    { params: { cursor: cursor, pageSize: pageSize } }
  );
  return data;
};


const isSyncCompleted = async () => (await redis.get(SYNC_COMPLETE) === "true")