# BIS-SATHI Complete Frontend and Future Backend Blueprint

[CURRENT] -> abhi frontend me ye kaam kar raha hai
[BACKEND REQUIRED] -> backend banana zaroori hai isliye
[PROPOSED] -> suggestion hai, final nahi
[FUTURE] -> baad me hoga

## 1. FRONTEND STATUS vs BACKEND STATUS
- **Abhi kya kaam kar raha hai (mock JSON se):** [CURRENT] Frontend abhi Vite + React 19 SPA architecture par based hai. Data `src/data` me hardcoded JSON files (`standards.json`, `qco.json`, etc.) se fetch ho raha hai aur Lingva proxy se mock translation ho rahi hai. Auth mock (localStorage) par chal raha hai.
- **Backend banne ke baad kya badlega:** [BACKEND REQUIRED] `src/data` ke saare JSONs delete ho jayenge. Saari services API calls (Node/Express) karengi. AI Sathi actual FastAPI (RAG) backend se grounded response laayega. JWT token se asli auth maintain hoga.

## 2. SYSTEM ARCHITECTURE DIAGRAM
[PROPOSED] Architecture Flow:
React Frontend -> Node/Express Gateway -> MongoDB + FastAPI (AI/RAG) -> Pinecone (vector search) -> LLM

- **React Frontend:** User interface, form handling, aur global state (React Context/Zustand). Backend Gateway APIs ko call karega.
- **Node/Express Gateway:** Main entry point. User session, JWT auth, rate limiting handle karega. CRUD requests ko MongoDB me bhejege aur AI queries ko FastAPI me proxy karega.
- **MongoDB:** Structured data (Users, Saved Sessions, Standards details, QCOs) ko persist karega.
- **FastAPI (AI/RAG):** AI orchestration. User query aane par usko clean karega, embedding model se encode karega, aur Pinecone search trigger karega.
- **Pinecone (vector search):** BIS documents ke chunked embeddings store karega aur semantic query par nearest matching evidence clauses return karega.
- **LLM:** Pinecone se aayi evidence ko context banakar, user ke intent ke hisaab se final grounded answer generate karega (without hallucinating).

## 3. HAR FOLDER KA DETAILED EXPLANATION

- **src/app:** 
  - Iska kaam: Core app wrapper, router initialization, global contexts.
  - Yahan kya honi chahiye: Main Providers, App routing.
  - Important files: `App.tsx`.
  - Feature: Core.
  - Backend connection: [FUTURE] JWT auto-login yahan mount hoga.
- **src/assets:**
  - Iska kaam: Static images and SVG logos.
  - Backend connection: Nahi.
- **src/components:**
  - Iska kaam: Reusable global UI (Cards, Buttons, Layouts).
  - Backend connection: Nahi, sirf data consume karenge.
- **src/context:**
  - Iska kaam: State management.
  - Important files: `WorkspaceContext.tsx`, `LanguageContext.tsx`.
  - Backend connection: [BACKEND REQUIRED] AuthContext backend JWT store/manage karega.
- **src/core:**
  - Iska kaam: Configs like apiConfig.
  - Backend connection: Base URL backend gateway ki config me point hoga.
- **src/data:**
  - Iska kaam: Mock JSON datasets.
  - Backend connection: [FUTURE] Ye folder puri tarah delete ho jayega. API calls se replace hoga.
- **src/design-system:**
  - Iska kaam: Tailwind theme/tokens.
  - Backend connection: Nahi.
- **src/features:**
  - Iska kaam: Domain-driven modules (ai-sathi, auth, standards, etc.).
  - Backend connection: Har feature ki `services/` seedhe REST API hit karegi.
- **src/hooks:**
  - Iska kaam: Global logic (useLanguage).
  - Backend connection: `useFetch`, `useAuth` jaise hooks yahan add honge backend calls ke liye.
- **src/locales:**
  - Iska kaam: Static i18n JSONs.
  - Backend connection: Dynamic content backend se translate hoke aayega.
- **src/pages:**
  - Iska kaam: Route views.
  - Backend connection: Data loading backend se trigger hoga.
