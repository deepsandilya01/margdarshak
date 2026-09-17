// Automated Endpoint Verification Test Suite for BIS-SATHI Primary Server
const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🧪 STARTING BIS-SATHI PRIMARY SERVER ENDPOINT TESTS");
  console.log("=======================================================\n");

  const timestamp = Date.now();
  const testUser = {
    name: "SIH Verification User",
    email: `test_${timestamp}@bis-sathi.gov.in`,
    password: "Password123!",
  };

  let accessToken = null;
  let refreshToken = null;
  let userId = null;
  let sessionId = null;
  let savedItemId = null;

  // 1. Health Checks
  console.log("[1] Testing Health Checks...");
  try {
    const res1 = await fetch(`${BASE_URL}/health`);
    const data1 = await res1.json();
    assert(res1.status === 200, "GET /health returns 200 OK");
    assert(data1.status === "ok", "GET /health status is 'ok'");
    assert(data1.services.database === "ok", "GET /health database is 'ok'");

    const res2 = await fetch(`${BASE_URL}/api/v1/health`);
    const data2 = await res2.json();
    assert(res2.status === 200, "GET /api/v1/health returns 200 OK");
    assert(data2.services.redis === "ok", "GET /api/v1/health redis is ok");
  } catch (err) {
    assert(false, `Health check threw error: ${err.message}`);
  }

  // 2. User Registration
  console.log("\n[2] Testing User Registration...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    assert(res.status === 201, `POST /auth/register status is 201 (Got ${res.status})`);
    assert(data.success === true, "POST /auth/register success is true");
    assert(data.data.user.email === testUser.email, "Registered user email matches");
    assert(!!data.data.accessToken, "Registration returns accessToken");
    assert(!!data.data.refreshToken, "Registration returns refreshToken");
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
    userId = data.data.user._id || data.data.user.id;
  } catch (err) {
    assert(false, `Register threw error: ${err.message}`);
  }

  // 3. Duplicate Registration (Negative Test)
  console.log("\n[3] Testing Duplicate Registration Prevention...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    assert(res.status === 409, `POST /auth/register duplicate returns 409 Conflict (Got ${res.status})`);
    assert(data.success === false, "Duplicate registration success is false");
  } catch (err) {
    assert(false, `Duplicate register test threw error: ${err.message}`);
  }

  // 4. User Login
  console.log("\n[4] Testing User Login...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await res.json();
    assert(res.status === 200, `POST /auth/login returns 200 OK (Got ${res.status})`);
    assert(data.success === true, "Login success is true");
    assert(!!data.data.accessToken, "Login returns fresh accessToken");
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
  } catch (err) {
    assert(false, `Login threw error: ${err.message}`);
  }

  // 5. Invalid Login (Negative Test)
  console.log("\n[5] Testing Invalid Credentials Login...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "WrongPassword999!",
      }),
    });
    const data = await res.json();
    assert(res.status === 401, `Invalid login returns 401 Unauthorized (Got ${res.status})`);
    assert(data.success === false, "Invalid login returns success: false");
  } catch (err) {
    assert(false, `Invalid login test threw error: ${err.message}`);
  }

  // 6. Current User Profile (/auth/me)
  console.log("\n[6] Testing Protected Profile Route (GET /auth/me)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "GET /auth/me returns 200 OK");
    assert(data.data.user.email === testUser.email, "Profile email matches registered user");
    assert((data.data.user._id || data.data.user.id) === userId, "Profile ID matches registered user ID");
  } catch (err) {
    assert(false, `/auth/me threw error: ${err.message}`);
  }

  // 7. Token Refresh (/auth/refresh)
  console.log("\n[7] Testing Token Refresh (POST /auth/refresh)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    assert(res.status === 200, "POST /auth/refresh returns 200 OK");
    assert(!!data.data.accessToken, "Refresh returns new accessToken");
    assert(!!data.data.refreshToken, "Refresh returns new refreshToken");
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
  } catch (err) {
    assert(false, `Refresh threw error: ${err.message}`);
  }

  // 8. Session Management - Create Session
  console.log("\n[8] Testing Chat Session Creation (POST /sessions)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: "Cement Testing Standards Consultation" }),
    });
    const data = await res.json();
    assert(res.status === 201, "POST /sessions returns 201 Created");
    assert(data.success === true, "Session created successfully");
    assert(data.data.title === "Cement Testing Standards Consultation", "Session title matches");
    sessionId = data.data._id || data.data.id;
  } catch (err) {
    assert(false, `Create session threw error: ${err.message}`);
  }

  // 9. Session Management - List Sessions
  console.log("\n[9] Testing Session Listing (GET /sessions)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sessions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "GET /sessions returns 200 OK");
    assert(Array.isArray(data.data), "Sessions returned as array");
    assert(data.data.some((s) => (s._id || s.id) === sessionId), "Created session exists in listing");
  } catch (err) {
    assert(false, `List sessions threw error: ${err.message}`);
  }

  // 10. Session Management - Update Title
  console.log("\n[10] Testing Session Update (PATCH /sessions/:id)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: "IS 269 Cement Testing Requirements" }),
    });
    const data = await res.json();
    assert(res.status === 200, "PATCH /sessions/:id returns 200 OK");
    assert(data.data.title === "IS 269 Cement Testing Requirements", "Session title updated");
  } catch (err) {
    assert(false, `Update session threw error: ${err.message}`);
  }

  // 11. AI Gateway & Chat Message (/api/v1/chat)
  console.log("\n[11] Testing AI Gateway & Chat Interaction (POST /chat)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: "What are the chemical testing requirements under IS 269 for Ordinary Portland Cement?",
      }),
    });
    const data = await res.json();
    assert(res.status === 200, `POST /chat returns 200 OK (Got ${res.status})`);
    assert(data.success === true, "POST /chat returned success: true");
    assert(!!data.data.messageId, "Assistant messageId is returned");
    assert(!!data.data.userMessageId, "User messageId is returned");
    assert(!!data.data.answer && !!data.data.answer.text, "Answer object contains text");
    console.log(`    Note: Assistant answer text snippet: "${data.data.answer.text.slice(0, 80)}..."`);
  } catch (err) {
    assert(false, `Chat endpoint threw error: ${err.message}`);
  }

  // 12. Message History Retrieval (/sessions/:id/messages)
  console.log("\n[12] Testing Message History Retrieval (GET /sessions/:id/messages)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sessions/${sessionId}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "GET /sessions/:id/messages returns 200 OK");
    assert(Array.isArray(data.data.messages), "Messages returned as array");
    assert(data.data.messages.length >= 2, `History contains both user and assistant messages (Count: ${data.data.messages.length})`);
    assert(data.data.messages[0].role === "user", "First message in thread is user");
    assert(data.data.messages[1].role === "assistant", "Second message in thread is assistant");
  } catch (err) {
    assert(false, `Get messages threw error: ${err.message}`);
  }

  // 13. Saved Items - Create Saved Item (POST /saved)
  console.log("\n[13] Testing Bookmark / Saved Item Creation (POST /saved)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        type: "standard",
        title: "IS 269:2015 Ordinary Portland Cement Specification",
        referenceId: "IS-269-2015",
        metadata: {
          standardNumber: "IS 269:2015",
          department: "Civil Engineering Division",
          isMandatory: true,
        },
      }),
    });
    const data = await res.json();
    assert(res.status === 201, `POST /saved returns 201 Created (Got ${res.status})`);
    assert(data.success === true, "POST /saved success is true");
    assert(data.data.type === "standard", "Saved item type matches");
    assert(data.data.referenceId === "IS-269-2015", "Saved item referenceId matches");
    savedItemId = data.data._id || data.data.id;
  } catch (err) {
    assert(false, `Create saved item threw error: ${err.message}`);
  }

  // 14. Saved Items - List (GET /saved)
  console.log("\n[14] Testing Saved Items Listing (GET /saved)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/saved`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "GET /saved returns 200 OK");
    assert(Array.isArray(data.data), "Items returned as array");
    assert(data.data.some((i) => (i._id || i.id) === savedItemId), "Created saved item is present");
  } catch (err) {
    assert(false, `List saved items threw error: ${err.message}`);
  }

  // 15. Saved Items - Delete (DELETE /saved/:id)
  console.log("\n[15] Testing Saved Item Deletion (DELETE /saved/:id)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/saved/${savedItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "DELETE /saved/:id returns 200 OK");
    assert(data.success === true, "Saved item deleted successfully");
  } catch (err) {
    assert(false, `Delete saved item threw error: ${err.message}`);
  }

  // 16. Session Deletion (DELETE /sessions/:id)
  console.log("\n[16] Testing Session Cascade Deletion (DELETE /sessions/:id)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    assert(res.status === 200, "DELETE /sessions/:id returns 200 OK");
    assert(data.success === true, "Session deleted successfully");

    // Verify deleted session returns 404
    const checkRes = await fetch(`${BASE_URL}/api/v1/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert(checkRes.status === 404, "Deleted session returns 404 Not Found");
  } catch (err) {
    assert(false, `Delete session threw error: ${err.message}`);
  }

  // 17. User Logout (POST /auth/logout)
  console.log("\n[17] Testing User Logout (POST /auth/logout)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, "POST /auth/logout returns 200 OK");
    assert(data.success === true, "Logout successfully invalidated refresh tokens");
  } catch (err) {
    assert(false, `Logout threw error: ${err.message}`);
  }

  // 18. Authentication Guard (Negative Test - Unauthorized Request)
  console.log("\n[18] Testing Auth Guard on Protected Route without Token...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`);
    const data = await res.json();
    assert(res.status === 401, `Unauthenticated request returns 401 Unauthorized (Got ${res.status})`);
    assert(data.success === false, "Unauthorized response success is false");
  } catch (err) {
    assert(false, `Auth guard test threw error: ${err.message}`);
  }

  // 19. Unmatched Route 404
  console.log("\n[19] Testing 404 Handler for Undefined Route...");
  const res19 = await fetch(`${BASE_URL}/api/v1/invalid-route`);
  const data19 = await res19.json();
  assert(res19.status === 404, "Unknown route returns 404 Not Found (Got " + res19.status + ")");
  assert(data19.code === "ROUTE_NOT_FOUND", "Error code is ROUTE_NOT_FOUND");

  console.log("\n[20] Testing Standards Catalog (GET /api/v1/standards)...");
  const res20 = await fetch(`${BASE_URL}/api/v1/standards`);
  const data20 = await res20.json();
  assert(res20.status === 200, "GET /standards returns 200 OK");
  assert(Array.isArray(data20.data), "Standards returned as array");

  console.log("\n[21] Testing QCOs Catalog (GET /api/v1/qcos)...");
  const res21 = await fetch(`${BASE_URL}/api/v1/qcos`);
  const data21 = await res21.json();
  assert(res21.status === 200, "GET /qcos returns 200 OK");
  assert(Array.isArray(data21.data), "QCOs returned as array");

  console.log("\n[22] Testing Labs Catalog (GET /api/v1/labs)...");
  const res22 = await fetch(`${BASE_URL}/api/v1/labs`);
  const data22 = await res22.json();
  assert(res22.status === 200, "GET /labs returns 200 OK");
  assert(Array.isArray(data22.data), "Labs returned as array");

  console.log("\n[23] Testing Admin Users Listing (GET /api/v1/admin/users)...");
  const res23 = await fetch(`${BASE_URL}/api/v1/admin/users`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  // This user defaults to "user" role, so it should fail with 403
  assert([401, 403].includes(res23.status), "Non-admin access returns 403/401 (Got " + res23.status + ")");

  // 24. Forgot Password
  console.log("\n[24] Testing Forgot Password (POST /auth/forgot-password)...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email }),
    });
    const data = await res.json();
    assert(res.status === 200, "POST /auth/forgot-password returns 200 OK");
    assert(data.message.includes("instructions have been sent"), "Safe response message returned");
  } catch (err) {
    assert(false, `Forgot password threw error: ${err.message}`);
  }

  // 25. Change Password
  console.log("\n[25] Testing Change Password (POST /auth/change-password)...");
  try {
    // Re-login to get fresh tokens
    const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const loginData = await loginRes.json();
    const freshToken = loginData.data.accessToken;

    const res = await fetch(`${BASE_URL}/api/v1/auth/change-password`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${freshToken}` 
      },
      body: JSON.stringify({ 
        currentPassword: testUser.password,
        newPassword: "NewPassword123!"
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "POST /auth/change-password returns 200 OK");
    assert(data.success === true, "Password changed successfully");

    // Verify old password no longer works
    const checkLoginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    assert(checkLoginRes.status === 401, "Old password rejected after change");

    // Verify new password works
    const newLoginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: "NewPassword123!" }),
    });
    assert(newLoginRes.status === 200, "New password accepted");
  } catch (err) {
    assert(false, `Change password threw error: ${err.message}`);
  }

  // 26. Reset Password (Negative test without valid token)
  console.log("\n[26] Testing Reset Password (POST /auth/reset-password) Invalid Token...");
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "invalid-or-fake-token", newPassword: "AnotherPassword123!" }),
    });
    const data = await res.json();
    assert(res.status === 400, "POST /auth/reset-password with invalid token returns 400 Bad Request");
    assert(data.code === "INVALID_RESET_TOKEN", "Reset token is invalid or has expired");
  } catch (err) {
    assert(false, `Reset password negative test threw error: ${err.message}`);
  }

  console.log(`\n=======================================================`);
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
