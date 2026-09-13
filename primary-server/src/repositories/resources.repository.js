const mongoose = require("mongoose");
const Resource = require("../models/resource.model");

const findResources = async (query, skip, limit) => {
  const [resources, total] = await Promise.all([
    Resource.find(query)
      .skip(skip)
      .limit(limit)
      .lean(),
    Resource.countDocuments(query),
  ]);

  return { resources, total };
};

const findResourceByOriginalId = async (id) => {
  return await Resource.findOne({ originalId: id }).lean();
};

const findResourceByMongoId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Resource.findById(id).lean();
  }
  return null;
};

module.exports = {
  findResources,
  findResourceByOriginalId,
  findResourceByMongoId,
};
