import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

import env from "../config/env.js";
import { getRedisClient } from "../config/redis.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  findUserByResetTokenHash,
  findUserByRefreshTokenHash,
  findUserByProvider,
} from "../repositories/user.repository.js";

export function signToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function buildUserPayload(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createAuthTokens(user) {
  const accessToken = signToken(
    { sub: user._id.toString(), role: user.role, type: "access" },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = signToken(
    { sub: user._id.toString(), role: user.role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  const refreshTokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await updateUserById(user._id, {
    refreshTokenHash,
    refreshTokenExpiresAt: expiresAt,
  });

  const redisClient = await getRedisClient();
  if (redisClient) {
    await redisClient.set(
      `auth:session:${user._id.toString()}`,
      refreshTokenHash,
      {
        EX: 60 * 60 * 24 * 7,
      },
    );
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

export async function revokeRefreshToken(userId) {
  const user = await findUserById(userId);
  if (!user) {
    return;
  }

  user.refreshTokenHash = null;
  user.refreshTokenExpiresAt = null;
  await user.save();

  const redisClient = await getRedisClient();
  if (redisClient) {
    await redisClient.del(`auth:session:${userId.toString()}`);
  }
}

export async function revokeAllSessions(userId) {
  await revokeRefreshToken(userId);
}

export async function invalidatePasswordReset(userId) {
  await updateUserById(userId, {
    passwordResetTokenHash: null,
    passwordResetExpires: null,
  });
}

export async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    error.code = "USER_ALREADY_EXISTS";
    throw error;
  }

  const user = await createUser({ name, email, password, role: "USER" });
  const tokens = await createAuthTokens(user);

  return {
    user: buildUserPayload(user),
    tokens,
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account is disabled");
    error.statusCode = 401;
    error.code = "ACCOUNT_DISABLED";
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await createAuthTokens(user);

  return {
    user: buildUserPayload(user),
    tokens,
  };
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (error) {
    const jwtError = new Error("Refresh token expired or invalid");
    jwtError.statusCode = 401;
    jwtError.code =
      error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
    throw jwtError;
  }

  if (decoded.type !== "refresh") {
    const error = new Error("Invalid token type");
    error.statusCode = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  const user = await findUserById(decoded.sub);
  if (!user || !user.isActive) {
    const error = new Error("User not found");
    error.statusCode = 401;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const tokenHash = await hashToken(refreshToken);
  if (!user.refreshTokenHash || user.refreshTokenHash !== tokenHash) {
    const error = new Error("Refresh token revoked");
    error.statusCode = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  const accessToken = signToken(
    { sub: user._id.toString(), role: user.role, type: "access" },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );

  const newRefreshToken = signToken(
    { sub: user._id.toString(), role: user.role, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );

  const newRefreshHash = await hashToken(newRefreshToken);
  await updateUserById(user._id, {
    refreshTokenHash: newRefreshHash,
    refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const redisClient = await getRedisClient();
  if (redisClient) {
    await redisClient.set(
      `auth:session:${user._id.toString()}`,
      newRefreshHash,
      { EX: 60 * 60 * 24 * 7 },
    );
  }

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function requestPasswordReset(email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return { sent: false };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetHash = await hashToken(resetToken);
  user.passwordResetTokenHash = resetHash;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  return { sent: true, resetToken };
}

export async function resetPassword({ token, password }) {
  const resetHash = await hashToken(token);
  const user = await findUserByResetTokenHash(resetHash);

  if (!user) {
    const error = new Error("Invalid or expired reset token");
    error.statusCode = 400;
    error.code = "INVALID_RESET_TOKEN";
    throw error;
  }

  user.password = password;
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  await user.save();
  await revokeAllSessions(user._id);

  return { user: buildUserPayload(user) };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  user.password = newPassword;
  await user.save();
  await revokeAllSessions(user._id);

  return { user: buildUserPayload(user) };
}

export async function googleAuthLogin({ idToken }) {
  if (!env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google auth is not configured");
    error.statusCode = 500;
    error.code = "GOOGLE_AUTH_DISABLED";
    throw error;
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    const error = new Error("Google authentication failed");
    error.statusCode = 401;
    error.code = "INVALID_TOKEN";
    throw error;
  }

  const email = String(payload.email).trim().toLowerCase();
  let user = await findUserByEmail(email);

  if (!user) {
    user = await createUser({
      name: payload.name || "Google User",
      email,
      password: crypto.randomBytes(32).toString("hex"),
      role: "USER",
      provider: "google",
      providerId: payload.sub,
      isEmailVerified: false,
    });
  } else if (user.provider !== "google" && !user.providerId) {
    user.provider = "google";
    user.providerId = payload.sub;
    await user.save();
  }

  const tokens = await createAuthTokens(user);
  return {
    user: buildUserPayload(user),
    tokens,
  };
}
