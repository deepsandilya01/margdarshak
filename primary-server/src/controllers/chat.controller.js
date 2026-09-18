import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import chatService from "../services/chat.service.js";
import crypto from "crypto";
import redisService from "../services/redis.service.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId, language, context } = req.body;
  const resolvedLanguage = language || req.user.preferredLanguage || "auto";

  // Cache Key Generation (deterministic elements only)
  const cachePayload = `${req.user._id}:${sessionId}:${resolvedLanguage}:${message}`;
  const cacheHash = crypto.createHash("sha256").update(cachePayload).digest("hex");
  const cacheKey = `cache:ai:${cacheHash}`;

  if (redisService.isRedisReady()) {
    const cachedResponse = await redisService.get(cacheKey);
    if (cachedResponse) {
      try {
        const parsed = JSON.parse(cachedResponse);
        return new ApiResponse(200, parsed, "Message processed successfully (cached)").send(res);
      } catch (e) {
        // Ignore parse error and proceed to normal processing
      }
    }
  }

  const result = await chatService.processChat({
    userId: req.user._id,
    sessionId,
    message,
    language: resolvedLanguage,
    context,
  });

  if (redisService.isRedisReady() && result) {
    // Cache for 5 minutes
    await redisService.setWithTTL(cacheKey, JSON.stringify(result), 300);
  }

  return new ApiResponse(200, result, "Message processed successfully").send(res);
});

export default {
  sendMessage,
};
