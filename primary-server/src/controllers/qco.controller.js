const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const qcoService = require("../services/qco.service");

const getQCOs = asyncHandler(async (req, res) => {
  const { search, status, standardId, page = 1, limit = 50 } = req.query;

  const { qcos, total } = await qcoService.findQCOs({ search, status, standardId, page, limit });

  const formattedQcos = qcos.map(q => ({
    ...q,
    id: q.originalId,
    _id: q._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedQcos, "QCOs retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getQCOById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const qco = await qcoService.findQCOById(id);

  if (!qco) {
    throw new ApiError(404, "QCO not found", "RESOURCE_NOT_FOUND");
  }

  qco.id = qco.originalId;

  return res.status(200).json(
    new ApiResponse(200, qco, "QCO retrieved successfully")
  );
});

module.exports = {
  getQCOs,
  getQCOById,
};
