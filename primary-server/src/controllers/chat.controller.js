const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const chatService = require("../services/chat.service");

const chat = asyncHandler(async (req, res) => {
  const { sessionId, message, language = "en" } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "Valid sessionId is required", "VALIDATION_ERROR");
  }

  if (!message || !message.trim()) {
    throw new ApiError(400, "Message content is required", "VALIDATION_ERROR");
  }

  const { error, message: resultMessage } = await chatService.processChatRequest({
    userId: req.user._id,
    sessionId,
    message,
    language,
  });

  const formattedMessage = {
    id: resultMessage._id,
    role: resultMessage.role,
    content: resultMessage.content,
    status: resultMessage.status,
    createdAt: resultMessage.createdAt,
  };

  if (resultMessage.intent) formattedMessage.intent = resultMessage.intent;
  if (resultMessage.citations) formattedMessage.citations = resultMessage.citations;
  if (resultMessage.requestId) formattedMessage.requestId = resultMessage.requestId;

  if (error) {
    return res.status(500).json(
      new ApiResponse(500, { message: formattedMessage }, "AI service unavailable")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, { message: formattedMessage }, "Message processed successfully")
  );
});

module.exports = {
  chat,
};
