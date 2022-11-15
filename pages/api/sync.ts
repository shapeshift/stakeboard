import { LAST_TX_TIMESTAMP, TX_COLLECTION, CURSOR, pageSize, SYNC_COMPLETE, VALIDATOR_ADDR } from "@/lib/const";
import { CosmosTxResponse } from "@/lib/unchained";
import axios from "axios";
import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  const lastTxTimestamp = await redis.get(LAST_TX_TIMESTAMP);
  const completed = await isSyncCompleted(redis);

  // There's two high-level cases to consider: whether we do we have the history backfill completed or not.
  // If not, we start with fetching the validator history (till "start of time") and on subsequent syncs only focus on loading new data
  if (!completed) {
    handleIncompleteHistory(redis, lastTxTimestamp, res);
  } else {
    handleCompleteHistory(redis, Number(lastTxTimestamp), res);
  }
}

const handleCompleteHistory = async (
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
// search the page for the lastTimestamp that we have found
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

const handleIncompleteHistory = async (
  redis: Redis,
  lastTxTimestamp: string | null,
  res: NextApiResponse
) => {
  if (lastTxTimestamp != null) {
    console.log("History sync started but not completed, resuming");
    syncFullHistory(redis);
    res.status(200).json({ message: "Completing full history sync" });
  } else {
    await startHistorySync(redis);
    res.status(200).json({ message: "Starting full history sync" });
  }
};

// loads the latest transactions, set the LAST_TX_TIMESTAMP, CURSOR and run sync loop in background
const startHistorySync = async (redis: Redis) => {
  console.log("Last timestamp not found, syncing full history");

  const unchainedTxResponse = await getTx();
  const txStrings = unchainedTxResponse.txs.map((tx) => JSON.stringify(tx));
  await redis.lpush(TX_COLLECTION, ...txStrings);

  await redis.set(CURSOR, unchainedTxResponse.cursor);

  const maxTimestamp = _.last(unchainedTxResponse.txs)?.timestamp as number;

  console.log(`Setting ${LAST_TX_TIMESTAMP} to ${maxTimestamp}`);
  await redis.set(LAST_TX_TIMESTAMP, maxTimestamp);
  // lack of await is on purpose here
  syncFullHistory(redis);
};

const syncFullHistory = async (redis: Redis) => {
  const cursor: string = (await redis.get(CURSOR)) || "";

  if (!(await isSyncCompleted(redis))) {
    console.log(`Sync not yet completed, getting a page for cursor ${cursor}`);

    const unchainedTxResponse = await getTx(cursor);
    if (unchainedTxResponse.txs.length < pageSize) {
      console.log(
        `Sync completed, last page size ${unchainedTxResponse.txs.length}`
      );
      await redis.set(SYNC_COMPLETE, "true");
    }

    const txStrings = unchainedTxResponse.txs.map((tx) => JSON.stringify(tx));
    await redis.lpush(TX_COLLECTION, ...txStrings);
    await redis.set(CURSOR, unchainedTxResponse.cursor);
    console.log(
      `Saved ${txStrings.length} txs, moving cursor`
    );
    await syncFullHistory(redis);
  } else {
    console.log("Completed full history sync");
  }
};

// This call fails every now and then due to I/O timeouts on unchained. Instead of having a retry mechanism
// this is implicitly handled by the sync mechanism - on the first /sync call after a failure it simply picks up where it left off
export const getTx = async (cursor?: string): Promise<CosmosTxResponse> => {
  const { data } = await axios.get(
    `${process.env.UNCHAINED_HOST}/api/v1/validators/${VALIDATOR_ADDR}/txs`,
    { params: { cursor: cursor, pageSize: pageSize } }
  );
  return data;
};

const isSyncCompleted = async (redis: Redis) => (await redis.get(SYNC_COMPLETE)) === "true";