- **src/services:**
  - Iska kaam: Shared service clients (`apiClient.ts`, `translationApi.ts`).
  - Backend connection: Axios interceptors yahan lagenge.
- **src/types:**
  - Iska kaam: Typescript interfaces.
  - Backend connection: MongoDB schemas ke saath exact sync me rakhe jayenge.
- **src/utils:**
  - Iska kaam: Formatting, helpers.

## 4. COMPONENTS TABLE
| Component | Naam | Kaam | Kaun Use Karta Hai | Backend Chahiye? |
|-----------|------|------|---------------------|------------------|
| Global | `Header.tsx` | Main navigation | App Layout | Haan (Auth API) |
| Global | `SearchOverlay.tsx` | Global search overlay | Header | Haan (Search API) |
| Feature | `EvidenceBadge.tsx` | AI citation verification dikhana | AISathiWorkspace | Nahi |
| Feature | `LoginForm.tsx` | Auth forms | `Login.tsx` | Haan |

## 5. CONTEXT (React Context) TABLE
| Context Naam | Kaam | State | Kaun Consume Karta Hai | Persist Hota Hai? | Backend Dependency |
|--------------|------|-------|------------------------|-------------------|--------------------|
| `LanguageContext` | Global language state | `language` | UI text | LocalStorage me | Nahi |
| `ThemeContext` | Dark/Light mode | `theme` | App wrapper | LocalStorage me | Nahi |
| `WorkspaceContext`| Saved items aur comparison list | `savedItems`, `comparisonList` | Profile, Standards, Comparison | LocalStorage me | Haan (DB me save hoga) |

## 6. src/core/ — CONFIG & ENV
[CURRENT] `apiConfig.ts` me constants defined hain.
YE ZARUR LIKHNA: MongoDB password, JWT secret, Pinecone key, LLM key kabhi bhi `VITE_*` frontend env variable me MAT dalna — ye sirf backend server ki `.env` file me hi rakhna chahiye. Frontend par inka expose hona critical security vulnerability hai.

## 7. src/data/ — SABSE DETAILED SECTION

### 7.1 src/data/standards/standards.json
- **File ka naam:** `standards.json`
- **Iska kaam / purpose:** BIS standards ka catalog mock karna.
- **Schema:** `id` (string), `code` (string), `title` (string), `division` (string), `clauses` (Array of objects).
- **Example object:** `{ "id": "IS-1293-2019", "code": "IS 1293:2019", "title": "Plugs and Socket-Outlets..." }`
- **Kaunsi service use karti hai:** `standardService.ts`
- **Future me MongoDB collection:** `standards`
- **Future me API:** `GET /api/v1/standards`
- **Migration status:** Abhi JSON, future me API.

### 7.2 src/data/qco/qco.json
- **File ka naam:** `qco.json`
- **Iska kaam / purpose:** Quality Control Orders ki list.
- **Schema:** `id` (string), `code` (string), `coveredStandards` (Array), `effectiveDate` (string).
- **Example object:** `{ "id": "QCO-DPIIT-2022-Plugs", "code": "QCO-DPIIT-2022-01", "coveredStandards": ["IS-1293-2019"] }`
- **Kaunsi service use karti hai:** `qcoService.ts`
- **Future me MongoDB collection:** `qcos`
- **Future me API:** `GET /api/v1/qcos`
- **Migration status:** Abhi JSON, future API.

### 7.3 src/data/laboratories/labs.json
- **File ka naam:** `labs.json`
- **Iska kaam / purpose:** NABL accredited testing labs mock karna.
- **Schema:** `id`, `accreditationNumber`, `name`, `testingScopes`, `state`.
- **Example object:** `{ "id": "NABL-TC-8801", "name": "National Centre for Electrotechnical Testing", "standardsCovered": ["IS-1293-2019"] }`
- **Kaunsi service use karti hai:** `laboratoryService.ts`
- **Future me MongoDB collection:** `laboratories`
- **Future me API:** `GET /api/v1/labs`
- **Migration status:** Abhi JSON, future API.

