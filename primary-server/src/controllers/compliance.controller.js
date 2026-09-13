const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const complianceService = require("../services/compliance.service");

const getComplianceJourneys = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const { journeys, total } = await complianceService.findComplianceJourneys(req.user._id, page, limit);

  const formattedJourneys = journeys.map(j => ({
    ...j,
    id: j.originalId || j._id.toString(),
    _id: j._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedJourneys, "Compliance journeys retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getComplianceJourneyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const journey = await complianceService.findComplianceJourneyById(req.user._id, id);

  if (!journey) {
    throw new ApiError(404, "Compliance journey not found or access denied", "RESOURCE_NOT_FOUND");
  }

  journey.id = journey.originalId || journey._id.toString();

  return res.status(200).json(
    new ApiResponse(200, journey, "Compliance journey retrieved successfully")
  );
});

module.exports = {
  getComplianceJourneys,
  getComplianceJourneyById,
};
