import { createClient } from "redis";
import env from "../config/env.js";

let redisClient = null;

export const connectRedis = async () => {
  if (redisClient) return redisClient;

  redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries >= 3) {
          return new Error("Max reconnect attempts reached");
        }
        return Math.min(retries * 500, 2000);
      },
    },
  });

  redisClient.on("error", (err) => {
    // Log standard messages to avoid leaking connection strings/credentials
    console.error("Redis Client Error:", err.message || "Connection failed");
  });

  redisClient.on("ready", () => {
    console.log("✅ Redis successfully connected");
  });

  redisClient.on("reconnecting", () => {
    console.log("⏳ Redis reconnecting...");
  });

  try {
    await redisClient.connect();
    const pingResult = await redisClient.ping();
    if (pingResult !== "PONG") {
      throw new Error("Redis PING failed");
    }
  } catch (error) {
    console.error("Failed to initialize Redis connection during startup.");
    throw new Error("Critical Dependency Failure: Redis");
  }
  
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("Redis disconnected gracefully");
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client is not connected");
  }
  return redisClient;
};

export const isRedisReady = () => {
  return redisClient && redisClient.isReady;
};

// Common operations wrappers
export const get = async (key) => {
  return getRedisClient().get(key);
};

export const set = async (key, value) => {
  return getRedisClient().set(key, value);
};

export const setWithTTL = async (key, value, ttlSeconds) => {
  return getRedisClient().set(key, value, { EX: ttlSeconds });
};

export const del = async (key) => {
  return getRedisClient().del(key);
};

export const exists = async (key) => {
  return getRedisClient().exists(key);
};

export const expire = async (key, ttlSeconds) => {
  return getRedisClient().expire(key, ttlSeconds);
};

export const ttl = async (key) => {
  return getRedisClient().ttl(key);
};

export default {
  connectRedis,
  disconnectRedis,
  getRedisClient,
  isRedisReady,
  get,
  set,
  setWithTTL,
  del,
  exists,
  expire,
  ttl,
};
