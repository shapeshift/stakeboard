import Redis from "ioredis";
import { SYNC_COMPLETE } from "../const";
import { CosmosTxResponse } from "../types";

export const isInitialSyncCompleted = async (redis: Redis) => (await redis.get(SYNC_COMPLETE)) === "true";

export const serializeTx = (unchainedTxResponse) => {
    return unchainedTxResponse.txs.map((tx) => JSON.stringify(tx))
}