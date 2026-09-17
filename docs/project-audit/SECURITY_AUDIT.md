# BIS-SATHI — SECURITY AUDIT & VULNERABILITY REPORT

This document details the security posture, authentication architecture, data protection mechanisms, and critical vulnerabilities identified across the BIS-SATHI repository.

---

## 1. Vulnerability Summary Table

| Severity | ID | Vulnerability Title | Affected File / Function | Risk Impact |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | `SEC-001` | Live Production Credentials Committed to VCS | `primary-server/.env` | Full takeover of MongoDB Atlas cluster, Redis instance, ImageKit media, and Gmail SMTP service. |
| **HIGH** | `SEC-002` | Permissive CORS with Wildcard and Credentials Enabled | `primary-server/src/app.js:11-16` | Cross-Origin Request Forgery and unauthorized API access if deployed with wildcard origin. |
| **HIGH** | `SEC-003` | Stack Trace Information Leakage in Development Mode | `primary-server/src/middleware/error.middleware.js:32-34` | Exposes internal server architecture, directory paths, and database query signatures to clients. |
| **MEDIUM** | `SEC-004` | Missing Input Validation Middleware on Routes | `primary-server/src/routes/auth.routes.js`, `standards.routes.js` | Injection risks, unhandled edge cases, empty validator files. |
| **MEDIUM** | `SEC-005` | Unprotected Frontend Routes & Mock Client Tokens | `frontend-web/src/app/App.tsx`, `authService.ts` | Frontend provides zero client-side route protection; mock tokens bypass frontend security. |
| **LOW** | `SEC-006` | Global Rate Limiter without Endpoint-Specific Brute Force Protection | `primary-server/src/app.js:19-23` | Login/register routes subject to credential stuffing up to 100 requests per 15 minutes. |

---

## 2. Detailed Vulnerability Findings

### SEC-001: Live Production Credentials Committed to Git Repository
- **Severity:** **CRITICAL**
- **Evidence:** `primary-server/.env`
  - Line 2: `MONGO_URI=mongodb+srv://deepsandilya01:Deep2308@cohortbackend.pihxih1.mongodb.net/bis-sathi`
  - Lines 7-10: Live Redis Cloud URI (`redis://:5iYGKTna1YGfVceBgIKu1x7LdVIN4Yhl@redis-14740.c83.us-east-1-2.ec2.cloud.redislabs.com:14740`) with plaintext password.
  - Lines 12-14: ImageKit private API key (`private_wckg3wO7djomiZROz6UUrODrk1I=`).
  - Lines 16-19: Personal Gmail SMTP address and 16-character Google App Password (`vqht gfix gspm eqpg`).
  - Lines 23-24: Google OAuth 2.0 Client ID and Secret (`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`).
  - Line 4: Raw JWT Secret.
- **Risk:**
  - Any user or scanner with repository read access can connect directly to the MongoDB cluster to read, tamper with, or wipe the entire database.
  - The committed Gmail application password allows automated unauthorized email dispatch from the developer's personal Google account.
  - Redis cache and ImageKit storage can be manipulated or depleted.
- **Recommendation:**
  1. Immediately revoke and regenerate the MongoDB Atlas user password, Google App Password, ImageKit API keys, and OAuth secrets.
  2. Remove `.env` from git tracking (`git rm --cached primary-server/.env`) and purge commit history using `git-filter-repo` or BFG.
  3. Ensure `.env` is listed in `primary-server/.gitignore`.

---

### SEC-002: Insecure CORS Configuration
- **Severity:** **HIGH**
- **Evidence:** `primary-server/src/app.js`
  ```javascript
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  );
  ```
- **Risk:**
  When `process.env.CORS_ORIGIN` is not defined (as is currently the case in `primary-server/.env`), the origin falls back to `"*"`. While modern browsers block `Access-Control-Allow-Origin: *` when `Access-Control-Allow-Credentials: true` is set, misconfigured proxies or mobile webviews can permit cross-origin credential transmission.
- **Recommendation:**
  Explicitly specify trusted origins (e.g. `http://localhost:5173`) and disallow wildcard origins when credentials are enabled.

---

### SEC-003: Internal Stack Trace Leakage
- **Severity:** **HIGH**
- **Evidence:** `primary-server/src/middleware/error.middleware.js`
  ```javascript
  if (process.env.NODE_ENV === "development") {
    response.error.stack = error.stack;
  }
  ```
- **Risk:**
  In `primary-server/.env`, `NODE_ENV=development` is set. When runtime exceptions occur, complete file paths, module names, and line numbers are serialized in JSON error responses to external callers.
- **Recommendation:**
  Never serialize `error.stack` into HTTP responses, even in development, or restrict stack trace visibility to server console logs.

---

### SEC-004: Missing Request Validation on Registered Routes
- **Severity:** **MEDIUM**
- **Evidence:**
  - `primary-server/src/validators/comparison.validator.js` is an empty file (0 bytes).
  - `primary-server/src/validators/standard.validator.js` is an empty file (0 bytes).
  - `primary-server/src/validators/auth.validator.js` contains Joi/custom validation logic, but is **never imported or attached as middleware** in `primary-server/src/routes/auth.routes.js`.
- **Risk:**
  Endpoints rely on manual checking within controller functions. Incomplete checks (e.g. standard filters) allow unvalidated input to pass into database query selectors.
- **Recommendation:**
  Implement standardized validation middleware using `zod` or `joi` on all route definitions.

---

### SEC-005: Unprotected Frontend Routes
- **Severity:** **MEDIUM**
- **Evidence:** `frontend-web/src/app/App.tsx`
  - Routes such as `/workspace`, `/workspace/:id`, `/profile`, `/settings`, and `/reports` are declared directly without any `ProtectedRoute` wrapper.
- **Risk:**
  Unauthenticated users can navigate directly to user workspaces and profile pages. Because the workspace runs on `localStorage`, dummy data is displayed with no requirement to sign in.
- **Recommendation:**
  Implement a `ProtectedRoute` component that checks for an active, valid authentication token before rendering protected routes.
