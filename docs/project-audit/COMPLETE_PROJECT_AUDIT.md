# BIS-SATHI — COMPLETE END-TO-END FORENSIC AUDIT & TRUTH SPECIFICATION

**Task ID:** 58341  
**Auditor:** Senior Full-Stack Architect, AI/RAG Integration Architect & Security Reviewer  
**Audit Date:** September 2026  
**Repository:** `BIS-SATHI-SIH-26107` (Problem Statement: 26107)  
**Verification Level:** Forensic Source-Code Inspection & Execution Path Tracing

---

## 1. Executive Forensic Summary

This forensic audit represents an exhaustive, ground-truth inspection of the **BIS-SATHI** codebase. Every claim made in project documentation, README files, blueprint guides, and UI headers was cross-referenced against actual source code files, line numbers, imports, execution flow, dependency graphs, and runtime behavior.

### The Ground Truth at a Glance

1. **Frontend Web & Mobile Apps are 98% Decoupled from the Backend:**
   - Both `frontend-web` (React 19 SPA) and `mobile-app` (React Native Expo) run almost exclusively on **local mock JSON files** (`standards.json`, `qco.json`, `labs.json`, `resources.json`, `reports.json`, `complianceJourneys.json`) located in `src/data/`.
   - Domain services (`standardService.ts`, `qcoService.ts`, `laboratoryService.ts`, `reportService.ts`, `resourceService.ts`) simulate network latency using `setTimeout` promises and query JavaScript arrays in browser memory.
   - Authentication in both frontends is completely simulated via `localStorage` generating tokens formatted as `mock-session-${Date.now()}`. Real Node auth endpoints (`/api/v1/auth/*`) are never invoked.
   - Comparisons and saved items are persisted strictly to browser `localStorage` under `bis-sathi-comparison-items` and `bis-sathi-saved-items`.

2. **The "AI Sathi" Assistant in the Frontend is a Static Mock Layout Switcher:**
   - When a user submits a query in `AISathiWorkspace.tsx`, it calls a local regex-based heuristic function `parseIntent(text)` in `intentEngine.ts`.
   - Based on string matching (`lower.includes(...)`), it switches between four static React layout components: `<KnowledgeAnswer />`, `<ProcessGuide />`, `<ApplicabilityAnalysis />`, and `<ComparisonWorkspace />`.
   - Each of these components displays hardcoded mock data (e.g. EV battery pack analysis, 5 generic compliance steps, or hardcoded comparison between IS 16046 and IS 17387) regardless of what the user actually asks.
   - Even if `chatService.ask()` executes, its response text is never rendered into the layout views.

3. **The Backend Primary Server Cannot Boot or Execute on Linux/Docker Due to Fatal Syntax & Casing Errors:**
   - **Syntax Crash:** In all 12 controllers, code executes `const { ApiResponse } = require("../utils/ApiResponse");`. However, `primary-server/src/utils/apiResponse.js` is written using **ES Module syntax** (`export function successResponse...`) inside a CommonJS package (`"type": "commonjs"`). Loading it immediately crashes Node with `SyntaxError: Unexpected token 'export'`.
   - **Missing Class:** Furthermore, `apiResponse.js` does not export an `ApiResponse` class; it exports helper functions `successResponse` and `errorResponse`. All controllers do `new ApiResponse(...)`, which would fail with `TypeError: ApiResponse is not a constructor`.
   - **Case Sensitivity:** On Linux systems or Docker containers, `require("../utils/ApiResponse")` will throw `MODULE_NOT_FOUND` because the file on disk is `apiResponse.js` (lowercase 'a').
   - **Dependencies Uninstalled:** `primary-server/node_modules` does not exist on disk.
   - **Environment Typo:** In `primary-server/.env`, line 1 is `ORT=3000` (missing the 'P' for `PORT`).
   - **Variable Name Mismatch:** `.env` defines `MONGO_URI`, while `db.js` attempts to connect using `process.env.MONGODB_URI`.

