const mongoose = require("mongoose");
const ComplianceJourney = require("../models/compliance.model");

const findJourneysByUserId = async (userId, skip, limit) => {
  const [journeys, total] = await Promise.all([
    ComplianceJourney.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ComplianceJourney.countDocuments({ userId }),
  ]);

  return { journeys, total };
};

const findJourneyByOriginalId = async (userId, id) => {
  return await ComplianceJourney.findOne({ originalId: id, userId }).lean();
};

const findJourneyByMongoId = async (userId, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await ComplianceJourney.findOne({ _id: id, userId }).lean();
  }
  return null;
};

module.exports = {
  findJourneysByUserId,
  findJourneyByOriginalId,
  findJourneyByMongoId,
};
