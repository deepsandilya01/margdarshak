import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app from "../src/app.js";
import User from "../src/models/user.model.js";
import env from "../src/config/env.js";
import {
  requestPasswordReset,
  resetPassword,
  loginUser,
  registerUser,
} from "../src/services/auth.service.js";

let mongoServer;

async function createUser(overrides = {}) {
  const email =
    overrides.email || `user${Date.now()}${Math.random()}@example.com`;
  const user = await User.create({
    name: overrides.name || "Test User",
    email,
    password: overrides.password || "StrongPassword123",
    role: overrides.role || "USER",
    isActive: overrides.isActive !== undefined ? overrides.isActive : true,
  });

  return user;
}

async function buildAuthHeaders(user) {
  const accessToken = jwt.sign(
    { sub: user._id.toString(), role: user.role, type: "access" },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );

  return { Authorization: `Bearer ${accessToken}` };
}

test.before(async () => {
  process.env.NODE_ENV = "test";
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri("bis-sathitest");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await User.deleteMany({});
});

test("register succeeds with valid payload", async () => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "StrongPassword123",
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.user.email, "jane@example.com");
  assert.equal(res.body.data.user.password, undefined);
  assert.ok(res.body.data.tokens.accessToken);
});

test("register rejects invalid email", async () => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Jane Doe",
    email: "bad-email",
    password: "StrongPassword123",
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, "VALIDATION_ERROR");
});

test("register rejects weak password", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Jane Doe", email: "weak@example.com", password: "weak" });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, "VALIDATION_ERROR");
});

test("register rejects duplicate email", async () => {
  await createUser({
    email: "dupe@example.com",
    password: "StrongPassword123",
  });

  const res = await request(app).post("/api/auth/register").send({
    name: "Jane Doe",
    email: "dupe@example.com",
    password: "StrongPassword123",
  });

  assert.equal(res.status, 409);
  assert.equal(res.body.code, "USER_ALREADY_EXISTS");
});

test("login succeeds with valid credentials", async () => {
  await createUser({
    email: "login@example.com",
    password: "StrongPassword123",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "login@example.com", password: "StrongPassword123" });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.tokens.accessToken);
});

test("login rejects wrong password", async () => {
  await createUser({
    email: "wrong@example.com",
    password: "StrongPassword123",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "wrong@example.com", password: "WrongPass123" });

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_CREDENTIALS");
});

test("login rejects unknown email", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "missing@example.com", password: "StrongPassword123" });

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_CREDENTIALS");
});

test("login rejects disabled account", async () => {
  await createUser({
    email: "disabled@example.com",
    password: "StrongPassword123",
    isActive: false,
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "disabled@example.com", password: "StrongPassword123" });

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_CREDENTIALS");
});

test("me route returns current user for valid access token", async () => {
  const user = await createUser({
    email: "me@example.com",
    password: "StrongPassword123",
  });
  const headers = await buildAuthHeaders(user);

  const res = await request(app).get("/api/auth/me").set(headers);

  assert.equal(res.status, 200);
  assert.equal(res.body.data.user.email, "me@example.com");
});

test("me route rejects missing token", async () => {
  const res = await request(app).get("/api/auth/me");

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "UNAUTHORIZED");
});

test("me route rejects invalid token", async () => {
  const res = await request(app)
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalid.token.value");

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_TOKEN");
});

test("expired access token is rejected", async () => {
  const expiredToken = jwt.sign(
    { sub: "507f1f77bcf86cd799439011", role: "USER", type: "access" },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "-1s" },
  );

  const res = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${expiredToken}`);

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "TOKEN_EXPIRED");
});

test("refresh route rotates token for valid refresh token", async () => {
  const user = await createUser({
    email: "refresh@example.com",
    password: "StrongPassword123",
  });
  const login = await loginUser({
    email: "refresh@example.com",
    password: "StrongPassword123",
  });

  const res = await request(app)
    .post("/api/auth/refresh")
    .send({ refreshToken: login.tokens.refreshToken });

  assert.equal(res.status, 200);
  assert.ok(res.body.data.accessToken);
  assert.ok(res.body.data.refreshToken);
});

test("refresh route rejects invalid refresh token", async () => {
  const res = await request(app)
    .post("/api/auth/refresh")
    .send({ refreshToken: "bad.refresh.token" });

  assert.equal(res.status, 401);
  assert.ok(["INVALID_TOKEN", "TOKEN_EXPIRED"].includes(res.body.code));
});

test("refresh token revoked after logout", async () => {
  const user = await createUser({
    email: "logout@example.com",
    password: "StrongPassword123",
  });
  const login = await loginUser({
    email: "logout@example.com",
    password: "StrongPassword123",
  });

  await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${login.tokens.accessToken}`);

  const res = await request(app)
    .post("/api/auth/refresh")
    .send({ refreshToken: login.tokens.refreshToken });

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_TOKEN");
});