### 7.4 src/data/reports/reports.json
- **File ka naam:** `reports.json`
- **Iska kaam / purpose:** Compliance reports ka mock.
- **Schema:** `id`, `name`, `date`, `status`, `sections` (array).
- **Kaunsi service use karti hai:** `reportService.ts`
- **Future me MongoDB collection:** `reports`
- **Future me API:** `GET /api/v1/reports`
- **Migration status:** Abhi JSON, future API.

### 7.5 src/data/compliance/complianceJourneys.json
- **File ka naam:** `complianceJourneys.json`
- **Iska kaam / purpose:** Compliance workflow steps track karna.
- **Schema:** `id`, `productName`, `currentStage`, `steps` (array).
- **Kaunsi service use karti hai:** frontend mocked states.
- **Future me MongoDB collection:** `complianceJourneys`
- **Future me API:** `GET /api/v1/compliance/journeys`
- **Migration status:** Abhi JSON, future API.

### 7.6 src/data/resources/resources.json
- **File ka naam:** `resources.json`
- **Iska kaam / purpose:** Educational resources.
- **Schema:** `id`, `title`, `type`, `url`.
- **Future me MongoDB collection:** `resources`
- **Future me API:** `GET /api/v1/resources`
- **Migration status:** Abhi JSON, future API.

## 8. src/hooks/ — HOOKS TABLE
| Hook Naam | Kaam | Kaun Use Karta Hai | Backend Dependency |
|-----------|------|--------------------|--------------------|
| `useLanguage` | Global i18n switcher | All UI texts | Nahi |
| `useTranslation` (`useT`) | Fallback resolver | Component labels | Nahi |
| `useLingvaBatch` | Runtime translations | AI Sathi | Lingva/Backend Gateway |

## 9. LOCALES / MULTILINGUAL
- **Saari supported languages:** en, hi, mr, bn, ta, te, kn, gu, ml, pa, or, as.
- **Static UI translation:** `react-i18next` aur `locales/` folder me JSON files se hota hai (e.g. `common.json`). 
- **Dynamic AI response translation:** API se text aane ke baad `Lingva` (ya future backend translation service) run-time me convert karti hai.
- **Caching & persistence:** `LanguageContext` user selection ko `localStorage` me rakhti hai. `useLingvaBatch` in-memory map use karti hai.

## 10. PAGES <-> FEATURES MAPPING TABLE
| Route | Page | Feature | Purpose | Backend API |
|-------|------|---------|---------|-------------|
| `/` | `Homepage.tsx` | home | Landing page | - |
| `/login` | `Login.tsx` | auth | Authenticate user | `POST /api/v1/auth/login` |
| `/ai-sathi` | `AISathiWorkspace.tsx` | ai-sathi | RAG research chat | `POST /api/v1/chat` |
| `/standards` | `StandardsExplorer.tsx` | standards | Browse standards | `GET /api/v1/standards` |
| `/standards/:id` | `StandardDetail.tsx`| standards | Specific standard | `GET /api/v1/standards/:id` |
| `/qco` | `QCOExplorer.tsx` | qco | Quality control orders| `GET /api/v1/qcos` |
| `/qco/:id` | `QCODetail.tsx` | qco | Quality control order | `GET /api/v1/qcos/:id` |
| `/laboratories` | `LabFinder.tsx` | laboratories | Find testing labs | `GET /api/v1/labs` |
| `/laboratories/:id` | `LabDetail.tsx` | laboratories | Lab Details | `GET /api/v1/labs/:id` |
| `/reports` | `ReportsList.tsx` | reports | View saved reports | `GET /api/v1/reports` |
| `/reports/:id` | `ReportPreview.tsx` | reports | View single report | `GET /api/v1/reports/:id` |
| `/compliance` | `ComplianceWorkspace.tsx`| compliance | Compliance flows | `GET /api/v1/compliance/journeys` |
| `/resources` | `ResourcesLibrary.tsx` | resources | Resource library | `GET /api/v1/resources` |
| `/resources/:id`| `ResourceDetail.tsx` | resources | Resource Details | `GET /api/v1/resources/:id` |
| `/comparison` | `ComparisonPage.tsx` | comparison | Compare items | `POST /api/v1/comparison` |
| `/profile` | `Profile.tsx` | auth | View profile | `GET /api/v1/auth/me` |
| `/profile/saved`| `SavedItems.tsx` | auth | Saved workspaces | `GET /api/v1/saved` |
| `/research` | `ResearchHistory.tsx`| ai-sathi | History | `GET /api/v1/sessions` |

