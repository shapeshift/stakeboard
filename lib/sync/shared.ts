import Redis from "ioredis";
import { SYNC_COMPLETE } from "../const";

export const isInitialSyncCompleted = async (redis: Redis) => (await redis.get(SYNC_COMPLETE)) === "true";