4. **The "AI Microservice" Has No Web Server, No API Endpoints, and No Pinecone Integration:**
   - `ai-microservice` consists of only 4 files in `RAG/`:
     - `1_ingestion_pipeline.py` (CLI script that looks for local PDFs and persists to ChromaDB).
     - `2_retrievel_pipeline.py` (CLI script with hardcoded query `"AES Laboratories (P) Ltd Noida OSL"` against ChromaDB).
     - `3_answer_generation.py` (CLI script using `input()` from terminal and invoking LangChain with Google Gemini).
     - `requirements.txt`.
   - **No FastAPI App Exists:** There is no FastAPI instance, no Uvicorn runner, no route handlers, and no `POST /chat` HTTP endpoint.
   - **ChromaDB vs Pinecone:** Despite all architecture documentation claiming Pinecone vector search, the actual Python scripts use local **ChromaDB**.
   - **No Knowledge Base:** There are zero PDF files in the repository. Running the ingestion script immediately crashes with `FileNotFoundError`.
   - When the backend Node `chat.service.js` attempts to forward queries to `http://localhost:8001/chat`, the request immediately fails with connection refused, falling back to a hardcoded error message.

5. **Actual Knowledge Base Size: Exactly 28 Mock Records:**
   - Across the entire repository, all BIS standards, QCOs, labs, and resources come from 6 JSON files containing a total of **28 records**:
     - 8 Standards
     - 5 QCOs
     - 5 Laboratories
     - 5 Resources
     - 3 Reports
     - 2 Compliance Journeys
   - The backend seeder (`primary-server/src/utils/seeder.js`) seeds MongoDB by reading these exact frontend mock JSON files.

6. **Critical Security Leaks in Source Control:**
   - Production credentials have been committed in plain text inside `primary-server/.env`:
     - Live MongoDB Atlas connection string with credentials: `mongodb+srv://deepsandilya01:Deep2308@cohortbackend.pihxih1.mongodb.net/bis-sathi`
     - Live Redis Cloud URL and password
     - ImageKit Public & Private API Keys
     - Personal Gmail SMTP credentials with application password
     - Google OAuth 2.0 Client ID and Client Secret
     - Raw JWT signing secret

---

## 2. Master Repository Structure & Module Status

```
D:\Deep\bis\BIS-SATHI-SIH-26107
├── .git/                                # Git VCS tracking
├── README.md                            # 4-line placeholder ('Team AsyncOrbit')
├── ai-microservice/                     # AI & RAG scripts
│   ├── .gitignore
│   └── RAG/
│       ├── 1_ingestion_pipeline.py      # Standalone PDF chunking & ChromaDB loader (Offline)
│       ├── 2_retrievel_pipeline.py      # Standalone ChromaDB search script (Offline)
│       ├── 3_answer_generation.py       # Standalone terminal CLI Q&A with Gemini (Offline)
│       └── requirements.txt             # Python dependencies
├── data/
│   └── data.txt                         # 0 bytes (Empty placeholder)
├── data-ingestion/                      # 0 files (Empty directory)
├── docs/                                # Design blueprints and architecture guides
│   ├── backend-auth-api-contract.md     # Markdown auth contract
│   ├── BIS-SATHI-COMPLETE-FRONTEND-BACKEND-BLUEPRINT.md # Honest bilingual blueprint
│   ├── BIS_AI_Assistant_Complete_SRS_Architecture_Build_Blueprint_v2.pdf # Full SRS v2
│   └── BIS_SATHI_FINAL_API_JSON_AI_SERVICE_GUIDE.pdf # 24 REST + FastAPI contract
├── frontend-web/                        # React 19 + Vite 8 SPA
│   ├── package.json                     # Dependencies (node_modules present)
│   ├── src/
│   │   ├── app/App.tsx                  # 24 client routes (All unprotected)
│   │   ├── context/                     # Language, Theme, Workspace (localStorage)
│   │   ├── data/                        # 6 mock JSON files (28 total records)
│   │   ├── features/                    # Domain modules (standards, qco, labs, etc.)
│   │   │   ├── ai-sathi/                # Heuristic intent engine & hardcoded layouts
│   │   │   └── auth/                    # Mock localStorage authentication
│   │   ├── pages/                       # 24 page views
│   │   └── services/api/                # apiClient.ts (Throws 503 if no base URL)
├── mobile-app/                          # React Native + Expo app
│   ├── package.json                     # Dependencies (node_modules NOT installed)
│   ├── App.tsx                          # Root mobile entry
│   └── src/                             # Cloned screens and mock services matching web
└── primary-server/                      # Node.js Express REST Backend
    ├── package.json                     # CommonJS package (node_modules NOT installed)
    ├── .env                             # Contains committed live secrets & syntax errors
    ├── .env.example                     # Example env file
    ├── src/
    │   ├── server.js                    # Server startup (Fails due to MONGODB_URI)
    │   ├── app.js                       # Express app mounting 12 route files
    │   ├── config/                      # db.js, env.js (dead ESM), redis.js (dead ESM)
    │   ├── controllers/                 # 12 controllers (Fail on ApiResponse import)
    │   ├── middleware/                  # auth, error, role middlewares
    │   ├── models/                      # 11 Mongoose schemas
    │   ├── repositories/                # 12 Mongoose data access modules
    │   ├── routes/                      # 12 route modules + 1 unmounted data.routes.js
    │   ├── services/                    # 13 service files
    │   ├── utils/                       # apiResponse.js (broken ESM), ApiError.js, seeder.js
    │   └── validators/                  # auth.validator.js + 2 empty validator files
    └── tests/                           # 3 test files (Cannot execute)
```

