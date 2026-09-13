const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const sessionService = require("../services/session.service");

const createSession = asyncHandler(async (req, res) => {
  let { title } = req.body;
  if (!title || !title.trim()) {
    title = "New Chat";
  } else {
    title = title.trim();
  }

  const session = await sessionService.createSession(req.user._id, title);

  return res.status(201).json(
    new ApiResponse(201, {
      session: {
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    }, "Session created successfully")
  );
});

const getSessions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  if (page < 1 || limit < 1 || limit > 100) {
    throw new ApiError(400, "Invalid pagination parameters", "VALIDATION_ERROR");
  }

  const { sessions, total } = await sessionService.findSessions(req.user._id, page, limit);

  const formattedSessions = sessions.map((s) => ({
    id: s._id,
    title: s.title,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedSessions, "Sessions retrieved successfully", { page, total })
  );
});

const getSessionById = asyncHandler(async (req, res) => {
  const session = await sessionService.findSessionById(req.user._id, req.params.id);

  return res.status(200).json(
    new ApiResponse(200, {
      session: {
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    }, "Session details retrieved successfully")
  );
});

const getSessionMessages = asyncHandler(async (req, res) => {
  const messages = await sessionService.findSessionMessages(req.user._id, req.params.id);

  const formattedMessages = messages.map((m) => {
    const msg = {
      id: m._id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    };
    if (m.role === "assistant") {
      msg.status = m.status;
      msg.intent = m.intent;
      msg.citations = m.citations || [];
      msg.requestId = m.requestId;
    }
    return msg;
  });

  return res.status(200).json(
    new ApiResponse(200, { messages: formattedMessages }, "Session messages retrieved successfully")
  );
});

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  getSessionMessages,
};
