const mongoose = require("mongoose");
const QCO = require("../models/qco.model");

const findQCOs = async (query, skip, limit) => {
  const [qcos, total] = await Promise.all([
    QCO.find(query)
      .skip(skip)
      .limit(limit)
      .lean(),
    QCO.countDocuments(query),
  ]);

  return { qcos, total };
};

const findQCOByOriginalId = async (id) => {
  return await QCO.findOne({ originalId: id }).lean();
};

const findQCOByMongoId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await QCO.findById(id).lean();
  }
  return null;
};

const findQCOsByIds = async (ids) => {
  return await QCO.find({ originalId: { $in: ids } }).lean();
};

module.exports = {
  findQCOs,
  findQCOByOriginalId,
  findQCOByMongoId,
  findQCOsByIds,
};
