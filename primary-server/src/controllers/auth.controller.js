import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";
import crypto from "crypto";
import { setHandoffCode, getAndClearHandoffCode } from "../services/cache.service.js";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return new ApiResponse(201, result, "User registered successfully").send(res);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return new ApiResponse(200, result, "Login successful").send(res);
});

export const getMe = asyncHandler(async (req, res) => {
  return new ApiResponse(200, { user: req.user }, "Current user fetched successfully").send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  return new ApiResponse(200, result, "Access token refreshed successfully").send(res);
});

export const logout = asyncHandler(async (req, res) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader ? authHeader.replace("Bearer ", "").trim() : null;
  const refreshToken = req.body.refreshToken;

  await authService.logoutUser(req.user._id, accessToken, refreshToken);
  return new ApiResponse(200, null, "Logged out successfully").send(res);
});

export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Google authentication failed", "OAUTH_FAILED");
  }

  // Generate secure random code
  const code = crypto.randomBytes(32).toString("hex");

  // Save to cache (ttl is 60s)
  await setHandoffCode(code, { userId: req.user._id.toString() });

  // Redirect to frontend callback with the code
  res.redirect(`${env.FRONTEND_AUTH_CALLBACK_URL}?code=${code}`);
});

export const verifyGoogleCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    throw new AppError(400, "Validation code is required", "MISSING_CODE");
  }

  const payload = await getAndClearHandoffCode(code);
  if (!payload || !payload.userId) {
    throw new AppError(401, "Invalid or expired authorization code", "INVALID_CODE");
  }

  const result = await authService.loginOAuthUser(payload.userId);
  return new ApiResponse(200, result, "Google authentication successful").send(res);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return new ApiResponse(200, null, "If an account with that email exists, password reset instructions have been sent.").send(res);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  return new ApiResponse(200, null, "Password has been successfully reset").send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader ? authHeader.replace("Bearer ", "").trim() : null;
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword, accessToken);
  return new ApiResponse(200, null, "Password changed successfully. Please log in again.").send(res);
});

export default {
  register,
  login,
  getMe,
  refresh,
  logout,
  googleCallback,
  verifyGoogleCode,
  forgotPassword,
  resetPassword,
  changePassword,
};
