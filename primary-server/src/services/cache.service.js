import redisService from "./redis.service.js";

const OAUTH_HANDOFF_PREFIX = "oauth:google:handoff:";
const TTL_SECONDS = 60;

/**
 * Temporarily stores the handoff payload (like userId) for the Google OAuth redirect.
 * @param {string} code - The securely generated random code
 * @param {Object} payload - Data to store
 * @returns {Promise<boolean>} true on success
 */
export const setHandoffCode = async (code, payload) => {
  if (!redisService.isRedisReady()) {
    console.error("Redis is not ready, cannot set handoff code");
    return false;
  }
  const serialized = JSON.stringify(payload);
  await redisService.setWithTTL(`${OAUTH_HANDOFF_PREFIX}${code}`, serialized, TTL_SECONDS);
  return true;
};

/**
 * Retrieves and deletes the payload to ensure it is one-time use only.
 * @param {string} code 
 * @returns {Promise<Object|undefined>} The stored payload or undefined if invalid/expired
 */
export const getAndClearHandoffCode = async (code) => {
  if (!redisService.isRedisReady()) return undefined;

  const key = `${OAUTH_HANDOFF_PREFIX}${code}`;
  const data = await redisService.get(key);
  
  if (data) {
    await redisService.del(key);
    try {
      return JSON.parse(data);
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
};

export default {
  setHandoffCode,
  getAndClearHandoffCode,
};
