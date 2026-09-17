import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import tokenBlacklist from "../services/tokenBlacklist.service.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Authorization header missing or invalid", "UNAUTHORIZED");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new AppError(401, "Access token missing", "UNAUTHORIZED");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (decoded.jti) {
      const isBlacklisted = await tokenBlacklist.isAccessTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        throw new AppError(401, "Token has been revoked", "TOKEN_REVOKED");
      }
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError(401, "User no longer exists or session invalid", "INVALID_TOKEN");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "Access token has expired", "TOKEN_EXPIRED");
    }
    if (error.name === "JsonWebTokenError") {
      throw new AppError(401, "Invalid access token", "INVALID_TOKEN");
    }
    throw error;
  }
});



export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "You do not have permission to perform this action", "FORBIDDEN");
    }
    next();
  };
};

export const protect = requireAuth;
export default requireAuth;
