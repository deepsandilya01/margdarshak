const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const labsService = require("../services/labs.service");

const getLabs = asyncHandler(async (req, res) => {
  const { search, location, standardId, page = 1, limit = 50 } = req.query;

  const { labs, total } = await labsService.findLabs({ search, location, standardId, page, limit });

  const formattedLabs = labs.map(l => ({
    ...l,
    id: l.originalId,
    _id: l._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedLabs, "Laboratories retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getLabById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lab = await labsService.findLabById(id);

  if (!lab) {
    throw new ApiError(404, "Laboratory not found", "RESOURCE_NOT_FOUND");
  }

  lab.id = lab.originalId;

  return res.status(200).json(
    new ApiResponse(200, lab, "Laboratory retrieved successfully")
  );
});

module.exports = {
  getLabs,
  getLabById,
};
