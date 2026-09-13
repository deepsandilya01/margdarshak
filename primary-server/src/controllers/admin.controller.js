const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const adminService = require("../services/admin.service");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.fetchAllUsers();
  return res.status(200).json(
    new ApiResponse(200, users, "Users retrieved successfully")
  );
});

const createStandard = asyncHandler(async (req, res) => {
  const newStandard = await adminService.createStandardRecord(req.body);
  return res.status(201).json(
    new ApiResponse(201, newStandard, "Standard created successfully")
  );
});

const updateStandard = asyncHandler(async (req, res) => {
  const standard = await adminService.updateStandardRecord(req.params.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, standard, "Standard updated successfully")
  );
});

module.exports = {
  getAllUsers,
  createStandard,
  updateStandard,
};
