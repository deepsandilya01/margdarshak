const Standard = require("../models/standard.model");
const QCO = require("../models/qco.model");
const Laboratory = require("../models/lab.model");

const findStandardsByIds = async (ids) => {
  return await Standard.find({ originalId: { $in: ids } }).lean();
};

const findQCOsByIds = async (ids) => {
  return await QCO.find({ originalId: { $in: ids } }).lean();
};

const findLabsByIds = async (ids) => {
  return await Laboratory.find({ originalId: { $in: ids } }).lean();
};

module.exports = {
  findStandardsByIds,
  findQCOsByIds,
  findLabsByIds,
};