## 11. SERVICE LAYER
[CURRENT] Page -> Feature Service -> JSON Import -> Page
[FUTURE] Page -> Feature Service -> `apiClient.ts` -> Backend Node API

## 12. MASTER FEATURE TABLE
| Feature | Pages | Components | Hooks | Service | Data | Backend Module | APIs |
|---------|-------|------------|-------|---------|------|----------------|------|
| `ai-sathi` | `AISathiWorkspace.tsx`, `ResearchHistory.tsx` | Chat, EvidenceDrawer | useChat | `chatService` | None | FastAPI | `/chat`, `/sessions` |
| `auth` | `Login.tsx`, `Signup.tsx`, `Profile.tsx` | LoginForm | - | - | None | Node/Auth | `/auth/*` |
| `standards` | `StandardsExplorer.tsx`, `StandardDetail.tsx` | StandardCard | - | `standardService` | `standards.json` | Node/Standards | `/standards` |
| `qco` | `QCOExplorer.tsx`, `QCODetail.tsx` | - | useQCOs | `qcoService` | `qco.json` | Node/QCO | `/qcos` |
| `laboratories`| `LabFinder.tsx`, `LabDetail.tsx` | - | - | `laboratoryService`| `labs.json` | Node/Labs | `/labs` |
| `reports` | `ReportsList.tsx`, `ReportPreview.tsx` | - | - | `reportService` | `reports.json` | Node/Reports | `/reports` |
| `resources` | `ResourcesLibrary.tsx`, `ResourceDetail.tsx` | - | - | `resourceService` | `resources.json` | Node/Resources | `/resources` |
| `compliance`| `ComplianceWorkspace.tsx` | - | - | - | `complianceJourneys`| Node/Compliance| `/compliance/journeys` |
| `comparison`| `ComparisonPage.tsx` | - | - | - | None | Node/Comparison | `/comparison` |
| `evidence` | None (Used in AI Sathi)| `EvidenceBadge.tsx` | - | - | None | FastAPI/Node | No dedicated API — delivered via /chat response citations array |

## 13. HAR FEATURE KA DEEP-DIVE

### 13.1 AI-SATHI Feature
- **Purpose:** Provide RAG-based AI interactions for standards research.
- **Pages:** `AISathiWorkspace.tsx`, `ResearchHistory.tsx`
- **Components:** Chat UI, Quick actions.
- **Hooks:** `useChat.ts`
- **Services:** `chatService.ts`
- **Types:** `ChatRequest`, `ChatResponse`
- **JSON data:** Mocks inside service.
- **Current workflow:** User chats -> service returns mock text.
- **FUTURE BACKEND:**
  * Method + URL: `POST /api/v1/chat`
  * Exact Request JSON: `{ "sessionId": "s123", "message": "hello", "language": "en" }`
  * Exact Response JSON: `{ "success": true, "data": { "intent": "general", "answer": "hi", "citations": [] } }`

### 13.2 AUTH Feature
- **Purpose:** User authentication & profile management.
- **Pages:** `Login.tsx`, `Signup.tsx`, `Profile.tsx`
- **Components:** `LoginForm.tsx`
- **Hooks:** none specific
- **Services:** none specific
- **Types:** `User`
- **JSON data:** LocalStorage mock.
- **Current workflow:** Form submit -> LocalStorage save -> Redirect.
- **FUTURE BACKEND:**
  * Method + URL: `POST /api/v1/auth/login`
  * Exact Request JSON: `{ "email": "x@y.com", "password": "pass" }`
  * Exact Response JSON: `{ "success": true, "data": { "token": "jwt..." } }`