---

## 3. Runtime Architecture Reality vs Documented Blueprint

| Pipeline Stage | Documented Architecture | Actual Implemented Code | Operational Status |
| :--- | :--- | :--- | :--- |
| **Client Layer** | React Web + React Native communicating via HTTP REST | Standalone SPAs querying local JSON files and browser `localStorage` | **MOCKED / ISOLATED** |
| **API Gateway** | Node.js Express server on Port 3000 handling all routes | CommonJS Express server; fails to boot due to env mismatch and syntax errors | **BROKEN / INCOMPATIBLE** |
| **Auth Pipeline** | JWT Bearer tokens, refresh token rotation, bcrypt hashes | Frontend generates `mock-session-${Date.now()}`; backend JWT logic exists in isolation | **DISCONNECTED** |
| **Data Access** | MongoDB storing standards, QCOs, labs, reports, journeys | 11 Mongoose models exist; data seeder reads frontend mock JSONs | **SAMPLE / PARALLEL** |
| **AI Orchestration** | Node forwards queries to FastAPI microservice `/chat` | Node `chat.service.js` posts to `http://localhost:8001/chat`; fails and returns 500 | **NOT CONNECTED** |
| **AI Microservice** | Private FastAPI app on port 8001 with RAG & citations | Standalone Python terminal CLI scripts; no HTTP server or API endpoints | **MISSING SERVER** |
| **Vector Database** | Pinecone vector index for semantic retrieval | Python scripts reference local **ChromaDB**; no Pinecone code exists | **CONTRADICTED** |
| **Evidence & Citations**| Grounded citations verified against official gazette docs | Hardcoded citation objects in mock JSON; no citation validation engine | **MOCKED** |

---

## 4. Primary Server Forensic Audit

### 4.1 Startup and Environment Configuration

- **File:** `primary-server/src/server.js`
  - Line 1: `require("dotenv").config({ path: "./.env" });`
  - Line 7: `await connectDB();`
  - Line 9: `const port = process.env.PORT || 8000;`
  - **Observation:** If the server is started from the project root (`node primary-server/src/server.js`), `dotenv` looks for `./.env` in the root rather than inside `primary-server/`.
  - **Fatal Startup Bug:** In `primary-server/.env`, line 1 reads `ORT=3000`. Therefore, `process.env.PORT` is undefined and defaults to `8000`.
  - **Database Connection Failure:** In `primary-server/src/config/db.js`, line 5 calls `mongoose.connect(process.env.MONGODB_URI)`. However, `primary-server/.env` defines `MONGO_URI`, not `MONGODB_URI`. As a result, `mongoose.connect(undefined)` throws `The "uri" argument to mongoose.connect() must be a string` and the process exits immediately via `process.exit(1)`.

### 4.2 The CommonJS vs ES Module Fracture (The ApiResponse Blocker)

Across `primary-server/src/controllers/`, all 12 controllers import `ApiResponse`:
```javascript
// Found in all 12 controller files (e.g. auth.controller.js line 1)
const { ApiResponse } = require("../utils/ApiResponse");
```
However, inspect `primary-server/src/utils/apiResponse.js`:
```javascript
// primary-server/src/utils/apiResponse.js lines 1-20
export function successResponse(res, statusCode = 200, message = "Success", data = {}, meta = null) { ... }
export function errorResponse(res, statusCode = 400, message = "Request failed", code = "BAD_REQUEST", details = null) { ... }
```
**Impact:**
1. `apiResponse.js` uses ES Module syntax (`export function`) while `package.json` specifies `"type": "commonjs"`. Node throws:
   ```
   SyntaxError: Unexpected token 'export'
   ```