test("logout succeeds and invalidates current refresh session", async () => {
  const user = await createUser({
    email: "logout2@example.com",
    password: "StrongPassword123",
  });
  const login = await loginUser({
    email: "logout2@example.com",
    password: "StrongPassword123",
  });

  const res = await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${login.tokens.accessToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.message, "Logged out successfully");
});

test("forgot password returns generic response", async () => {
  const res = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "reset@example.com" });

  assert.equal(res.status, 200);
  assert.match(res.body.message, /password reset instructions/i);
});

test("reset password rejects invalid reset token", async () => {
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ token: "invalid-token", password: "NewStrongPassword123" });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, "INVALID_RESET_TOKEN");
});

test("reset password rejects expired reset token", async () => {
  const user = await createUser({
    email: "expired-reset@example.com",
    password: "StrongPassword123",
  });
  const token = "resetToken123";
  const { createHash } = await import("node:crypto");
  user.passwordResetTokenHash = createHash("sha256")
    .update(token)
    .digest("hex");
  user.passwordResetExpires = new Date(Date.now() - 1000);
  await user.save();

  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ token, password: "NewStrongPassword123" });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, "INVALID_RESET_TOKEN");
});

test("reset password succeeds with valid token", async () => {
  const user = await createUser({
    email: "reset-success@example.com",
    password: "StrongPassword123",
  });
  const resetResult = await requestPasswordReset("reset-success@example.com");
  assert.equal(resetResult.sent, true);

  const savedUser = await User.findOne({ email: "reset-success@example.com" });
  const token = resetResult.resetToken;

  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ token, password: "NewStrongPassword123" });

  assert.equal(res.status, 200);
  assert.equal(res.body.message, "Password reset successfully");

  const updatedUser = await User.findOne({
    email: "reset-success@example.com",
  });
  assert.notEqual(updatedUser.password, "StrongPassword123");
});

test("change password rejects incorrect current password", async () => {
  const user = await createUser({
    email: "change-fail@example.com",
    password: "StrongPassword123",
  });
  const headers = await buildAuthHeaders(user);

  const res = await request(app)
    .post("/api/auth/change-password")
    .set(headers)
    .send({ currentPassword: "WrongPass123", newPassword: "AnotherStrong123" });

  assert.equal(res.status, 401);
  assert.equal(res.body.code, "INVALID_CREDENTIALS");
});

test("change password succeeds for correct current password", async () => {
  const user = await createUser({
    email: "change-success@example.com",
    password: "StrongPassword123",
  });
  const headers = await buildAuthHeaders(user);

  const res = await request(app)
    .post("/api/auth/change-password")
    .set(headers)
    .send({
      currentPassword: "StrongPassword123",
      newPassword: "UpdatedStrong456",
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.message, "Password changed successfully");
});

test("user route denies non-admin access to admin endpoint", async () => {
  const user = await createUser({
    email: "user-route@example.com",
    password: "StrongPassword123",
    role: "USER",
  });
  const headers = await buildAuthHeaders(user);

  const res = await request(app).get("/api/auth/admin-check").set(headers);

  assert.equal(res.status, 403);
  assert.equal(res.body.code, "FORBIDDEN");
});

test("admin route allows admin access", async () => {
  const admin = await createUser({
    email: "admin@example.com",
    password: "StrongPassword123",
    role: "ADMIN",
  });
  const headers = await buildAuthHeaders(admin);

  const res = await request(app).get("/api/auth/admin-check").set(headers);

  assert.equal(res.status, 200);
  assert.equal(res.body.message, "Admin access granted");
});
