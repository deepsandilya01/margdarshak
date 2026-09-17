import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import tokenBlacklist from "./tokenBlacklist.service.js";
import redisService from "./redis.service.js";
import emailService from "./email.service.js";

const RESET_TOKEN_PREFIX = "auth:password-reset:";
const RESET_TOKEN_TTL = 15 * 60; // 15 minutes

export const registerUser = async ({ name, email, password, preferredLanguage = "en" }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError(409, "User with this email already exists", "USER_ALREADY_EXISTS");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    preferredLanguage,
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

export const loginOAuthUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(401, "User not found", "USER_NOT_FOUND");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (incomingRefreshToken) => {
  try {
    const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);

    if (decoded.jti) {
      const isBlacklisted = await tokenBlacklist.isRefreshTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        throw new AppError(401, "Refresh token has been revoked", "TOKEN_REVOKED");
      }
    }

    const user = await User.findById(decoded.sub);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new AppError(401, "Refresh token is invalid or has been revoked", "INVALID_TOKEN");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      token: newAccessToken,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "Refresh token has expired", "TOKEN_EXPIRED");
    }
    if (error instanceof AppError) throw error;
    throw new AppError(401, "Invalid refresh token", "INVALID_TOKEN");
  }
};

export const logoutUser = async (userId, accessToken, refreshToken) => {
  await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });

  if (accessToken) {
    try {
      const decodedAccess = jwt.verify(accessToken, env.JWT_ACCESS_SECRET, { ignoreExpiration: true });
      if (decodedAccess && decodedAccess.jti && decodedAccess.exp) {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        const ttl = decodedAccess.exp - currentUnixTime;
        if (ttl > 0) {
          await tokenBlacklist.blacklistAccessToken(decodedAccess.jti, ttl);
        }
      }
    } catch (error) {
      console.error("Failed to blacklist access token during logout:", error.message || error);
    }
  }

  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
      if (decodedRefresh && decodedRefresh.jti && decodedRefresh.exp) {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        const ttl = decodedRefresh.exp - currentUnixTime;
        if (ttl > 0) {
          await tokenBlacklist.blacklistRefreshToken(decodedRefresh.jti, ttl);
        }
      }
    } catch (error) {
      console.error("Failed to blacklist refresh token during logout:", error.message || error);
    }
  }
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // To prevent enumeration, we always return success even if user not found, 
  // but we only generate and send the token if the user exists.
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Store hashed token in redis (key: prefix+hashedToken, value: userId)
    if (!redisService.isRedisReady()) {
      throw new AppError(503, "Authentication service is currently unavailable", "SERVICE_UNAVAILABLE");
    }
    await redisService.setWithTTL(`${RESET_TOKEN_PREFIX}${hashedToken}`, user._id.toString(), RESET_TOKEN_TTL);
    
    const resetUrl = `${env.FRONTEND_AUTH_CALLBACK_URL.replace('/auth/callback', '')}/reset-password?token=${rawToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);
  }
};

export const resetPassword = async (rawToken, newPassword) => {
  if (!redisService.isRedisReady()) {
    throw new AppError(503, "Authentication service is currently unavailable", "SERVICE_UNAVAILABLE");
  }

  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const redisKey = `${RESET_TOKEN_PREFIX}${hashedToken}`;
  const userId = await redisService.get(redisKey);

  if (!userId) {
    throw new AppError(400, "Reset token is invalid or has expired", "INVALID_RESET_TOKEN");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User no longer exists", "USER_NOT_FOUND");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  user.passwordHash = passwordHash;
  
  // Revoke current refresh token
  if (user.refreshToken) {
    try {
      const decodedRefresh = jwt.verify(user.refreshToken, env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
      if (decodedRefresh && decodedRefresh.jti && decodedRefresh.exp) {
        const ttl = decodedRefresh.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await tokenBlacklist.blacklistRefreshToken(decodedRefresh.jti, ttl);
      }
    } catch (e) {}
    user.refreshToken = null;
  }
  
  await user.save({ validateBeforeSave: false });
  await redisService.del(redisKey); // Prevent reuse
};

export const changePassword = async (userId, currentPassword, newPassword, accessToken) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User not found", "USER_NOT_FOUND");

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) throw new AppError(401, "Incorrect current password", "INVALID_CREDENTIALS");

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);

  // Revoke current refresh token
  if (user.refreshToken) {
    try {
      const decodedRefresh = jwt.verify(user.refreshToken, env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
      if (decodedRefresh && decodedRefresh.jti && decodedRefresh.exp) {
        const ttl = decodedRefresh.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await tokenBlacklist.blacklistRefreshToken(decodedRefresh.jti, ttl);
      }
    } catch (e) {}
    user.refreshToken = null;
  }

  // Blacklist the used access token so they must log in again with new password
  if (accessToken) {
    try {
      const decodedAccess = jwt.verify(accessToken, env.JWT_ACCESS_SECRET, { ignoreExpiration: true });
      if (decodedAccess && decodedAccess.jti && decodedAccess.exp) {
        const ttl = decodedAccess.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await tokenBlacklist.blacklistAccessToken(decodedAccess.jti, ttl);
      }
    } catch (e) {}
  }

  await user.save({ validateBeforeSave: false });
};

export default {
  registerUser,
  loginUser,
  loginOAuthUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