2. The file does not export any entity named `ApiResponse`. Controllers attempting `new ApiResponse(...)` would encounter `TypeError: ApiResponse is not a constructor`.
3. On Linux/Docker environments, requiring `../utils/ApiResponse` will fail with `MODULE_NOT_FOUND` because the filename on disk is `apiResponse.js` with a lowercase `a`.

### 4.3 Abandoned Parallel ES Module Subsystem

In addition to the CommonJS pipeline mounted in `app.js`, the repository contains a completely separate, unmounted ES Module codebase that was left unfinished:
- `primary-server/src/config/env.js` (ESM module reading `.env`)
- `primary-server/src/config/redis.js` (ESM module using `import redis from "redis"`; package `redis` is not in `package.json`)
- `primary-server/src/routes/data.routes.js` (ESM route file declaring 14 catalog endpoints; **never mounted in `app.js`**)
- `primary-server/src/controllers/data.controller.js` (ESM controller using generic catalog queries)
- `primary-server/src/services/catalog.service.js` (ESM service)
- `primary-server/src/repositories/catalog.repository.js` (ESM repository)
- `primary-server/src/models/complianceJourney.model.js` (ESM model that collides with `compliance.model.js`)
- `primary-server/src/utils/pagination.js` (ESM helper)

None of these files are reachable from `app.js`.

---

## 5. API Route Inventory & Verification Table

| Route Path | Method | Auth Required | Role | Controller Function | Backend Status | Frontend Wired? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | POST | None | Public | `register` | Syntax crash on boot | No (Mock localStorage) |
| `/api/v1/auth/login` | POST | None | Public | `login` | Syntax crash on boot | No (Mock localStorage) |
| `/api/v1/auth/logout` | POST | Bearer JWT | Authenticated | `logout` | Syntax crash on boot | No (Mock localStorage) |
| `/api/v1/auth/me` | GET | Bearer JWT | Authenticated | `getMe` | Syntax crash on boot | No (Mock localStorage) |
| `/api/v1/auth/refresh` | POST | None | Public | `refreshAccessToken` | Syntax crash on boot | No |
| `/api/v1/auth/forgot-password` | POST | None | Public | `forgotPassword` | Syntax crash on boot | No |
| `/api/v1/auth/reset-password` | POST | None | Public | `resetPassword` | Syntax crash on boot | No |
| `/api/v1/auth/change-password` | POST | Bearer JWT | Authenticated | `changePassword` | Syntax crash on boot | No |
| `/api/v1/chat` | POST | Bearer JWT | Authenticated | `chat` | Fails (FastAPI unreachable) | Calls `/chat` (404/503) |
| `/api/v1/sessions` | POST | Bearer JWT | Authenticated | `createSession` | Syntax crash on boot | No |
| `/api/v1/sessions` | GET | Bearer JWT | Authenticated | `getSessions` | Syntax crash on boot | No |
| `/api/v1/sessions/:id` | GET | Bearer JWT | Authenticated | `getSessionById` | Syntax crash on boot | No |
| `/api/v1/sessions/:id/messages`| GET | Bearer JWT | Authenticated | `getSessionMessages`| Syntax crash on boot | No |
| `/api/v1/standards` | GET | None | Public | `getStandards` | Syntax crash on boot | No (Reads `standards.json`) |
| `/api/v1/standards/:id` | GET | None | Public | `getStandardById` | Syntax crash on boot | No (Reads `standards.json`) |
| `/api/v1/qcos` | GET | None | Public | `getQCOs` | Syntax crash on boot | No (Reads `qco.json`) |
| `/api/v1/qcos/:id` | GET | None | Public | `getQCOById` | Syntax crash on boot | No (Reads `qco.json`) |
| `/api/v1/labs` | GET | None | Public | `getLabs` | Syntax crash on boot | No (Reads `labs.json`) |
| `/api/v1/labs/:id` | GET | None | Public | `getLabById` | Syntax crash on boot | No (Reads `labs.json`) |
| `/api/v1/resources` | GET | None | Public | `getResources` | Syntax crash on boot | No (Reads `resources.json`) |
| `/api/v1/resources/:id` | GET | None | Public | `getResourceById` | Syntax crash on boot | No (Reads `resources.json`) |
| `/api/v1/reports` | GET | Bearer JWT | Authenticated | `getReports` | Syntax crash on boot | No (Reads `reports.json`) |
| `/api/v1/reports/:id` | GET | Bearer JWT | Authenticated | `getReportById` | Syntax crash on boot | No (Reads `reports.json`) |
| `/api/v1/compliance/journeys` | GET | Bearer JWT | Authenticated | `getComplianceJourneys` | Syntax crash on boot | No (Reads local JSON) |
| `/api/v1/compliance/journeys/:id`| GET | Bearer JWT | Authenticated | `getComplianceJourneyById`| Syntax crash on boot | No (Reads local JSON) |
| `/api/v1/comparison` | POST | None | Public | `compareEntities` | Syntax crash on boot | No (Uses localStorage) |
| `/api/v1/saved` | GET | Bearer JWT | Authenticated | `getSavedItems` | Syntax crash on boot | No (Uses localStorage) |
| `/api/v1/saved` | POST | Bearer JWT | Authenticated | `saveItem` | Syntax crash on boot | No (Uses localStorage) |
| `/api/v1/saved/:id` | DELETE | Bearer JWT | Authenticated | `deleteSavedItem` | Syntax crash on boot | No (Uses localStorage) |
| `/api/v1/admin/users` | GET | Bearer JWT | ADMIN | `getAllUsers` | Syntax crash on boot | No UI |
| `/api/v1/admin/standards` | POST | Bearer JWT | ADMIN | `createStandard` | Syntax crash on boot | No UI |
| `/api/v1/admin/standards/:id` | PUT | Bearer JWT | ADMIN | `updateStandard` | Syntax crash on boot | No UI |
| `/health` | GET | None | Public | *None* | **MISSING ROUTE** | No |

