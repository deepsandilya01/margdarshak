import { User } from "../models/User.js";
import { Standard } from "../models/Standard.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ingestDirectory } from "../services/ingestion/ingestBis.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -__v').limit(50).lean();
  res.status(200).json({ success: true, data: users });
});

export const createStandard = asyncHandler(async (req, res) => {
  const standard = await Standard.create(req.body);
  res.status(201).json({ success: true, data: standard });
});

export const updateStandard = asyncHandler(async (req, res) => {
  const standard = await Standard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!standard) throw new AppError(404, "Standard not found", "NOT_FOUND");
  res.status(200).json({ success: true, data: standard });
});

export const ingestBisDocuments = asyncHandler(async (req, res) => {
  const report = await ingestDirectory(req.body?.directory);
  res.status(200).json({ success: true, data: report });
});
