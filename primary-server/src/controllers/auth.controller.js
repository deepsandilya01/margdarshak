import crypto from "crypto";

import User from "../models/user.model.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} from "../validators/auth.validator.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  changePassword,
  revokeRefreshToken,
  googleAuthLogin,
} from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export async function register(req, res, next) {
  try {
    const result = validateRegister(req.body || {});
    if (!result.isValid) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.errors,
      );
    }

    const { user, tokens } = await registerUser(result.data);
    return successResponse(res, 201, "User registered successfully", {
      user,
      tokens,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = validateLogin(req.body || {});
    if (!result.isValid) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.errors,
      );
    }

    const { user, tokens } = await loginUser(result.data);
    return successResponse(res, 200, "Login successful", { user, tokens });
  } catch (error) {
    if (
      error.code === "INVALID_CREDENTIALS" ||
      error.code === "ACCOUNT_DISABLED"
    ) {
      return errorResponse(
        res,
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    return next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken =
      req.body?.refreshToken || req.headers?.["x-refresh-token"];
    const tokens = await refreshAccessToken(refreshToken);
    return successResponse(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    if (userId) {
      await revokeRefreshToken(userId);
    }

    return successResponse(res, 200, "Logged out successfully", null);
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res) {
  return successResponse(res, 200, "User profile loaded", { user: req.user });
}

export async function forgotPassword(req, res, next) {
  try {
    const result = validateForgotPassword(req.body || {});
    if (!result.isValid) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.errors,
      );
    }

    const response = await requestPasswordReset(result.data.email);

    if (response.sent) {
      return successResponse(
        res,
        200,
        "If the account exists, password reset instructions have been sent.",
      );
    }

    return successResponse(
      res,
      200,
      "If the account exists, password reset instructions have been sent.",
    );
  } catch (error) {
    return next(error);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const result = validateResetPassword(req.body || {});
    if (!result.isValid) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.errors,
      );
    }

    await resetPassword({
      token: result.data.token,
      password: result.data.password,
    });
    return successResponse(res, 200, "Password reset successfully");
  } catch (error) {
    return next(error);
  }
}

export async function changePasswordController(req, res, next) {
  try {
    const result = validateChangePassword(req.body || {});
    if (!result.isValid) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.errors,
      );
    }

    const user = await changePassword(req.user._id, result.data);
    return successResponse(res, 200, "Password changed successfully", {
      user: user.user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      return errorResponse(
        res,
        400,
        "Google token is required",
        "VALIDATION_ERROR",
      );
    }

    const { user, tokens } = await googleAuthLogin({ idToken });
    return successResponse(res, 200, "Google login successful", {
      user,
      tokens,
    });
  } catch (error) {
    return next(error);
  }
}

export { resetPasswordController as resetPassword };
export { changePasswordController as changePassword };
