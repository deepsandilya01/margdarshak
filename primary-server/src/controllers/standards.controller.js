const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const standardsService = require("../services/standards.service");

const getStandards = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 50 } = req.query;

  const { standards, total } = await standardsService.findStandards({ search, category, page, limit });

  // Frontend currently uses 'id' instead of '_id', map it
  const formattedStandards = standards.map(s => ({
    ...s,
    id: s.originalId,
    _id: s._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedStandards, "Standards retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getStandardById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const standard = await standardsService.findStandardById(id);

  if (!standard) {
    throw new ApiError(404, "Standard not found", "RESOURCE_NOT_FOUND");
  }

  standard.id = standard.originalId;

  return res.status(200).json(
    new ApiResponse(200, standard, "Standard retrieved successfully")
  );
});

module.exports = {
  getStandards,
  getStandardById,
};
