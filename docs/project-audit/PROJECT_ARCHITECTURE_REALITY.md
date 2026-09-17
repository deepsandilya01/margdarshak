# BIS-SATHI — PROJECT ARCHITECTURE REALITY

This document records the **actual runtime architecture** of BIS-SATHI as determined by source code imports, execution paths, and physical file presence.

---

## 1. Documented vs Real Architecture Comparison

```
DOCUMENTED ARCHITECTURE:
React Web / Mobile App
        │  (HTTP / REST)
        ▼
Node.js Express Gateway (Port 3000)
   ├── MongoDB (Users, Standards, Sessions, Reports)
   └── Redis (Session Cache & Rate Limiting)
        │  (Private HTTP POST /chat)
        ▼
FastAPI AI Microservice (Port 8001)
   ├── RAG Engine
   ├── Pinecone Vector DB
   ├── Google Gemini / OpenAI LLM
   └── Citation Validator Engine

----------------------------------------------------------------------

REAL RUNTIME ARCHITECTURE:
React Web (Vite, Port 5173)         Mobile App (Expo)
   │                                   │
   ├── local mock JSONs (28 items)     ├── local mock JSONs (28 items)
   ├── localStorage (Auth, Compare)    ├── local state (Auth, Compare)
   └── intentEngine.ts (Regex Intent)  └── intentEngine.ts (Regex Intent)
        │                                   │
        ▼ (Hardcoded Layout Switcher)       ▼ (Hardcoded Layout Switcher)
   <KnowledgeAnswer />, <ProcessGuide />, <ApplicabilityAnalysis />

[DISCONNECTED REST PIPELINE]
Node.js Express Server (Port 8000 default; crashes on boot)
   ├── Controllers fail on: require("../utils/ApiResponse")
   ├── db.js fails on: process.env.MONGODB_URI (undefined in .env)
   └── chat.service.js forwards to http://localhost:8001/chat
        │  (HTTP POST fails — Connection Refused)
        ▼
[NON-EXISTENT WEB SERVER]
ai-microservice/RAG/
   ├── 1_ingestion_pipeline.py (Offline CLI — no PDFs present)
   ├── 2_retrievel_pipeline.py  (Offline CLI — no chroma_db present)
   └── 3_answer_generation.py   (Interactive Terminal CLI with Gemini)
```

---

## 2. Layer-by-Layer Execution Flow Audit

### Path A: User Standard / QCO / Lab Discovery Flow

```
1. USER VISITS: /standards or /qco or /laboratories
2. COMPONENT: StandardsExplorer.tsx / QCOExplorer.tsx / LabFinder.tsx
3. HOOK: useStandards() / useQCOs() / useLabs()
4. SERVICE: standardService.ts / qcoService.ts / laboratoryService.ts
5. EXECUTION BREAK:
   Service imports local JSON file:
   - standardService imports '@/data/standards/standards.json'
   - qcoService imports '@/data/qco/qco.json'
   - laboratoryService imports '@/data/laboratories/labs.json'
6. DATA RETURN:
   Returns resolved Promise after setTimeout(200ms).
   NO HTTP CALL IS EVER INITIATED.
   Backend Node routes (/api/v1/standards, /api/v1/qcos, /api/v1/labs) are NEVER hit.
```

**Status:** `MOCKED / UI ONLY`

---

### Path B: Authentication Flow

```
1. USER VISITS: /login or /signup
2. COMPONENT: Login.tsx / Signup.tsx
3. SERVICE: authService.ts (frontend)
4. EXECUTION BREAK:
   signUp() & signIn() execute:
   token = "mock-session-" + Date.now();
   localStorage.setItem("bis-sathi-auth-token", token);
   localStorage.setItem("bis-sathi-auth-session", JSON.stringify(session));
5. DATA RETURN:
   Immediately returns fake session object.
   Node auth endpoints (/api/v1/auth/login, /api/v1/auth/register) are NEVER invoked.
   If this token is ever passed to Node, auth.middleware.js throws 401 INVALID_TOKEN.
```

**Status:** `MOCKED / DISCONNECTED`

---

### Path C: AI Sathi Chat Flow

```
1. USER VISITS: /ai-sathi
2. USER ENTERS: "What is BIS?" or "EV Battery Standards"
3. COMPONENT: AISathiWorkspace.tsx
4. STEP 1: chatService.ask()
   - Case 1: VITE_API_BASE_URL is not set:
     Calls mockChatService.ask() -> echoes user text back.
   - Case 2: VITE_API_BASE_URL is set:
     Calls apiClient.post('/chat') -> Hits wrong path (backend is /api/v1/chat).
     Even if directed to /api/v1/chat:
     -> Node chat.controller.js requires Bearer token (Frontend token is mock -> 401).
     -> Node chat.service.js posts to http://localhost:8001/chat (FastAPI does not exist -> ECONNREFUSED).
     -> Node catches error, saves assistant error message, and returns 500 AI service unavailable.
5. STEP 2: AISathiWorkspace layout rendering:
   - Ignores response text!
   - Runs local regex intent parser: parseIntent(text)
   - Switches layout:
     - GENERAL -> <KnowledgeAnswer /> (Static hardcoded text on BIS)
     - HOW_TO -> <ProcessGuide /> (Static hardcoded 5 steps)
     - PRODUCT_APPLICABILITY -> <ApplicabilityAnalysis /> (Static hardcoded EV battery pack)
     - COMPARISON -> <ComparisonWorkspace /> (Static hardcoded IS 16046 vs IS 17387)
```

**Status:** `PARTIALLY MOCKED / DISCONNECTED`

---

### Path D: Primary Server -> MongoDB Flow (When Booted Independently)

```
1. ROUTE: /api/v1/standards
2. CONTROLLER: standards.controller.js
3. SERVICE: standards.service.js
4. REPOSITORY: standards.repository.js
5. MODEL: standard.model.js
6. MONGO DATABASE: standards collection
```
*Note: This architecture is well-structured internally using the Repository pattern, but cannot execute at runtime due to the `ApiResponse.js` CommonJS/ESM syntax conflict and the uninstalled `node_modules`.*

**Status:** `CODE COMPLETE BUT RUNTIME INOPERABLE`

---

## 3. Communication Matrix

| Sender | Receiver | Protocol | Endpoint / Target | Real Status | Failure Point |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Frontend Web | Node Gateway | HTTP REST | `/chat` | **Broken** | 404 (Node is `/api/v1/chat`) |
| Frontend Web | Node Gateway | HTTP REST | `/api/v1/auth/*` | **Never Called** | Frontend uses `localStorage` |
| Frontend Web | Node Gateway | HTTP REST | `/api/v1/standards` | **Never Called** | Frontend reads local JSON |
| Mobile App | Node Gateway | HTTP REST | `/api/v1/*` | **Never Called** | Mobile reads local JSON |
| Node Gateway | FastAPI AI | HTTP POST | `http://localhost:8001/chat` | **Broken** | No FastAPI server running |
| FastAPI AI | Pinecone | gRPC / REST | Pinecone Index | **Non-Existent**| Python scripts use ChromaDB |
| FastAPI AI | Google Gemini | REST SDK | Gemini API | **CLI Only** | Only runs in `3_answer_generation.py` |
| Node Gateway | MongoDB Atlas | TCP / Wire | Atlas Cluster | **Broken on Boot**| `MONGODB_URI` undefined |
| Node Gateway | Redis Cloud | TCP / RESP | Redis Cloud | **Unused** | Redis client code is dead ESM |