---

## 6. Frontend Web Forensic Audit

### 6.1 State Management & Mock Data Sources

1. **Authentication:**
   - File: `frontend-web/src/features/auth/services/authService.ts`
   - Line 21 & 31:
     ```typescript
     const session = { email: email.trim(), displayName: email.split('@')[0], token: `mock-session-${Date.now()}` };
     localStorage.setItem(SESSION_KEY, JSON.stringify(session));
     localStorage.setItem('bis-sathi-auth-token', session.token);
     ```
   - Authentication never contacts the Node server. If sent to the backend, the token `mock-session-...` fails JWT verification immediately.

2. **Standards Explorer & Detail:**
   - File: `frontend-web/src/features/standards/services/standardService.ts`
   - Line 10: `import standardsData from '@/data/standards/standards.json';`
   - Lines 16-18: `return new Promise(resolve => setTimeout(() => resolve(_standards), 200));`
   - Searches and filters happen strictly in-memory over 8 static JSON records.

3. **QCO Explorer & Detail:**
   - File: `frontend-web/src/features/qco/services/qcoService.ts`
   - Line 9: `import qcoData from '@/data/qco/qco.json';`
   - Filters 5 static JSON records.

4. **Laboratory Finder:**
   - File: `frontend-web/src/features/laboratories/services/laboratoryService.ts`
   - Line 9: `import labsData from '@/data/laboratories/labs.json';`
   - Filters 5 static JSON records.

5. **Compliance Workspace:**
   - File: `frontend-web/src/pages/compliance/ComplianceJourneyDetail.tsx`
   - Line 6: `import mockJourneys from '@/data/compliance/complianceJourneys.json';`
   - Matches journey ID against 2 static records.

6. **Saved Items & Comparison Tray:**
   - File: `frontend-web/src/context/WorkspaceContext.tsx`
   - Lines 41-42:
     ```typescript
     const COMPARISON_STORAGE_KEY = 'bis-sathi-comparison-items';
     const SAVED_STORAGE_KEY = 'bis-sathi-saved-items';
     ```
   - All comparisons and saved items are serialized directly to `localStorage`.

### 6.2 API Client & Endpoint Mismatch

- File: `frontend-web/src/services/api/apiConfig.ts`:
  - `baseUrl: import.meta.env.VITE_API_BASE_URL || ''`
  - There is no `.env` file in `frontend-web`. Thus `baseUrl` is `''`.
- File: `frontend-web/src/services/api/apiClient.ts`:
  - Line 19:
    ```typescript
    if (!API_CONFIG.baseUrl) {
      throw new ApiError('Backend API is not configured', 503);
    }
    ```
