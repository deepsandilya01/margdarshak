const Standard = require("../models/standard.model");
const mongoose = require("mongoose");

const findStandards = async (query, skip, limit) => {
  const [standards, total] = await Promise.all([
    Standard.find(query)
      .skip(skip)
      .limit(limit)
      .lean(),
    Standard.countDocuments(query),
  ]);

  return { standards, total };
};

const findStandardByOriginalId = async (id) => {
  return await Standard.findOne({ originalId: id }).lean();
};

const findStandardByMongoId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Standard.findById(id).lean();
  }
  return null;
};

const createStandard = async (data) => {
  return await Standard.create(data);
};

const updateStandard = async (id, data) => {
  return await Standard.findOneAndUpdate(
    { originalId: id },
    data,
    { new: true }
  );
};

module.exports = {
  findStandards,
  findStandardByOriginalId,
  findStandardByMongoId,
  createStandard,
  updateStandard,
};
