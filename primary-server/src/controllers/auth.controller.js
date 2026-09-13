const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !name.trim() || !email || !email.trim() || !password) {
    throw new ApiError(400, "All fields are required", "VALIDATION_ERROR");
  }

  const { user, accessToken, refreshToken } = await authService.registerUser({ name, email, password });
  return res.status(201).json(new ApiResponse(201, { user, token: accessToken, refreshToken }, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required", "VALIDATION_ERROR");
  }

  const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });
  return res.status(200).json(new ApiResponse(200, { user, token: accessToken, refreshToken }, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, "User fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing", "UNAUTHORIZED");
  }

  const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);
  return res.status(200).json(new ApiResponse(200, { token: accessToken, refreshToken }, "Access token refreshed"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required", "VALIDATION_ERROR");

  const resetToken = await authService.initiatePasswordReset(email);
  return res.status(200).json(
    new ApiResponse(200, { resetToken }, "If an account exists, a reset link will be sent")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required", "VALIDATION_ERROR");
  }

  await authService.resetPassword(token, newPassword);
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required", "VALIDATION_ERROR");
  }

  await authService.changePassword(req.user._id, currentPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
