const mongoose = require("mongoose");
const sessionRepository = require("../repositories/session.repository");
const messageRepository = require("../repositories/message.repository");
const { ApiError } = require("../utils/ApiError");

const createSession = async (userId, title) => {
  return await sessionRepository.createSession({ userId, title });
};

const findSessions = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  return await sessionRepository.findSessionsByUserId(userId, skip, limit);
};

const findSessionById = async (userId, sessionId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(400, "Invalid session ID format", "INVALID_ID");
  }

  const session = await sessionRepository.findSessionByIdForUser(userId, sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found", "RESOURCE_NOT_FOUND");
  }

  return session;
};

const findSessionMessages = async (userId, sessionId) => {
  // Verifies ownership implicitly by fetching session
  await findSessionById(userId, sessionId);

  return await messageRepository.findMessagesBySessionId(sessionId);
};

module.exports = {
  createSession,
  findSessions,
  findSessionById,
  findSessionMessages,
};
