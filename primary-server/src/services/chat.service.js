import mongoose from "mongoose";
import Session from "../models/Session.js";
import Message from "../models/Message.js";
import { callChatService } from "./ai.service.js";
import { AppError } from "../utils/AppError.js";

export const processChat = async ({ userId, sessionId, message, language = "auto", context = {} }) => {
  let session;

  if (sessionId) {
    if (!mongoose.isValidObjectId(sessionId)) {
      throw new AppError(400, "Invalid sessionId format", "INVALID_ID");
    }
    session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new AppError(404, "Session not found or access denied", "RESOURCE_NOT_FOUND");
    }
  } else {
    // Generate an intuitive title from the first query
    const cleanMessage = message.trim();
    const title = cleanMessage.length > 45 ? `${cleanMessage.slice(0, 45)}...` : cleanMessage;
    session = await Session.create({
      userId,
      title: title || "New Chat",
    });
  }

  // 1. Persist User Message
  const userMessage = await Message.create({
    sessionId: session._id,
    userId,
    role: "user",
    content: message.trim(),
    language,
  });

  // 2. Bubble session to top of history
  session.updatedAt = new Date();
  await session.save();

  // 3. Retrieve a bounded conversation context and run the internal Node AI stack
  const history = await Message.find({ sessionId: session._id, role: { $in: ["user", "assistant"] } })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  const aiResult = await callChatService({
    sessionId: session._id.toString(),
    message: message.trim(),
    language,
    context,
    history: history.reverse().map((item) => ({ role: item.role, content: item.content })),
  });

  // 4. Persist Assistant Response
  const assistantMessage = await Message.create({
    sessionId: session._id,
    userId,
    role: "assistant",
    content: aiResult.answer.text || "Processing complete.",
    language: aiResult.answer.language || language,
    evidence: aiResult.evidence || [],
    citations: aiResult.citations || [],
    related: aiResult.related || { standards: [], qcos: [], labs: [] },
    status: aiResult.status || "success",
    requestId: aiResult.requestId,
  });

  return {
    requestId: aiResult.requestId,
    sessionId: session._id.toString(),
    status: aiResult.status,
    answer: aiResult.answer,
    evidence: aiResult.evidence,
    context: aiResult.evidence || [],
    citations: aiResult.citations || [],
    intent: aiResult.intent,
    related: aiResult.related,
    actions: aiResult.actions,
    messageId: assistantMessage._id.toString(),
    userMessageId: userMessage._id.toString(),
    sessionTitle: session.title,
  };
};

export default {
  processChat,
};
