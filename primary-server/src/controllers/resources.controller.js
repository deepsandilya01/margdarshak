const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const resourcesService = require("../services/resources.service");

const getResources = asyncHandler(async (req, res) => {
  const { search, category, type, page = 1, limit = 50 } = req.query;

  const { resources, total } = await resourcesService.findResources({ search, category, type, page, limit });

  const formattedResources = resources.map(r => ({
    ...r,
    id: r.originalId,
    _id: r._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedResources, "Resources retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getResourceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await resourcesService.findResourceById(id);

  if (!resource) {
    throw new ApiError(404, "Resource not found", "RESOURCE_NOT_FOUND");
  }

  resource.id = resource.originalId;

  return res.status(200).json(
    new ApiResponse(200, resource, "Resource retrieved successfully")
  );
});

module.exports = {
  getResources,
  getResourceById,
};