### 13.3 STANDARDS Feature
- **Purpose:** Search and explore BIS standards.
- **Pages:** `StandardsExplorer.tsx`, `StandardDetail.tsx`
- **Components:** `StandardCard.tsx`
- **Hooks:** `useStandards.ts`
- **Services:** `standardService.ts`
- **Types:** `Standard`
- **JSON data:** `standards.json`
- **Current workflow:** User lists standards, filters them, views detail.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/standards`
  * Query parameters: `search`, `filter`, `sort`, `pagination`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [{ "id": "...", "title": "..." }] }`
  * Exact Error JSON: `{ "success": false, "error": { "code": "NOT_FOUND" } }`

### 13.4 QCO Feature
- **Purpose:** Discover Quality Control Orders.
- **Pages:** `QCOExplorer.tsx`, `QCODetail.tsx`
- **Components:** None
- **Hooks:** `useQCOs.ts`
- **Services:** `qcoService.ts`
- **Types:** `QCO`
- **JSON data:** `qco.json`
- **Current workflow:** User filters QCOs by standard or product.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/qcos`
  * Query parameters: `standardId`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [] }`

### 13.5 LABORATORIES Feature
- **Purpose:** Find NABL accredited test labs.
- **Pages:** `LabFinder.tsx`, `LabDetail.tsx`
- **Components:** None
- **Hooks:** None
- **Services:** `laboratoryService.ts`
- **Types:** `Laboratory`
- **JSON data:** `labs.json`
- **Current workflow:** User searches by location/standard.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/labs`
  * Query parameters: `location`, `standardId`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [] }`

### 13.6 REPORTS Feature
- **Purpose:** Download auto-generated compliance documents.
- **Pages:** `ReportsList.tsx`, `ReportPreview.tsx`
- **Components:** None
- **Hooks:** None
- **Services:** `reportService.ts`
- **Types:** `Report`
- **JSON data:** `reports.json`
- **Current workflow:** User views past generated PDF reports.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/reports`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [] }`

### 13.7 RESOURCES Feature
- **Purpose:** Reading materials, glossaries.
- **Pages:** `ResourcesLibrary.tsx`, `ResourceDetail.tsx`
- **Components:** None
- **Hooks:** None
- **Services:** `resourceService.ts`
- **Types:** `Resource`
- **JSON data:** `resources.json`
- **Current workflow:** User browses articles.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/resources`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [] }`

### 13.8 COMPLIANCE Feature
- **Purpose:** Track multi-step compliance journeys.
- **Pages:** `ComplianceWorkspace.tsx`
- **Components:** None
- **Hooks:** None
- **Services:** None directly (mocked in component).
- **Types:** `ComplianceJourney`
- **JSON data:** `complianceJourneys.json`
- **Current workflow:** User views visual steps for a product.
- **FUTURE BACKEND:**
  * Method + URL: `GET /api/v1/compliance/journeys`
  * Exact Request JSON: N/A
  * Exact Response JSON: `{ "success": true, "data": [] }`

### 13.9 COMPARISON Feature
- **Purpose:** Side-by-side comparison of Standards or Lab capacities.
- **Pages:** `ComparisonPage.tsx`
- **Components:** None
- **Hooks:** None
- **Services:** None (uses workspace context).
- **Types:** None specific
- **JSON data:** None specific.
- **Current workflow:** User clicks "Add to compare", views table.
- **FUTURE BACKEND:**
  * Method + URL: `POST /api/v1/comparison`
  * Request JSON: `{ "entityType": "standard", "entityIds": ["id1", "id2"] }`
  * Exact Response JSON: `{ "success": true, "data": { "differences": [] } }`

### 13.10 EVIDENCE Feature
- **Purpose:** Extract and format citations for AI Sathi answers.
- **Pages:** None (Embedded in AI Sathi).
- **Components:** `EvidenceBadge.tsx`
- **Hooks:** None
- **Services:** None
- **Types:** `Evidence`
- **JSON data:** Generated by RAG.
- **Current workflow:** Shows a badge when a citation is linked.
- **FUTURE BACKEND:**
  * No dedicated API — delivered via /chat response citations array.

