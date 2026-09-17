import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisService from "../services/redis.service.js";

// Helper to provide sendCommand to RedisStore
const sendCommand = (...args) => {
  const client = redisService.getRedisClient();
  if (client) {
    return client.sendCommand(args);
  }
  return Promise.reject(new Error("Redis client not initialized"));
};

// Auth rate limiter: 50 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  store: new RedisStore({ sendCommand, prefix: "rl:auth:" }),
  passOnStoreError: false, // Redis is strictly required for auth
});

// Chat rate limiter: 60 messages per minute per IP
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many chat messages sent. Please slow down.",
    code: "CHAT_RATE_LIMIT_EXCEEDED",
  },
  store: new RedisStore({ sendCommand, prefix: "rl:chat:" }),
  passOnStoreError: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
    code: "RATE_LIMIT_EXCEEDED",
  },
  store: new RedisStore({ sendCommand, prefix: "rl:general:" }),
  passOnStoreError: false,
});

export default {
  authLimiter,
  chatLimiter,
  generalLimiter,
};
