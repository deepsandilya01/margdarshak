const mongoose = require("mongoose");
const Report = require("../models/report.model");

const findReportsByUserId = async (userId, skip, limit) => {
  const [reports, total] = await Promise.all([
    Report.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Report.countDocuments({ userId }),
  ]);

  return { reports, total };
};

const findReportByOriginalId = async (userId, id) => {
  return await Report.findOne({ originalId: id, userId }).lean();
};

const findReportByMongoId = async (userId, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Report.findOne({ _id: id, userId }).lean();
  }
  return null;
};

module.exports = {
  findReportsByUserId,
  findReportByOriginalId,
  findReportByMongoId,
};
