import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { errorResponse } from "../utils/apiResponse.js";
import { findUserByIdForAuth } from "../repositories/user.repository.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Authentication required", "UNAUTHORIZED");
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (decoded.type !== "access") {
      return errorResponse(res, 401, "Invalid token", "INVALID_TOKEN");
    }

    const user = await findUserByIdForAuth(decoded.sub);

    if (!user) {
      return errorResponse(res, 401, "User not found", "USER_NOT_FOUND");
    }

    if (!user.isActive) {
      return errorResponse(res, 401, "Account is disabled", "ACCOUNT_DISABLED");
    }

    req.user = user.toObject();
    req.authUser = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired", "TOKEN_EXPIRED");
    }

    return errorResponse(res, 401, "Invalid token", "INVALID_TOKEN");
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, "Forbidden", "FORBIDDEN");
    }

    return next();
  };
}
