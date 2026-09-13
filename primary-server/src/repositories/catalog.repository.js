import mongoose from "mongoose";

export function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

export function buildCatalogQuery({ search, filter, fields = [] } = {}) {
  const query = {};
  if (search) {
    query.$or = fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }
  if (filter && typeof filter === "object") {
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== "") query[key] = value;
    }
  }
  return query;
}

export async function listCatalog(Model, options = {}) {
  const { query, page = 1, limit = 20, sort = "createdAt" } = options;
  const [items, total] = await Promise.all([
    Model.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(query),
  ]);
  return { items, total };
}

export async function findCatalogById(Model, id) {
  const byPublicId = await Model.findOne({ id }).lean();
  if (byPublicId) return byPublicId;
  if (mongoose.isValidObjectId(id)) return Model.findById(id).lean();
  return null;
}
