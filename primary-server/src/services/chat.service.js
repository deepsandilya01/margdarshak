const mongoose = require("mongoose");
const axios = require("axios");
const sessionRepository = require("../repositories/session.repository");
const messageRepository = require("../repositories/message.repository");
const { ApiError } = require("../utils/ApiError");

const processChatRequest = async ({ userId, sessionId, message, language = "en" }) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(400, "Valid sessionId is required", "VALIDATION_ERROR");
  }

  // 1. Verify session ownership
  const session = await sessionRepository.findSessionInstanceByIdForUser(userId, sessionId);
  if (!session) {
    throw new ApiError(404, "Session not found", "RESOURCE_NOT_FOUND");
  }

  // 2. Save user message
  const userMessage = await messageRepository.createMessage({
    sessionId,
    role: "user",
    content: message.trim(),
  });

  // Update session updatedAt to bubble it up in history
  await sessionRepository.updateSessionTime(session);

  // 3. Forward to FastAPI
  const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8001";
  let fastApiResponse;

  try {
    const response = await axios.post(`${fastApiUrl}/chat`, {
      sessionId,
      message: message.trim(),
      language,
    });
    fastApiResponse = response.data;
  } catch (error) {
    console.error("FastAPI Error:", error.message);
    
    const errorMsg = await messageRepository.createMessage({
      sessionId,
      role: "assistant",
      content: "I'm sorry, I am currently experiencing technical difficulties processing your request.",
      status: "error",
    });

    return { error: true, message: errorMsg };
  }

  // 4. Save AI Response
  const assistantMessage = await messageRepository.createMessage({
    sessionId,
    role: "assistant",
    content: fastApiResponse.answer || "Processing complete.",
    status: fastApiResponse.status || "success",
    intent: fastApiResponse.intent,
    citations: fastApiResponse.citations || [],
    requestId: fastApiResponse.requestId,
  });

  return { error: false, message: assistantMessage };
};

module.exports = {
  processChatRequest,
};
