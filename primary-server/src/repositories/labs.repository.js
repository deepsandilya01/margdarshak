const mongoose = require("mongoose");
const Laboratory = require("../models/lab.model");

const findLabs = async (query, skip, limit) => {
  const [labs, total] = await Promise.all([
    Laboratory.find(query)
      .skip(skip)
      .limit(limit)
      .lean(),
    Laboratory.countDocuments(query),
  ]);

  return { labs, total };
};

const findLabByOriginalId = async (id) => {
  return await Laboratory.findOne({ originalId: id }).lean();
};

const findLabByMongoId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Laboratory.findById(id).lean();
  }
  return null;
};

const findLabsByIds = async (ids) => {
  return await Laboratory.find({ originalId: { $in: ids } }).lean();
};

module.exports = {
  findLabs,
  findLabByOriginalId,
  findLabByMongoId,
  findLabsByIds,
};
