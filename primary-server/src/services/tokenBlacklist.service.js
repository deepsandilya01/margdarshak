import redisService from "./redis.service.js";

const ACCESS_PREFIX = "auth:blacklist:access:";
const REFRESH_PREFIX = "auth:blacklist:refresh:";

export const blacklistAccessToken = async (jti, ttlSeconds) => {
  if (!jti || ttlSeconds <= 0) return;
  // If Redis is down, we silently fail for non-critical logging, but for auth we should ideally throw.
  // We'll let the redis.service handle throw if completely disconnected, or gracefully continue.
  if (!redisService.isRedisReady()) return;
  
  await redisService.setWithTTL(`${ACCESS_PREFIX}${jti}`, "revoked", ttlSeconds);
};

export const isAccessTokenBlacklisted = async (jti) => {
  if (!jti || !redisService.isRedisReady()) return false;
  return await redisService.exists(`${ACCESS_PREFIX}${jti}`);
};

export const blacklistRefreshToken = async (jti, ttlSeconds) => {
  if (!jti || ttlSeconds <= 0 || !redisService.isRedisReady()) return;
  await redisService.setWithTTL(`${REFRESH_PREFIX}${jti}`, "revoked", ttlSeconds);
};

export const isRefreshTokenBlacklisted = async (jti) => {
  if (!jti || !redisService.isRedisReady()) return false;
  return await redisService.exists(`${REFRESH_PREFIX}${jti}`);
};

export default {
  blacklistAccessToken,
  isAccessTokenBlacklisted,
  blacklistRefreshToken,
  isRefreshTokenBlacklisted,
};
