import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sessionService from "../services/session.service.js";

export const createSession = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const session = await sessionService.createSession(req.user._id, title);
  return new ApiResponse(201, session, "Session created successfully").send(res);
});

export const getSessions = asyncHandler(async (req, res) => {
  const result = await sessionService.listSessions(req.user._id, req.query);
  return new ApiResponse(200, result.sessions, "Sessions retrieved successfully", result.meta).send(res);
});

export const getSessionById = asyncHandler(async (req, res) => {
  const session = await sessionService.getSessionById(req.user._id, req.params.id);
  return new ApiResponse(200, session, "Session retrieved successfully").send(res);
});

export const updateSession = asyncHandler(async (req, res) => {
  const session = await sessionService.updateSession(req.user._id, req.params.id, req.body);
  return new ApiResponse(200, session, "Session updated successfully").send(res);
});

export const getSessionMessages = asyncHandler(async (req, res) => {
  const messages = await sessionService.getSessionMessages(req.user._id, req.params.id);
  return new ApiResponse(200, { messages }, "Session messages retrieved successfully").send(res);
});

export const deleteSession = asyncHandler(async (req, res) => {
  await sessionService.deleteSession(req.user._id, req.params.id);
  return new ApiResponse(200, null, "Session deleted successfully").send(res);
});

export default {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  getSessionMessages,
  deleteSession,
};
