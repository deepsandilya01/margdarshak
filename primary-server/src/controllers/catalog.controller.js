import { Standard } from "../models/Standard.js";
import { QCO } from "../models/QCO.js";
import { Laboratory } from "../models/Laboratory.js";
import { Resource } from "../models/Resource.js";
import { Report } from "../models/Report.js";
import { ComplianceJourney } from "../models/ComplianceJourney.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getModel = (type) => {
  switch (type) {
    case 'standards': return Standard;
    case 'qcos': return QCO;
    case 'labs': return Laboratory;
    case 'resources': return Resource;
    case 'reports': return Report;
    case 'compliance-journeys': return ComplianceJourney;
    default: throw new AppError(400, "Invalid resource type", "INVALID_TYPE");
  }
};

export const listResources = (type) => asyncHandler(async (req, res) => {
  const Model = getModel(type);
  const filter = {};
  
  // Enforce ownership for user-specific resources
  if (['reports', 'compliance-journeys'].includes(type)) {
    if (!req.user) throw new AppError(401, "Authentication required", "UNAUTHORIZED");
    filter.userId = req.user.id;
  }

  // Basic search
  if (req.query.q) {
    filter.title = { $regex: req.query.q, $options: 'i' };
  }

  const items = await Model.find(filter).limit(50).lean();
  res.status(200).json({ success: true, data: items });
});

export const getResource = (type) => asyncHandler(async (req, res) => {
  const Model = getModel(type);
  const filter = { _id: req.params.id };

  if (['reports', 'compliance-journeys'].includes(type)) {
    if (!req.user) throw new AppError(401, "Authentication required", "UNAUTHORIZED");
    filter.userId = req.user.id;
  }

  const item = await Model.findOne(filter).lean();
  if (!item) throw new AppError(404, `${type} not found`, "NOT_FOUND");
  
  res.status(200).json({ success: true, data: item });
});

export const compareStandards = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    throw new AppError(400, "Provide at least two standard IDs for comparison", "INVALID_INPUT");
  }
  const items = await Standard.find({ _id: { $in: ids } }).lean();
  res.status(200).json({ success: true, data: items });
});
