import mongoose from "mongoose";
import Standard from "../models/standard.model.js";
import Qco from "../models/qco.model.js";
import Laboratory from "../models/lab.model.js";
import Resource from "../models/resource.model.js";
import Report from "../models/report.model.js";
import ComplianceJourney from "../models/complianceJourney.model.js";
import SavedItem from "../models/saved.model.js";
import { getCatalogItem, getCatalogList } from "../services/catalog.service.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { parsePagination, publicId } from "../utils/pagination.js";
import { buildCatalogQuery } from "../repositories/catalog.repository.js";

const catalog =
  (Model, fields, filter = () => ({})) =>
  async (req, res, next) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await getCatalogList(Model, {
        search: req.query.search,
        filter: filter(req.query),
        fields,
        page,
        limit,
        sort: req.query.sort || "createdAt",
      });
      return successResponse(res, 200, "Success", result.items.map(publicId), {
        page,
        limit,
        total: result.total,
      });
    } catch (error) {
      return next(error);
    }
  };

const detail = (Model) => async (req, res, next) => {
  try {
    if (!req.params.id)
      return errorResponse(res, 400, "Invalid id", "INVALID_ID");
    const item = await getCatalogItem(Model, req.params.id);
    if (!item)
      return errorResponse(res, 404, "Not found", "RESOURCE_NOT_FOUND");
    return successResponse(res, 200, "Success", publicId(item));
  } catch (error) {
    return next(error);
  }
};

export const listStandards = catalog(Standard, [
  "id",
  "code",
  "title",
  "shortTitle",
  "description",
  "tags",
]);
export const getStandard = detail(Standard);
export const listQcos = catalog(
  Qco,
  ["id", "code", "title", "shortTitle", "summary", "tags"],
  (query) => (query.standardId ? { coveredStandards: query.standardId } : {}),
);
export const getQco = detail(Qco);
export const listLabs = catalog(
  Laboratory,
  ["id", "name", "shortName", "city", "state", "description", "disciplines"],
  (query) => {
    const filter = {};
    if (query.location)
      filter.$or = [
        { city: { $regex: query.location, $options: "i" } },
        { state: { $regex: query.location, $options: "i" } },
        { name: { $regex: query.location, $options: "i" } },
      ];
    if (query.standardId) filter.standardsCovered = query.standardId;
    return filter;
  },
);
export const getLab = detail(Laboratory);
export const listResources = catalog(
  Resource,
  ["id", "title", "category", "summary", "body"],
  (query) => (query.category ? { category: query.category } : {}),
);
export const getResource = detail(Resource);

export async function listReports(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const query = buildCatalogQuery({
      search: req.query.search,
      fields: ["id", "name", "type", "summary"],
    });
    query.userId = req.authUser._id;
    const [items, total] = await Promise.all([
      Report.find(query)
        .sort(req.query.sort || "-date")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Report.countDocuments(query),
    ]);
    return successResponse(res, 200, "Success", items.map(publicId), {
      page,
      limit,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReport(req, res, next) {
  try {
    const query = { userId: req.authUser._id };
    if (mongoose.isValidObjectId(req.params.id))
      query.$or = [{ _id: req.params.id }, { id: req.params.id }];
    else query.id = req.params.id;
    const report = await Report.findOne(query).lean();
    if (!report)
      return errorResponse(res, 404, "Not found", "RESOURCE_NOT_FOUND");
    return successResponse(res, 200, "Success", publicId(report));
  } catch (error) {
    return next(error);
  }
}

export async function listJourneys(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const query = buildCatalogQuery({
      search: req.query.search,
      fields: ["id", "productName", "currentStage"],
    });
    const [items, total] = await Promise.all([
      ComplianceJourney.find(query)
        .sort("createdAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ComplianceJourney.countDocuments(query),
    ]);
    return successResponse(res, 200, "Success", items.map(publicId), {
      page,
      limit,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

const models = {
  standard: Standard,
  qco: Qco,
  lab: Laboratory,
  resource: Resource,
};
export async function compare(req, res, next) {
  try {
    const { entityType, entityIds } = req.body || {};
    if (
      !models[entityType] ||
      !Array.isArray(entityIds) ||
      entityIds.length < 2 ||
      entityIds.length > 20 ||
      entityIds.some((id) => typeof id !== "string" || !id.trim())
    ) {
      return errorResponse(
        res,
        400,
        "entityType and at least two valid entityIds are required",
        "VALIDATION_ERROR",
      );
    }
    const Model = models[entityType];
    const entities = await Model.find({ id: { $in: entityIds } }).lean();
    if (entities.length !== entityIds.length)
      return errorResponse(
        res,
        404,
        "One or more entities were not found",
        "RESOURCE_NOT_FOUND",
      );
    const ordered = entityIds.map((id) =>
      entities.find((entity) => entity.id === id),
    );
    const keys = [
      ...new Set(
        ordered.flatMap((entity) =>
          Object.keys(entity).filter(
            (key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key),
          ),
        ),
      ),
    ];
    const differences = keys
      .filter(
        (key) =>
          new Set(ordered.map((entity) => JSON.stringify(entity[key]))).size >
          1,
      )
      .map((field) => ({
        field,
        values: ordered.map((entity) => entity[field]),
      }));
    return successResponse(res, 200, "Success", { differences }, null);
  } catch (error) {
    return next(error);
  }
}

export async function listSaved(req, res, next) {
  try {
    const items = await SavedItem.find({ userId: req.authUser._id })
      .sort("-createdAt")
      .lean();
    return successResponse(res, 200, "Success", items.map(publicId));
  } catch (error) {
    return next(error);
  }
}

export async function saveItem(req, res, next) {
  try {
    const { itemId, itemType = "standard" } = req.body || {};
    if (typeof itemId !== "string" || !itemId.trim())
      return errorResponse(res, 400, "itemId is required", "VALIDATION_ERROR");
    const item = await SavedItem.findOneAndUpdate(
      { userId: req.authUser._id, itemId: itemId.trim() },
      {
        $setOnInsert: {
          userId: req.authUser._id,
          itemId: itemId.trim(),
          itemType,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    return successResponse(res, 200, "Saved successfully", {
      success: true,
      item: publicId(item),
    });
  } catch (error) {
    if (error.code === 11000)
      return successResponse(res, 200, "Already saved", { success: true });
    return next(error);
  }
}

export async function deleteSaved(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return errorResponse(res, 400, "Invalid id", "INVALID_ID");
    const result = await SavedItem.deleteOne({
      _id: req.params.id,
      userId: req.authUser._id,
    });
    if (!result.deletedCount)
      return errorResponse(res, 404, "Not found", "RESOURCE_NOT_FOUND");
    return successResponse(res, 200, "Removed successfully", { success: true });
  } catch (error) {
    return next(error);
  }
}
