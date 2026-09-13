require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Standard = require("../src/models/standard.model");

// E2E Test Suite for the full API Backend

describe("End-to-End API Integration Tests", () => {
  let server;
  let userToken;
  let adminToken;
  let testUserId;
  let testSessionId;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bis-sathi-test");
    
    // Clear databases
    await User.deleteMany({});
    await Standard.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("1. Authentication Flow", () => {
    it("TC-AUTH-001: Should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123"
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined(); // Password should not be exposed
      
      userToken = res.body.data.token;
      testUserId = res.body.data.user._id;
    });

    it("TC-AUTH-002: Should not allow duplicate email registration", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Duplicate User",
          email: "test@example.com",
          password: "password123"
        });
      
      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBeFalsy();
    });

    it("TC-AUTH-007: Should login successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "password123"
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.token).toBeDefined();
      userToken = res.body.data.token;
    });

    it("TC-AUTH-011: Should get current user (Me) with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user.email).toEqual("test@example.com");
    });
  });

  describe("2. Admin & Standards Flow", () => {
    beforeAll(async () => {
      // Create admin user manually for testing
      const admin = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword",
        role: "ADMIN"
      });
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "admin@example.com",
          password: "adminpassword"
        });
      adminToken = loginRes.body.data.token;
    });

    it("TC-ADMIN-002: Normal user should be rejected from admin routes", async () => {
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(403);
    });

    it("TC-ADMIN-001: Admin can access admin routes", async () => {
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("TC-ADMIN-005: Admin can create a new standard", async () => {
      const res = await request(app)
        .post("/api/v1/admin/standards")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          code: "IS 9999:2026",
          title: "Test Standard Title",
          originalId: "ST-TEST-9999"
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.code).toEqual("IS 9999:2026");
    });

    it("TC-STD-001: Anyone can view public standards", async () => {
      const res = await request(app)
        .get("/api/v1/standards");
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].code).toEqual("IS 9999:2026");
    });
  });

  describe("3. Chat and Session Flow", () => {
    it("TC-SESSION-001: Authenticated user creates session", async () => {
      const res = await request(app)
        .post("/api/v1/sessions")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Test AI Session"
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.session.id).toBeDefined();
      testSessionId = res.body.data.session.id;
    });

    it("TC-CHAT-001: Submit valid chat request", async () => {
      const res = await request(app)
        .post("/api/v1/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          sessionId: testSessionId,
          message: "What is the standard?"
        });
      
      // Since FastAPI is down, it should return 500 but still generate an assistant error message
      expect(res.statusCode).toEqual(500);
      expect(res.body.data.message.status).toEqual("error");
    });

    it("TC-SESSION-011: Verify messages are persisted and retrieved chronologically", async () => {
      const res = await request(app)
        .get(`/api/v1/sessions/${testSessionId}/messages`)
        .set("Authorization", `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.messages.length).toEqual(2);
      expect(res.body.data.messages[0].role).toEqual("user");
      expect(res.body.data.messages[1].role).toEqual("assistant");
    });
  });
  
  describe("4. Ownership and IDOR Security Tests", () => {
    let secondUserToken;
    let secondUserId;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Second User",
          email: "second@example.com",
          password: "password123"
        });
      secondUserToken = res.body.data.token;
      secondUserId = res.body.data.user._id;
    });

    it("TC-SESSION-009: USER A cannot access USER B session", async () => {
      const res = await request(app)
        .get(`/api/v1/sessions/${testSessionId}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      
      expect(res.statusCode).toEqual(404);
    });

    it("TC-REPORT-004: USER A cannot access USER B report", async () => {
      // First create a report for User A (test user)
      const Report = require("../src/models/report.model");
      const report = await Report.create({
        userId: testUserId,
        name: "Test Report",
        type: "Compliance"
      });

      // User B attempts to fetch User A's report
      const res = await request(app)
        .get(`/api/v1/reports/${report._id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("5. Public Discovery Flow (Resources & Comparison)", () => {
    it("TC-RES-001: Anyone can view public resources", async () => {
      const res = await request(app).get("/api/v1/resources");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it("TC-COMP-001: Anyone can post to comparison API", async () => {
      const res = await request(app)
        .post("/api/v1/comparison")
        .send({
          entityType: "standard",
          entityIds: ["ST-TEST-9999"]
        });
      
      // Since ST-TEST-9999 was created in admin tests, it might be returned
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.items)).toBeTruthy();
    });
  });

  describe("6. Saved Items IDOR Flow", () => {
    let secondUserToken;
    
    beforeAll(async () => {
      // Login as second user to get token
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "second@example.com",
          password: "password123"
        });
      secondUserToken = loginRes.body.data.token;
    });

    it("TC-SAVED-001: User A can save an item", async () => {
      const res = await request(app)
        .post("/api/v1/saved")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          id: "ST-TEST-9999",
          type: "standard",
          label: "Bookmark",
          title: "Test Bookmark"
        });
      
      expect(res.statusCode).toEqual(201);
    });

    it("TC-SAVED-002: User B cannot see User A saved items", async () => {
      const res = await request(app)
        .get("/api/v1/saved")
        .set("Authorization", `Bearer ${secondUserToken}`);
      
      expect(res.statusCode).toEqual(200);
      // User B should have 0 saved items
      expect(res.body.data.length).toEqual(0);
    });

    it("TC-SAVED-003: User B cannot delete User A saved items", async () => {
      const res = await request(app)
        .delete("/api/v1/saved/ST-TEST-9999")
        .set("Authorization", `Bearer ${secondUserToken}`);
      
      expect(res.statusCode).toEqual(404); // Or 403, depending on implementation. In our repo, deletion uses findOneAndDelete with userId, so it returns 404.
    });
  });
});
