import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app from "../src/app.js";
import env from "../src/config/env.js";
import User from "../src/models/user.model.js";
import Standard from "../src/models/standard.model.js";
import Qco from "../src/models/qco.model.js";
import Laboratory from "../src/models/lab.model.js";
import Resource from "../src/models/resource.model.js";
import Report from "../src/models/report.model.js";
import ComplianceJourney from "../src/models/complianceJourney.model.js";
import SavedItem from "../src/models/saved.model.js";

let mongoServer;
let user;
let otherUser;
let authHeader;

function tokenFor(currentUser) {
  return {
    Authorization: `Bearer ${jwt.sign({ sub: currentUser._id.toString(), role: currentUser.role, type: "access" }, env.JWT_ACCESS_SECRET)}`,
  };
}

test.before(async () => {
  process.env.NODE_ENV = "test";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri("bis-sathi-data-test"));
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Standard.deleteMany({}),
    Qco.deleteMany({}),
    Laboratory.deleteMany({}),
    Resource.deleteMany({}),
    Report.deleteMany({}),
    ComplianceJourney.deleteMany({}),
    SavedItem.deleteMany({}),
  ]);
  user = await User.create({
    name: "Owner",
    email: "owner@example.com",
    password: "StrongPassword123",
  });
  otherUser = await User.create({
    name: "Other",
    email: "other@example.com",
    password: "StrongPassword123",
  });
  authHeader = tokenFor(user);
  await Standard.create({
    id: "IS-1293-2019",
    code: "IS 1293:2019",
    title: "Plugs",
    status: "active",
    tags: ["electrical"],
  });
  await Standard.create({
    id: "IS-9873-P1-2019",
    code: "IS 9873:2019",
    title: "Toy Safety",
    status: "mandatory_qco",
    tags: ["toys"],
  });
  await Qco.create({
    id: "QCO-1",
    code: "QCO-1",
    title: "Plugs QCO",
    coveredStandards: ["IS-1293-2019"],
  });
  await Laboratory.create({
    id: "LAB-1",
    name: "Bhopal Test Lab",
    city: "Bhopal",
    state: "Madhya Pradesh",
    standardsCovered: ["IS-1293-2019"],
  });
  await Resource.create({
    id: "RES-1",
    title: "Certification Guide",
    category: "Guidelines",
    summary: "Guide",
  });
  await Report.create({
    id: "RPT-1",
    userId: user._id,
    name: "Owner Report",
    type: "Compliance",
  });
  await Report.create({
    id: "RPT-2",
    userId: otherUser._id,
    name: "Private Report",
    type: "Compliance",
  });
  await ComplianceJourney.create({
    id: "CJ-1",
    productName: "Test Product",
    currentStage: "Testing",
    steps: [],
  });
});

test("catalog list, filters, pagination, details and missing IDs", async () => {
  const standards = await request(app).get(
    "/api/v1/standards?search=toy&page=1&limit=1",
  );
  assert.equal(standards.status, 200);
  assert.equal(standards.body.data.length, 1);
  assert.equal(standards.body.meta.total, 1);

  const standard = await request(app).get("/api/v1/standards/IS-1293-2019");
  assert.equal(standard.status, 200);
  assert.equal(standard.body.data.code, "IS 1293:2019");
  assert.equal(
    (await request(app).get("/api/v1/standards/not-found")).body.error.code,
    "RESOURCE_NOT_FOUND",
  );
  assert.equal(
    (await request(app).get("/api/v1/qcos?standardId=IS-1293-2019")).body.data
      .length,
    1,
  );
  assert.equal(
    (
      await request(app).get(
        "/api/v1/labs?location=bhopal&standardId=IS-1293-2019",
      )
    ).body.data.length,
    1,
  );
  assert.equal((await request(app).get("/api/v1/resources/RES-1")).status, 200);
});

test("reports are scoped to the authenticated user", async () => {
  const list = await request(app).get("/api/v1/reports").set(authHeader);
  assert.deepEqual(
    list.body.data.map((item) => item.id),
    ["RPT-1"],
  );
  assert.equal(
    (await request(app).get("/api/v1/reports/RPT-2").set(authHeader)).body.error
      .code,
    "RESOURCE_NOT_FOUND",
  );
  assert.equal(
    (await request(app).get("/api/v1/reports")).body.error.code,
    "UNAUTHORIZED",
  );
});

test("compliance and comparison use database records", async () => {
  assert.equal(
    (await request(app).get("/api/v1/compliance/journeys")).body.data[0].id,
    "CJ-1",
  );
  const comparison = await request(app)
    .post("/api/v1/comparison")
    .send({
      entityType: "standard",
      entityIds: ["IS-1293-2019", "IS-9873-P1-2019"],
    });
  assert.equal(comparison.status, 200);
  assert.ok(Array.isArray(comparison.body.data.differences));
  assert.equal(
    (
      await request(app)
        .post("/api/v1/comparison")
        .send({ entityType: "unknown", entityIds: ["a", "b"] })
    ).body.error.code,
    "VALIDATION_ERROR",
  );
});

test("saved items require auth, deduplicate, and enforce ownership", async () => {
  assert.equal(
    (await request(app).get("/api/v1/saved")).body.error.code,
    "UNAUTHORIZED",
  );
  const first = await request(app)
    .post("/api/v1/saved")
    .set(authHeader)
    .send({ itemId: "IS-1293-2019" });
  assert.equal(first.status, 200);
  await request(app)
    .post("/api/v1/saved")
    .set(authHeader)
    .send({ itemId: "IS-1293-2019" });
  const saved = await request(app).get("/api/v1/saved").set(authHeader);
  assert.equal(saved.body.data.length, 1);
  const id = saved.body.data[0].id;
  const otherHeader = tokenFor(otherUser);
  assert.equal(
    (await request(app).delete(`/api/v1/saved/${id}`).set(otherHeader)).body
      .error.code,
    "RESOURCE_NOT_FOUND",
  );
  assert.equal(
    (await request(app).delete(`/api/v1/saved/${id}`).set(authHeader)).body.data
      .success,
    true,
  );
});
