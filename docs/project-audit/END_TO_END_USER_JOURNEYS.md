# BIS-SATHI — END-TO-END USER JOURNEYS TRACE

This document traces the 8 core user journeys through the application, pinpointing the **exact line of code where the real pipeline halts and mock behavior takes over**.

---

## Journey 1: User Signup, Login & Dashboard Access

1. **User Action:** User enters name, email, and password at `/signup` and clicks "Create Account".
2. **Frontend Component:** `Signup.tsx` calls `signUp(email, password, name, org)` from `authService.ts`.
3. **Execution Break Point (Line 31 of `authService.ts`):**
   ```typescript
   const session = { email: email.trim(), displayName: displayName.trim(), organization: organization.trim(), token: `mock-session-${Date.now()}` };
   localStorage.setItem(SESSION_KEY, JSON.stringify(session));
   localStorage.setItem('bis-sathi-auth-token', session.token);
   ```
4. **Where Reality Stops:**
   The browser immediately stores a mock token in `localStorage`. The backend endpoint `POST /api/v1/auth/register` is never called.
5. **Downstream Effect:**
   The user navigates to the dashboard as an ostensibly "logged in" user, but does not exist in MongoDB. Any authenticated backend call will fail with HTTP 401.

---

## Journey 2: AI Sathi Query & Grounded Answer

1. **User Action:** User navigates to `/ai-sathi`, selects "Hindi" or "English", types *"What are the mandatory testing requirements for electric vehicle chargers?"*, and clicks Submit.
2. **Frontend Component:** `AISathiWorkspace.tsx` triggers `handleResearch()`.
3. **Execution Break Point 1 (Line 106 of `AISathiWorkspace.tsx`):**
   Calls `chatService.ask({ message, sessionId: 'local-ai-sathi-session', ... })`.
   - In production config (no `VITE_API_BASE_URL`), it calls `mockChatService` which immediately echoes the user's string back.
   - If `VITE_API_BASE_URL` is provided, it calls `apiClient.post('/chat')`, which fails with HTTP 404 (wrong endpoint) or HTTP 503.
4. **Execution Break Point 2 (Line 114 of `AISathiWorkspace.tsx`):**
   ```typescript
   const intent = parseIntent(text);
   setQueryIntent(intent);
   ```
5. **Execution Break Point 3 (Line 154 of `AISathiWorkspace.tsx`):**
   `renderActiveWorkspace()` ignores the chat response and renders `<ApplicabilityAnalysis query={query} />`.
6. **Where Reality Stops:**
   `<ApplicabilityAnalysis />` renders hardcoded cards for *"Secondary lithium battery pack for EV applications"* and standards `IS 16046` and `IS 17387`. The answer is completely ungrounded and static.

---

## Journey 3: Search Standard → QCO Verification → Find Testing Lab

1. **User Action:** User searches *"IS 1293"* at `/standards`, views standard detail, clicks on associated QCO, and explores accredited labs.
2. **Frontend Flow:**
   - `StandardsExplorer.tsx` calls `standardService.search("IS 1293")`.
   - `standardService.ts:29` filters `standards.json` in browser memory and returns `IS-1293-2019`.
   - User clicks standard -> routes to `/standards/IS-1293-2019`.
   - `StandardDetail.tsx` displays technical details and lists `relatedQCOs: ["QCO-DPIIT-2022-Plugs"]`.
   - User clicks QCO link -> routes to `/qco/QCO-DPIIT-2022-Plugs`.
   - `QCODetail.tsx` queries `qcoService.getById()`, which searches `qco.json` in memory.
   - User clicks "Find Testing Labs" -> routes to `/laboratories?standard=IS-1293-2019`.
   - `LabFinder.tsx` queries `laboratoryService.search()`, which filters `labs.json` in memory.
3. **Where Reality Stops:**
   The entire journey functions smoothly in the browser UI, but **100% of data is served from local JSON files**. The Node/MongoDB backend is never contacted.

---

## Journey 4: Bookmark an Entity & Access Saved Items

1. **User Action:** User clicks the bookmark icon on standard `IS 1293:2019` and navigates to `/saved`.
2. **Frontend Component:** `StandardDetail.tsx` calls `saveItem()` from `useWorkspace()`.
3. **Execution Break Point (Line 88 of `WorkspaceContext.tsx`):**
   ```typescript
   setSavedItems(prev => [...prev, { ...item, savedAt: new Date().toISOString() }]);
   ```
4. **Where Reality Stops:**
   `WorkspaceContext` syncs state to `localStorage.getItem('bis-sathi-saved-items')`. The Node backend endpoint `POST /api/v1/saved` and the `SavedItem` Mongoose collection are never touched.

---

## Journey 5: Side-by-Side Comparison of Standards

1. **User Action:** User adds `IS 1293:2019` and `IS 17017:2018` to comparison and opens `/compare`.
2. **Frontend Component:** `ComparisonWorkspace.tsx` reads `comparisonItems` from `useWorkspace()`.
3. **Execution Break Point:**
   - Table attributes are derived directly from the JavaScript objects stored in `localStorage`.
   - User clicks "Export CSV": `ComparisonWorkspace.tsx:28-40` constructs a CSV blob in browser memory and triggers an anchor tag download.
4. **Where Reality Stops:**
   The backend route `POST /api/v1/comparison` is never called.

---

## Journey 6: Track Product Compliance Journey

1. **User Action:** User navigates to `/workspace` and clicks on active journey *"Smart Wi-Fi Plug 16A"*.
2. **Frontend Component:** `ComplianceJourneyDetail.tsx` renders route `/workspace/CJ-2025-001`.
3. **Execution Break Point (Line 21 of `ComplianceJourneyDetail.tsx`):**
   ```typescript
   const journey = (mockJourneys as ComplianceJourney[]).find(j => j.id === id);
   ```
4. **Where Reality Stops:**
   Data is loaded directly from `@/data/compliance/complianceJourneys.json`. Backend route `GET /api/v1/compliance/journeys/CJ-2025-001` is never called.

---

## Journey 7: Access Research Reports

1. **User Action:** User navigates to `/reports` and opens *"Electric Vehicle Charging Infrastructure Assessment"*.
2. **Frontend Component:** `ReportsList.tsx` calls `reportService.getAll()`.
3. **Execution Break Point (Line 15 of `reportService.ts`):**
   Resolves `reportsData` from `@/data/reports/reports.json`.
4. **Where Reality Stops:**
   Backend route `GET /api/v1/reports` is never called.

---

## Journey 8: Admin Management of Standards

1. **Expected Action:** Admin logs in with `ADMIN` role, navigates to `/admin/standards`, and creates a new standard.
2. **Execution Break Point:**
   - In `frontend-web/src/app/App.tsx`, **no admin routes exist**.
   - There are no admin pages, views, or forms anywhere in the frontend.
3. **Where Reality Stops:**
   While `primary-server/src/routes/admin.routes.js` defines `POST /api/v1/admin/standards` and `PUT /api/v1/admin/standards/:id`, there is **no UI implementation** to access them.