## 14. AUTH FEATURE (Login/Signup/Logout/Profile)
- **Abhi kaise kaam karta hai:** Mock local state (localStorage).
- **Future APIs:**
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
- **API detail:**
  - Login Request: `{ "email": "a@b.com", "password": "xxx" }`
  - Success Response: `{ "success": true, "data": { "token": "jwt...", "user": {} } }`
- **MongoDB User model:** `_id`, `name`, `email`, `passwordHash`, `role`, `preferredLanguage`, `createdAt`, `updatedAt`
- Password kabhi plain text me store nahi hoga — hamesha hash hoga.

## 15. SESSIONS / HISTORY / SAVED RESEARCH
[FUTURE] Frontend ko apni past AI research resume karne ke liye ye APIs chahiye:
- `POST /api/v1/sessions`
- `GET /api/v1/sessions`
- `GET /api/v1/sessions/:id`
- `GET /api/v1/sessions/:id/messages`

## 16. AI SATHI — SABSE IMPORTANT SECTION
- **Abhi ka flow:** `AISathiWorkspace` -> `chatService` -> Mock JSON timeout response.
- **Future ka flow:** `AISathiWorkspace` -> `chatService` -> `apiClient` -> Node -> FastAPI -> Intent detect -> RAG (Pinecone) -> Evidence -> LLM -> Node -> Frontend.
- **Har step ko simple bhasha me samjhao:** User type karta hai "QCO for Toys". Node ise FastAPI ko deta hai. FastAPI Pinecone vector DB me "Toys QCO" search karta hai, nearest document nikalta hai. LLM us document ko padhkar ek grounded answer banata hai aur frontend ko citation ke sath wapas bhejta hai.
- **Query types:** general knowledge, standard research, product applicability, testing, lab search, compliance.
- **EXACT Contract (`POST /api/v1/chat`):**
  - **Request JSON:** `{ "sessionId": "s123", "message": "hello", "language": "en", "context": { "standardId": "IS-1293-2019" } }`
  - **Response JSON:** `{ "requestId": "r-123", "status": "success", "intent": "standard_research", "answer": "...", "citations": [], "context": {} }`
- **Status values:** `success`, `insufficient_evidence`, `error`, `processing`. Agar RAG ko proper evidence nahi milta to AI kabhi bhi fake answer nahi dega — "insufficient_evidence" bhejega.
- **Context maintainance:** Frontend `sessionId` pass karta hai taaki backend past messages fetch kar sake.

## 17. EVIDENCE aur CITATION FORMAT
**Citation JSON example:**
```json
{
  "id": "c123",
  "title": "IS 1293:2019",
  "sourceType": "standard",
  "documentId": "IS-1293-2019",
  "standardNumber": "IS 1293:2019",
  "section": "General requirements",
  "page": 1,
  "url": "https://bis.gov.in/...",
  "verified": true
}
```

## 18. RAG ARCHITECTURE
BIS Document -> Extraction -> Cleaning -> Chunking -> Metadata tagging -> Embedding -> Pinecone Store -> Retriever -> Context generation -> LLM -> Grounded Answer -> Citation.

## 19. PINECONE METADATA FORMAT
Vector ID, embedding, aur metadata fields:
`documentId`, `documentType`, `standardNumber`, `qcoId`, `productId`, `section`, `clause`, `page`, `language`, `sourceUrl`.

## 20. COMPLIANCE / REPORTS / COMPARISON / RESOURCES / NOTIFICATIONS / PROFILE-SETTINGS / SAVED-HISTORY / FEEDBACK
Ye saare modules abhi frontend-only mocked hain. Future me inn sabko MongoDB backed APIs chahiye hongi. 

