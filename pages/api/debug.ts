import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Tx } from "../../lib/types";
import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  const allTx = await redis.lrange(TX_COLLECTION, 0, -1);
  // const txData: Tx[] = allTx.map((str) => JSON.parse(str))
  const lastTimestamp = await redis.get(LAST_TX_TIMESTAMP)
  // const data = await getAllStakedTx()

  res.status(200).json({
    // data: txData,
    timestamp: lastTimestamp
  })
}


export const readableTimestamp = (x: number) => JSON.stringify(new Date(x*1000))