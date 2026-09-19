import mongoose from "mongoose";
import Session from "../models/Session.js";
import Message from "../models/Message.js";
import { AppError } from "../utils/AppError.js";

export const createSession = async (userId, title = "New Chat") => {
  const session = await Session.create({
    userId,
    title: title ? title.trim() : "New Chat",
  });
  return session;
};

export const listSessions = async (userId, { page = 1, limit = 50 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [sessions, total] = await Promise.all([
    Session.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Session.countDocuments({ userId }),
  ]);

  return {
    sessions: sessions.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getSessionById = async (userId, sessionId) => {
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError(400, "Invalid sessionId format", "INVALID_ID");
  }

  const session = await Session.findOne({ _id: sessionId, userId }).lean();
  if (!session) {
    throw new AppError(404, "Session not found or access denied", "RESOURCE_NOT_FOUND");
  }

  return {
    id: session._id.toString(),
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
};

export const updateSession = async (userId, sessionId, { title }) => {
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError(400, "Invalid sessionId format", "INVALID_ID");
  }

  const session = await Session.findOneAndUpdate(
    { _id: sessionId, userId },
    { $set: { title: title ? title.trim() : "New Chat" } },
    { new: true }
  );

  if (!session) {
    throw new AppError(404, "Session not found or access denied", "RESOURCE_NOT_FOUND");
  }

  return {
    id: session._id.toString(),
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
};

export const getSessionMessages = async (userId, sessionId) => {
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError(400, "Invalid sessionId format", "INVALID_ID");
  }

  // Verify session exists and belongs to the authenticated user
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new AppError(404, "Session not found or access denied", "RESOURCE_NOT_FOUND");
  }

  const messages = await Message.find({ sessionId }).sort({ createdAt: 1 }).lean();

  return messages.map((m) => ({
    id: m._id.toString(),
    role: m.role,
    content: m.content,
    language: m.language,
    evidence: m.evidence || [],
    citations: m.citations || [],
    related: m.related || { standards: [], qcos: [], labs: [] },
    status: m.status,
    requestId: m.requestId,
    createdAt: m.createdAt,
  }));
};

export const deleteSession = async (userId, sessionId) => {
  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError(400, "Invalid sessionId format", "INVALID_ID");
  }

  const session = await Session.findOneAndDelete({ _id: sessionId, userId });
  if (!session) {
    throw new AppError(404, "Session not found or access denied", "RESOURCE_NOT_FOUND");
  }

  // Delete all messages associated with this session
  await Message.deleteMany({ sessionId });

  return true;
};

export default {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  getSessionMessages,
  deleteSession,
};
