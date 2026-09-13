const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const comparisonService = require("../services/comparison.service");

const compareEntities = asyncHandler(async (req, res) => {
  const { entityType, entityIds } = req.body;

  if (!entityType || !Array.isArray(entityIds) || entityIds.length === 0) {
    throw new ApiError(400, "Valid entityType and non-empty entityIds array are required", "VALIDATION_ERROR");
  }

  if (entityIds.length > 4) {
    throw new ApiError(400, "Maximum of 4 entities can be compared at once", "VALIDATION_ERROR");
  }

  const entities = await comparisonService.getComparisonData({ entityType, entityIds });

  const formattedEntities = entities.map(e => ({
    ...e,
    id: e.originalId,
    _id: e._id
  }));

  return res.status(200).json(
    new ApiResponse(200, { items: formattedEntities }, "Comparison data retrieved successfully")
  );
});

module.exports = {
  compareEntities,
};
