# BIS-SATHI — EXECUTIVE PROJECT STATUS SUMMARY

**SIH Problem Statement:** 26107  
**Team:** AsyncOrbit  
**Project:** BIS-SATHI (AI-Powered Assistant for Indian Standards & BIS Services)  
**Evaluation Perspective:** Technical Reality vs Architecture Blueprint

---

## 1. High-Level Summary for Developers & Evaluators

The **BIS-SATHI** project has an impressive, beautifully designed frontend user interface with full responsive layouts, micro-animations, Indic multi-language translation, and comprehensive UI coverage across Standards, QCOs, Laboratories, Compliance Tracking, and Comparisons.

However, behind the polished UI, the system is **almost entirely decoupled from the backend and AI microservice**:
- The frontend operates almost exclusively against **in-memory mock JSON files** (containing a total of 28 records) and browser `localStorage`.
- The Node.js primary server cannot boot or run on Linux/Docker due to a fatal CommonJS vs ES Module import collision in all 12 controllers (`require("../utils/ApiResponse")`).
- The AI microservice has **no web server** (FastAPI is not implemented) and consists only of offline Python CLI scripts.
- The vector database is local **ChromaDB** in Python scripts, not managed Pinecone as described in the blueprint.

---

## 2. Key Metrics & Status Dashboard

| Metric | Current Reality | Target Specification |
| :--- | :--- | :--- |
| **Total Frontends** | 2 (`frontend-web`, `mobile-app`) | 2 |
| **Web Frontend Routes** | 24 client routes (All functional with mock data) | 24 |
| **Connected Frontend Services**| 0 of 11 domain services | 11 |
| **Total Seed Records** | 28 mock items (8 standards, 5 QCOs, 5 labs, 5 resources, 3 reports, 2 journeys) | 1,000+ BIS records |
| **Primary Server Routes** | 32 REST endpoints declared; 14 dead unmounted endpoints | 24 REST endpoints |
| **Primary Server Startup** | **Fails** (SyntaxError on `ApiResponse.js` + undefined `MONGODB_URI`) | Node Express Port 3000 |
| **AI Microservice Server** | **Missing** (Only offline Python CLI scripts in `RAG/`) | Private FastAPI Port 8001 |
| **RAG Retrieval Engine** | ChromaDB CLI script (no PDF documents in store) | Grounded RAG with exact citations |
| **Authentication Flow** | `localStorage` mock token (`mock-session-...`) | JWT Bearer Auth with refresh rotation |
| **Automated Test Suite** | 3 test files in backend (inoperable due to server boot failure) | Comprehensive API & E2E tests |

---

## 3. The "Looks Built vs Actually Working" Ledger

| What the User / Judge Sees in the UI | What Is Actually Happening Internally |
| :--- | :--- |
| User searches for any standard in Standards Explorer | JavaScript filters 8 records in `standards.json` with a 200ms `setTimeout` in the browser. |
| User signs up with email & password | Browser generates `mock-session-${Date.now()}` and saves to `localStorage`. Backend is never contacted. |
| User asks AI Sathi about toy testing or solar panels | Local regex matches keywords and displays a hardcoded card for *"Secondary lithium battery pack"* and standards `IS 16046 / IS 17387`. |
| User selects "Hindi" or "Marathi" in language dropdown | Client-side `i18next` translates UI labels from local JSON files. Dynamic AI translation is not active. |
| User adds standards to comparison and downloads CSV | Browser compares objects in `localStorage` and generates a CSV blob via `URL.createObjectURL()`. |
| User tracks compliance progress in Compliance Journey | Page renders 6 static stages reading from `complianceJourneys.json`. |

---

## 4. SIH Demo Reality Check: What Can Be Honestly Claimed?

### What CAN Be Confidently Demonstrated Today:
1. **Frontend Architecture & UX:** Polished design system, dark/light mode, mobile responsiveness, and client-side Indic translation across 12 scheduled Indian languages.
2. **Interactive UI Workflows:** Product discovery, standards exploration, QCO cataloging, laboratory search, entity comparison tray, and compliance journey visualization using sample mock data.
3. **Database Architecture:** Well-designed Mongoose schemas (User, Standard, QCO, Lab, Resource, Report, Compliance) and clean repository patterns in the primary server.
4. **Offline RAG Prototype:** Python scripts in `ai-microservice/RAG/` demonstrating vector chunking and LangChain + Gemini integration for terminal queries.

### What CANNOT Be Claimed (Will Fail if Tested):
1. **Do NOT claim that AI Sathi is live or connected to the web UI:** It renders static layout cards and does not connect to FastAPI.
2. **Do NOT claim that Pinecone is being used:** Code uses local ChromaDB.
3. **Do NOT claim complete BIS coverage:** The entire database contains 8 standards and 5 QCOs. Asking about unseeded standards (e.g. cement, gold, helmets) will return nothing.
4. **Do NOT attempt to demonstrate live backend APIs without applying Phase 0 fixes:** The primary server crashes on boot in its current state.
