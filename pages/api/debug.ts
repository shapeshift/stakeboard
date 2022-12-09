import Redis from "ioredis";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { DelegatorMapEntry } from "@/lib/tx/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  const addressMapStr = await redis.get("addressMap")
  const addressMap:  Map<string, DelegatorMapEntry> = new Map(Object.entries(JSON.parse(addressMapStr)));
  
  console.log(addressMap.size)
  
  const { address } = req.query
  const data = addressMap.get(address as string)

  res.status(200).json({
    addressData: data
  })
}


export const readableTimestamp = (x: number) => JSON.stringify(new Date(x*1000))