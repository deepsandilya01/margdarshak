# BIS-SATHI — PRIORITIZED IMPLEMENTATION & INTEGRATION ROADMAP

This document outlines the sequential, minimal-interruption technical phases required to transition the BIS-SATHI repository from its current state (mock-based frontend + inoperable backend) into a **verifiable, end-to-end operational platform**.

---

## Phase 0: Critical Startup & Deployment Blockers

### Task 0.1: Fix CommonJS `ApiResponse` Utility Class
- **Problem:** All 12 controllers execute `const { ApiResponse } = require("../utils/ApiResponse");`, but `apiResponse.js` is written in ES Module syntax and only exports helper functions, causing immediate `SyntaxError` on boot.
- **Action:**
  - Create/standardize `primary-server/src/utils/ApiResponse.js` as a CommonJS class:
    ```javascript
    class ApiResponse {
      constructor(statusCode, data, message = "Success", meta = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        if (meta) this.meta = meta;
      }
    }
    module.exports = { ApiResponse };
    ```
  - Ensure exact file casing matches imports for Linux compatibility.

### Task 0.2: Correct `.env` Variable Names & Typo
- **Problem:** `ORT=3000` causes PORT to be undefined. `db.js` looks for `MONGODB_URI`, but `.env` specifies `MONGO_URI`.
- **Action:**
  - In `primary-server/.env`, rename `ORT=3000` to `PORT=3000`.
  - In `primary-server/src/config/db.js`, accept both:
    ```javascript
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    ```

### Task 0.3: Install Backend Dependencies
- **Problem:** `primary-server/node_modules` is not installed.
- **Action:** Run `npm install` inside `primary-server/` to install `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `helmet`, `axios`, etc.

### Task 0.4: Purge Committed Secrets from Git Tracking
- **Problem:** Active Atlas database, Redis, ImageKit, and Gmail credentials are in source control.
- **Action:** Regenerate external service credentials and ensure `primary-server/.env` is ignored by Git.

---

## Phase 1: Primary Server Stabilization

### Task 1.1: Add Standard Health Check Endpoint
- **Action:** Mount `GET /health` and `GET /api/v1/health` in `primary-server/src/app.js` returning database status and uptime.

### Task 1.2: Delete/Archive Dead ES Module Subsystem
- **Action:** Remove orphan files:
  - `primary-server/src/routes/data.routes.js`
  - `primary-server/src/controllers/data.controller.js`
  - `primary-server/src/services/catalog.service.js`
  - `primary-server/src/repositories/catalog.repository.js`
  - `primary-server/src/models/complianceJourney.model.js` (conflicts with `compliance.model.js`)
  - `primary-server/src/config/env.js` and `redis.js`

### Task 1.3: Wire Input Validation Middleware
- **Action:** Attach `auth.validator.js` to `auth.routes.js` for registration and login validation.

---

## Phase 2: AI Microservice & FastAPI Bridge

### Task 2.1: Implement FastAPI HTTP Application
- **Problem:** `ai-microservice` only contains standalone CLI scripts; Node cannot connect to port 8001.
- **Action:**
  - Create `ai-microservice/app/main.py` using FastAPI and Uvicorn.
  - Implement endpoint `POST /chat` conforming to the JSON contract:
    - Input: `{ sessionId: str, message: str, language: str, context: Optional[dict] }`
    - Output: `{ requestId: str, status: str, intent: str, answer: str, citations: list, context: dict }`

### Task 2.2: Bridge RAG Pipeline to FastAPI
- **Action:** Wrap the retrieval logic in `2_retrievel_pipeline.py` and `3_answer_generation.py` into an async service function invoked by `POST /chat`.

### Task 2.3: Provide Actual Seed PDF Documents
- **Action:** Populate `ai-microservice/RAG/` with at least 5-10 official Indian Standard PDFs (e.g. IS 1293, IS 16046) and execute `1_ingestion_pipeline.py` to persist `chroma_db/`.

---

## Phase 3: Frontend API Integration

### Task 3.1: Configure Frontend Environment
- **Action:** Create `frontend-web/.env` with `VITE_API_BASE_URL=http://localhost:3000/api/v1`.

### Task 3.2: Wire Real Authentication
- **Action:**
  - Update `frontend-web/src/features/auth/services/authService.ts` to call `POST /api/v1/auth/login` and `POST /api/v1/auth/register` using `apiClient`.
  - Store real JWT in `localStorage` under `bis-sathi-auth-token`.

### Task 3.3: Wire Domain Services to Backend APIs
- **Action:**
  - In `standardService.ts`: Replace `_standards` mock array with `apiClient.get('/standards')` and `apiClient.get('/standards/' + id)`.
  - In `qcoService.ts`: Replace `_qcos` with `apiClient.get('/qcos')`.
  - In `laboratoryService.ts`: Replace `_labs` with `apiClient.get('/labs')`.
  - In `resourceService.ts`: Replace `_resources` with `apiClient.get('/resources')`.
  - In `reportService.ts`: Replace `_reports` with `apiClient.get('/reports')`.
  - In `WorkspaceContext.tsx`: Replace local storage with `GET /saved`, `POST /saved`, `DELETE /saved/:id`.

### Task 3.4: Connect AI Sathi Workspace to Real LLM Responses
- **Action:**
  - Update `AISathiWorkspace.tsx` to render the dynamic text answer returned by `chatService.ask()`.
  - Display actual citation sources returned in `response.citations`.

---

## Phase 4: Database Seeding & Verification

### Task 4.1: Decouple Database Seeder
- **Action:**
  - Move mock datasets from `frontend-web/src/data/` into a dedicated backend directory `primary-server/data/seed/`.
  - Update `standard.model.js` schema to retain `evidence` object properties.
  - Add `"seed": "node src/utils/seeder.js"` to `primary-server/package.json`.
  - Run database seed to populate MongoDB collections.

---

## Phase 5: Automated Testing & Verification

### Task 5.1: Fix Jest Test Suite
- **Action:**
  - Update `primary-server/tests/api.test.js` to run against an in-memory database or test Atlas instance.
  - Fix import syntax and verify that all 3 test files pass `npm test`.

### Task 5.2: End-to-End Smoke Test
- **Action:** Run non-destructive automated browser checks verifying that:
  - User signup creates record in MongoDB.
  - Standards list loads from MongoDB API.
  - AI chat prompt triggers FastAPI and displays grounded answer.
