# BIS-SATHI — FRONTEND-TO-BACKEND INTEGRATION AUDIT

This document audits the connection status between the frontend applications (`frontend-web` and `mobile-app`) and the backend REST API (`primary-server`).

---

## 1. Master Frontend Services Audit Table

| Frontend Feature Service | Source File Path | Actual Data Source | Backend Route Target | Status | Root Cause & Observations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `src/features/auth/services/authService.ts` | `localStorage` | `/api/v1/auth/login`, `/register` | **MOCKED** | Generates fake token `mock-session-${Date.now()}`. Never sends HTTP request to Node. |
| **Standards** | `src/features/standards/services/standardService.ts` | `standards.json` | `/api/v1/standards`, `/:id` | **MOCKED** | File contains note: `CURRENT: returns local mock data (backend not ready). FUTURE: swap implementation to call apiClient.get('/standards')`. Queries in-memory array via `setTimeout`. |
| **QCOs** | `src/features/qco/services/qcoService.ts` | `qco.json` | `/api/v1/qcos`, `/:id` | **MOCKED** | Reads 5 records from `qco.json` via `setTimeout`. Does not import `apiClient`. |
| **Laboratories** | `src/features/laboratories/services/laboratoryService.ts` | `labs.json` | `/api/v1/labs`, `/:id` | **MOCKED** | Reads 5 records from `labs.json`. Filters city and name locally. |
| **Resources** | `src/features/resources/services/resourceService.ts` | `resources.json` | `/api/v1/resources`, `/:id` | **MOCKED** | Reads 5 records from `resources.json`. Filters category locally. |
| **Reports** | `src/features/reports/services/reportService.ts` | `reports.json` | `/api/v1/reports`, `/:id` | **MOCKED** | Reads 3 records from `reports.json`. |
| **Compliance Journeys** | Direct import in `ComplianceJourneyDetail.tsx` | `complianceJourneys.json` | `/api/v1/compliance/journeys` | **MOCKED** | Directly imports `mockJourneys` from `@/data/compliance/complianceJourneys.json`. |
| **Saved Items** | `src/context/WorkspaceContext.tsx` | `localStorage` | `/api/v1/saved` | **MOCKED** | Serializes items to `localStorage.getItem('bis-sathi-saved-items')`. |
| **Comparison Tray** | `src/context/WorkspaceContext.tsx` | `localStorage` | `/api/v1/comparison` | **MOCKED** | Serializes items to `localStorage.getItem('bis-sathi-comparison-items')`. Generates CSV export on client side. |
| **AI Sathi Chat** | `src/features/ai-sathi/services/chatService.ts` | Heuristic Layouts / `mockChatService` | `/api/v1/chat` | **BROKEN / MOCKED** | Defaults to `mockChatService` if `VITE_API_BASE_URL` is unset (echoes text). If set, calls `/chat` (wrong path) with mock token (auth fails). |
| **Indic Translation** | `src/services/translation/translationService.ts` | Static JSON / Lingva Proxy | N/A (External) | **MIXED** | Uses static i18n JSON files for 12 Indic languages; attempts Google Translate / Lingva public scrapers for dynamic text. |

---

## 2. API Contract & Path Compatibility Check

| Frontend API Call | Target File & Line | Expected Backend Route | Actual Backend Route | Path Match? | Body / Query Match? | Response Match? | Fatal Issue |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST /chat` | `chatService.ts:38` | `/chat` | `/api/v1/chat` | **NO** | Yes (`message`, `language`, `sessionId`) | **NO** | Path 404; response expects `{ answer, citations }`, Node returns `{ data: { message: { content } } }`. |
| `POST /api/auth/login` | `docs/backend-auth-api-contract.md` | `/api/auth/login` | `/api/v1/auth/login` | **NO** | Yes (`email`, `password`) | Yes | Documentation omitted `/v1` prefix. Frontend never makes the call. |
| `GET /standards` | `standardService.ts:6` (Comment) | `/standards` | `/api/v1/standards` | **NO** | Query parameters match | Yes | Path prefix `/api/v1` missing from commented service contract. |
| `GET /qcos` | `qcoService.ts:6` (Comment) | `/qcos` | `/api/v1/qcos` | **NO** | Query parameters match | Yes | Path prefix `/api/v1` missing. |
| `GET /laboratories` | `laboratoryService.ts:6` (Comment) | `/laboratories`| `/api/v1/labs` | **NO** | Parameter mismatch | Yes | Name mismatch (`laboratories` vs `labs`). |

---

## 3. Unused API Client Analysis

In `frontend-web/src/services/api/apiClient.ts`, a generic HTTP client with GET, POST, PUT, PATCH, DELETE methods is implemented.

**Inspection Findings:**
- Across all 150+ source files in `frontend-web`, `apiClient` is imported in exactly **ONE** file: `frontend-web/src/features/ai-sathi/services/chatService.ts`.
- It is **0% used** by standards, QCOs, laboratories, resources, reports, compliance journeys, authentication, profile, comparison, and saved bookmarks.
- In `mobile-app`, `apiClient.ts` is also imported in exactly one file (`chatService.ts`).