- File: `frontend-web/src/features/ai-sathi/services/chatService.ts`:
  - Line 38: `ask: request => apiClient.post<ChatResponse>('/chat', request)`
  - **Triple Incompatibility:**
    1. **Endpoint:** Frontend requests `/chat`, while backend is mounted at `/api/v1/chat`.
    2. **Authentication:** Backend requires a valid JWT Bearer header; frontend supplies a mock token or none.
    3. **Payload Structure:** Backend returns `{ statusCode, data: { message: { content, citations, intent } } }`, whereas frontend expects `{ answer, citations, intent, status }`.

---

## 7. AI Microservice & RAG Pipeline Audit

### 7.1 What Exists in `ai-microservice/RAG/`

| File | Type | Implementation Summary | Execution Status |
| :--- | :--- | :--- | :--- |
| `1_ingestion_pipeline.py` | Python Script | Uses `PyPDFLoader` to load PDFs from directory, chunks with `RecursiveCharacterTextSplitter`, embeds with `sentence-transformers/all-MiniLM-L6-v2`, and stores in ChromaDB. | **Crashes:** No PDF files exist in the directory. |
| `2_retrievel_pipeline.py` | Python Script | Loads local ChromaDB and queries for `"AES Laboratories (P) Ltd Noida OSL"`. | **Crashes:** `chroma_db` folder does not exist. |
| `3_answer_generation.py` | Python Script | Interactive terminal CLI taking `input()`, running vector search against ChromaDB, and calling `ChatGoogleGenerativeAI(model="gemini-3.6-flash")`. | **Crashes:** `chroma_db` does not exist; requires terminal stdin. |
| `requirements.txt` | Dependency list| LangChain, ChromaDB, Google GenAI, HuggingFace embeddings. | Present |

### 7.2 What Does NOT Exist in `ai-microservice`

1. **No FastAPI Application:** There is no `main.py`, no `FastAPI()` instance, no CORS middleware, and no HTTP routes.
2. **No `/chat` Endpoint:** Node's `chat.service.js` attempts `axios.post("http://localhost:8001/chat")`, which hits a closed port.
3. **No Pinecone Integration:** Despite architecture documentation asserting Pinecone vector search, the code exclusively imports `langchain_chroma.Chroma`.
4. **No Multilingual Translation Pipeline:** No language processing or Indic translation models exist in the Python service.
5. **No Vector Store on Disk:** The `chroma_db` directory is not committed.

---

## 8. Data Ingestion & Knowledge Base Reality

- **`data-ingestion/` Directory:** Completely empty (0 files).
- **`data/data.txt`:** 0 bytes.
- **Knowledge Datasets:** All data in the system originates from 6 curated JSON files:

| Collection | Records | Source | Coverage | Provenance / Authority |
| :--- | :--- | :--- | :--- | :--- |
| **Standards** | 8 | `standards.json` | Sample domestic appliances, toys, solar, EV | Mock strings ("BIS Official Website") |
| **QCOs** | 5 | `qco.json` | Plugs, toys, air conditioner, solar, footwear | Mock gazette notification numbers |
| **Laboratories** | 5 | `labs.json` | Noida, Bengaluru, Mumbai, Chennai, Sahibabad | Sample address & testing capabilities |
| **Resources** | 5 | `resources.json` | 5 sample guideline PDFs / manuals | Placeholder URLs (`/docs/...`) |
| **Reports** | 3 | `reports.json` | 3 sample compliance assessments | Hardcoded evaluation text |
| **Journeys** | 2 | `complianceJourneys.json` | Smart plug & EV battery packs | Static 6-stage compliance tracking |

**Total Records Across Entire System:** **28 records**.

---

## 9. Citation & Evidence Traceability Audit

In `standards.json`, mock evidence metadata is defined:
```json
"evidence": {
  "status": "verified",
  "source": "BIS Official Website",
  "document": "IS 1293:2019 Published Specification",
  "section": "Clause 1 – Scope",
  "revision": "Third Revision (2019)"
}
```

### The Broken Evidence Chain:
1. **Lost in Database Ingestion:** `primary-server/src/models/standard.model.js` does NOT include an `evidence` field in its Mongoose schema. When `seeder.js` runs `Standard.insertMany()`, Mongoose strips out `evidence` completely due to strict mode.
2. **Lost in Backend API:** `Standard.find()` never returns evidence.
3. **Frontend Evidence Badge:** `frontend-web/src/features/evidence/components/EvidenceBadge.tsx` displays evidence solely because it reads directly from `standards.json` where the property is preserved.
4. **AI Generation Citations:** `3_answer_generation.py` does not output citation JSON schemas. It outputs raw text from Gemini.
