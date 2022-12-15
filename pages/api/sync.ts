import { LAST_TX_TIMESTAMP } from "@/lib/const";
import { runInitialSync } from "@/lib/sync/initial";
import { runNewSync } from "@/lib/sync/new";
import { isInitialSyncCompleted } from "@/lib/sync/shared";
import { runValidatorSync } from "@/lib/sync/validators";
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
  const completed = await isInitialSyncCompleted(redis);

  runValidatorSync(redis);

  // The sync runs in one of two modes: 
  // Initial - when the DB is empty, we need to fetch all historical transactions starting from now till the first one (isInitialSyncCompleted)
  // New - Once we know that our data is valid until some recent point in time, we fetch only the new missing data until that moment (lastTxTimestamp)

  if (!completed) {
    runInitialSync(redis, lastTxTimestamp, res);
  } else {
    runNewSync(redis, Number(lastTxTimestamp), res);
  }
}



