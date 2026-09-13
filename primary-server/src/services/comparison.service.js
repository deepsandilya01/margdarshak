const comparisonRepository = require("../repositories/comparison.repository");
const { ApiError } = require("../utils/ApiError");

const getComparisonData = async ({ entityType, entityIds }) => {
  switch (entityType) {
    case "standard":
      return await comparisonRepository.findStandardsByIds(entityIds);
    case "qco":
      return await comparisonRepository.findQCOsByIds(entityIds);
    case "lab":
      return await comparisonRepository.findLabsByIds(entityIds);
    default:
      throw new ApiError(400, "Unsupported entityType for comparison", "VALIDATION_ERROR");
  }
};

module.exports = {
  getComparisonData,
};