## 21. COMPLETE API MASTER TABLE
| # | Method | Endpoint | Feature | Purpose | Auth chahiye? | Request JSON | Response JSON | MongoDB Collection | AI use hoga? |
|---|--------|----------|---------|---------|---------------|--------------|---------------|--------------------|--------------|
| 1 | POST | `/api/v1/auth/login` | auth | Login | Nahi | `{email, pw}` | `{token, user}` | `users` | Nahi |
| 2 | POST | `/api/v1/auth/register` | auth | Register | Nahi | `{...}` | `{token, user}` | `users` | Nahi |
| 3 | POST | `/api/v1/auth/logout` | auth | Logout | Haan | `{}` | `{}` | `users` | Nahi |
| 4 | GET | `/api/v1/auth/me` | auth | Get profile | Haan | N/A | `{user}` | `users` | Nahi |
| 5 | POST | `/api/v1/chat` | ai-sathi | AI Q&A | Haan | `{message, ...}` | `{answer, ...}` | `messages` | Haan |
| 6 | POST | `/api/v1/sessions` | ai-sathi | Create session| Haan | `{title}` | `{session}` | `sessions` | Nahi |
| 7 | GET | `/api/v1/sessions` | ai-sathi | Chat history | Haan | N/A | `{data:[]}` | `sessions` | Nahi |
| 8 | GET | `/api/v1/sessions/:id` | ai-sathi | Session Detail| Haan | N/A | `{session}` | `sessions` | Nahi |
| 9 | GET | `/api/v1/sessions/:id/messages`| ai-sathi| Messages | Haan | N/A | `{messages:[]}`| `messages` | Nahi |
| 10| GET | `/api/v1/standards` | standards | List | Nahi | N/A | `{data:[]}` | `standards` | Nahi |
| 11| GET | `/api/v1/standards/:id`| standards | Detail | Nahi | N/A | `{data:{}}` | `standards` | Nahi |
| 12| GET | `/api/v1/qcos` | qco | List QCOs | Nahi | N/A | `{data:[]}` | `qcos` | Nahi |
| 13| GET | `/api/v1/qcos/:id` | qco | Detail | Nahi | N/A | `{data:{}}` | `qcos` | Nahi |
| 14| GET | `/api/v1/labs` | laboratories | Find Labs | Nahi | N/A | `{data:[]}` | `laboratories` | Nahi |
| 15| GET | `/api/v1/labs/:id` | laboratories | Detail | Nahi | N/A | `{data:{}}` | `laboratories` | Nahi |
| 16| GET | `/api/v1/reports` | reports | List | Haan | N/A | `{data:[]}` | `reports` | Nahi |
| 17| GET | `/api/v1/reports/:id` | reports | Detail | Haan | N/A | `{data:{}}` | `reports` | Nahi |
| 18| GET | `/api/v1/resources` | resources | List | Nahi | N/A | `{data:[]}` | `resources` | Nahi |
| 19| GET | `/api/v1/resources/:id`| resources | Detail | Nahi | N/A | `{data:{}}` | `resources` | Nahi |
| 20| GET | `/api/v1/compliance/journeys`| compliance | List | Haan | N/A | `{data:[]}` | `complianceJourneys`| Nahi |
| 21| POST | `/api/v1/comparison` | comparison | Fetch diffs | Nahi | `{ids:[]}` | `{data:{}}` | - | Nahi |
| 22| GET | `/api/v1/saved` | auth/workspace| List saved | Haan | N/A | `{data:[]}` | `users` (subdoc)| Nahi |
| 23| POST | `/api/v1/saved` | auth/workspace| Save item | Haan | `{itemId}` | `{success}` | `users` (subdoc)| Nahi |
| 24| DELETE | `/api/v1/saved/:id` | auth/workspace| Remove item | Haan | N/A | `{success}` | `users` (subdoc)| Nahi |

## 22. HAR POST/PUT/PATCH API KE LIYE FULL DETAIL
- **Endpoint:** `/api/v1/auth/login`
- **Headers:** Content-Type: application/json
- **Request Body:** `{ "email": "user@test.com", "password": "123" }`
- **Explanation:** email (required, string), password (required, string).
- **Validation:** valid email format.

## 23. HAR API KE LIYE RESPONSE DETAIL
- **Success JSON:** `{ "success": true, "data": { "token": "xxx" } }`
- **Empty result JSON:** `{ "success": true, "data": [] }`
- **Error JSON:** `{ "success": false, "error": { "code": "AUTH_FAILED" } }`
- **HTTP status codes:** 200, 400, 401, 404, 500.

