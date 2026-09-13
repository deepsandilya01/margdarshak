const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const reportsService = require("../services/reports.service");

const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const { reports, total } = await reportsService.findReports(req.user._id, page, limit);

  const formattedReports = reports.map(r => ({
    ...r,
    id: r.originalId || r._id.toString(),
    _id: r._id
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedReports, "Reports retrieved successfully", {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    })
  );
});

const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await reportsService.findReportById(req.user._id, id);

  if (!report) {
    throw new ApiError(404, "Report not found or access denied", "RESOURCE_NOT_FOUND");
  }

  report.id = report.originalId || report._id.toString();

  return res.status(200).json(
    new ApiResponse(200, report, "Report retrieved successfully")
  );
});

module.exports = {
  getReports,
  getReportById,
};
