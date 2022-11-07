import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Tx } from "../../lib/unchained";
import { LAST_TX_TIMESTAMP, TX_COLLECTION } from "@/lib/const";

const redis = new Redis();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const timestamp = Number(await redis.get(LAST_TX_TIMESTAMP));
  const dataSize = await redis.llen(TX_COLLECTION);
  const allTx = await redis.lrange(TX_COLLECTION, 0, -1);
  const txData: Tx[] = allTx.map((str) => JSON.parse(str));
  const firstTx = _.min(txData.map(tx => tx.timestamp)) as number
  const lastTx = _.max(txData.map(tx => tx.timestamp)) as number

  // res.status(200).json({
  //   size: dataSize,
  //   lastTxTimestamp: readableTimestamp(timestamp),
  //   items: txData.map(x => x.memo),
  //   firstTx: readableTimestamp(firstTx),
  //   lastTx: readableTimestamp(lastTx),
  // });
  res.status(200).json({
    memos: _.uniq(txData.map(x => x.memo))
  })
}


export const readableTimestamp = (x: number) => JSON.stringify(new Date(x*1000))