# BIS-SATHI End-to-End API Test Matrix

This document outlines the test scenarios executed against the Primary Backend API leveraging Jest and Supertest.

## 1. Authentication & Integrity Flows
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-AUTH-001 | Auth | `POST /register` | Valid Registration | `201 Created` | ✅ PASS |
| TC-AUTH-002 | Auth | `POST /register` | Duplicate Email Registration | `409 Conflict` | ✅ PASS |
| TC-AUTH-007 | Auth | `POST /login` | Valid Login | `200 OK` + Tokens | ✅ PASS |
| TC-AUTH-011 | Auth | `GET /me` | Fetch active user using Access Token | `200 OK` | ✅ PASS |

## 2. Admin Authentication & Role Enforcement
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-ADMIN-001 | Admin | `GET /admin/users` | Admin successfully accessing route | `200 OK` | ✅ PASS |
| TC-ADMIN-002 | Admin | `GET /admin/users` | Standard User attempting access | `403 Forbidden` | ✅ PASS |
| TC-ADMIN-005 | Admin | `POST /admin/standards`| Admin creating a Standard | `201 Created` | ✅ PASS |
| TC-STD-001 | Public | `GET /standards` | Anyone verifying created standard | `200 OK` | ✅ PASS |

## 3. Conversational AI Session Flow
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-SESSION-001 | Session | `POST /sessions` | User creating AI Thread | `201 Created` | ✅ PASS |
| TC-CHAT-001 | Chat | `POST /chat` | Submit message (Mocking FastAPI failure fallback) | `500 Server Error` + Persisted "Error Message" | ✅ PASS |
| TC-SESSION-011 | Session | `GET /sessions/:id/messages`| Validate chronologized context rendering | `200 OK` (2 Msg array) | ✅ PASS |

## 4. IDOR (Insecure Direct Object Reference) Protections
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-SESSION-009 | Session | `GET /sessions/:id` | USER A attempts fetching USER B's session ID | `404 Not Found` | ✅ PASS |
| TC-REPORT-004 | Reports | `GET /reports/:id` | USER B attempts fetching USER A's generated report | `404 Not Found` | ✅ PASS |

## 5. Public Discovery Flow (Resources & Comparison)
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-RES-001 | Resources| `GET /resources` | Anyone can view public resources | `200 OK` | ✅ PASS |
| TC-COMP-001 | Compare | `POST /comparison`| Fetch standard data by array injection | `200 OK` | ✅ PASS |

## 6. Saved Items IDOR Flow
| Test ID | Module | Endpoint | Scenario | Expected | Status |
|---------|--------|----------|----------|----------|--------|
| TC-SAVED-001 | Saved | `POST /saved` | User A can save an item | `201 Created` | ✅ PASS |
| TC-SAVED-002 | Saved | `GET /saved` | User B cannot see User A saved items | `200 OK` (0 items) | ✅ PASS |
| TC-SAVED-003 | Saved | `DEL /saved/:id` | User B cannot delete User A saved items | `404 Not Found` | ✅ PASS |

---
**Summary of Final E2E Test Execution (`npm test`):**
- Total Executed: 18 Scenarios
- Passing: 18 Scenarios
- Failed: 0 Scenarios
- Architecture Tested: The complete **4-Tier Pipeline** (Controller ⭢ Service ⭢ Repository ⭢ DB).
