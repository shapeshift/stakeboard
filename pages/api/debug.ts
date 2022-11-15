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
  const allTx = await redis.lrange(TX_COLLECTION, 10, -1);
  const txData: Tx[] = allTx.map((str) => JSON.parse(str));
  const firstTx = _.min(txData.map(tx => tx.timestamp)) as number
  const lastTx = _.max(txData.map(tx => tx.timestamp)) as number


  const delegated =  txData.filter(p => p.memo === "").filter((tx) => tx.memo === "Delegated with ShapeShift");

  const qq = delegated.filter(tx => tx.events[0]["unbond"] !== undefined)
  const qq2 = txData.filter(tx => tx.events[0]["unbond"] !== undefined)


  // res.status(200).json({
  //   size: dataSize,
  //   lastTxTimestamp: readableTimestamp(timestamp),
  //   items: txData.map(x => x.memo),
  //   firstTx: readableTimestamp(firstTx),
  //   lastTx: readableTimestamp(lastTx),
  // });
  res.status(200).json({
    events: (txData.map(x => x.events))
  })
}


export const readableTimestamp = (x: number) => JSON.stringify(new Date(x*1000))