## 24. STANDARD API RESPONSE FORMAT
**Success:**
```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "total": 1 },
  "error": null
}
```
**Error:**
```json
{
  "success": false,
  "data": null,
  "error": { "code": "RESOURCE_NOT_FOUND", "message": "Not found" }
}
```

## 25. MONGODB DATABASE DESIGN
| Collection | Purpose | Main Fields | Relations | Indexes |
|------------|---------|-------------|-----------|---------|
| `users` | Auth | `email, passwordHash, role, savedItems` | - | email (unique) |
| `standards` | BIS DB | `code, title, clauses` | QCOs | code |
| `qcos` | QCO list | `code, effectiveDate` | Standards | code |
| `laboratories` | NABL Labs | `name, testingScopes` | Standards | state |
| `reports` | PDF data | `name, status` | User | date |
| `sessions` | Chat Sessions| `userId, title` | User, Messages| userId |
| `messages` | Chat history | `sessionId, role, text` | Sessions | sessionId |

## 26. DATA OWNERSHIP MATRIX
| Data | Frontend | Node | FastAPI | MongoDB | Pinecone |
|------|----------|------|---------|---------|----------|
| Standards | Cache | Router | - | Primary | Embeddings |
| Vectors | - | - | Search | - | Primary |

## 27. FRONTEND -> BACKEND FILE MAPPING
| Frontend Service File | Abhi Data Source | Future API | Backend Module | DB Collection |
|-----------------------|------------------|------------|----------------|---------------|
| `standardService.ts` | `standards.json` | `/api/v1/standards` | Node/Standards | `standards` |

## 28. MOCK JSON -> API MIGRATION STEPS
ABHI: Page -> `standardService.ts` -> `standards.json`
BAAD ME: Page -> `standardService.ts` -> `apiClient` -> Node API -> MongoDB -> Response -> Page

## 29. SECURITY
Password hashing (bcrypt), JWT authentication, proper CORS limits, input validation (Zod/Joi), MongoDB injection se bachav, AI prompt injection safety, rate limiting.

## 30. AI SAFETY RULES
- Kabhi bhi fake BIS standard, QCO, ya evidence nahi banayega.
- Har answer ke sath source/evidence hona chahiye.
- Agar evidence nahi milta to "insufficient_evidence" bhejega, jhooth nahi bolega.

## 31. BACKEND FOLDER STRUCTURE (proposal)
Node backend: `backend/src/config, routes, controllers, services, models, middleware, validators`
FastAPI AI service: `ai-service/app/api, services, rag, embeddings, prompts, models, retrieval`

## 32. IMPLEMENTATION ROADMAP (PHASES)
Phase 0: Frontend freeze + contract review
Phase 1: Node/Express basic setup
Phase 2: Environment config
Phase 3: MongoDB connect karna
Phase 4: Database models banana
Phase 5: Purani JSON data ko seed karna
Phase 6: API client + core APIs
Phase 7: Authentication
Phase 8: Sessions/history/saved data
Phase 9: Standards/QCO/Labs/Products APIs
Phase 10: Certification/Hallmarking/Consumer/Resources APIs
Phase 11: Compliance + Evidence + Reports
Phase 12: FastAPI setup
Phase 13: Document ingestion pipeline
Phase 14: Embeddings banana
Phase 15: Pinecone connect karna
Phase 16: RAG retrieval
Phase 17: LLM integration
Phase 18: POST /api/v1/chat API
Phase 19: AI Sathi ko frontend se connect karna
Phase 20: Production translation service
Phase 21: Security hardening
Phase 22: Testing (E2E)
Phase 23: Deployment

## 33. GAP ANALYSIS
- **CURRENTLY IMPLEMENTED:** Mock JSON UI flows, Lingva proxy translations, layout mapping.
- **BACKEND REQUIRED:** Express Gateway, FastAPI RAG server, MongoDB, Auth, Pinecone index.
- **NOT YET DEFINED:** Production container specs, external integration APIs (actual BIS live servers).
- **FUTURE ENHANCEMENT:** WebSockets for live chat streaming.

============================================================
