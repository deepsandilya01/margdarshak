import redis from "redis";
import env from "./env.js";

let redisClient = null;

export async function getRedisClient() {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = redis.createClient({ url: env.REDIS_URL });
    redisClient.on("error", (error) => {
      console.error("Redis client error:", error.message);
    });

    await redisClient.connect();
  }

  return redisClient;
}
