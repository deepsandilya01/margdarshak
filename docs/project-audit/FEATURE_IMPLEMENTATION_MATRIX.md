# BIS-SATHI — FEATURE IMPLEMENTATION MATRIX

This matrix tracks all 20 major functional areas of BIS-SATHI across UI, Backend, Database, AI, and Integration layers.

---

## Master Feature Verification Matrix

| # | Feature Area | UI Implementation | Backend API | Database Model | AI Subsystem | Real Data | Connectivity Status | Operational Reality |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Authentication** | `Login.tsx`, `Signup.tsx` | `/api/v1/auth/*` | `User` (Mongoose) | None | N/A | **MOCKED** | UI uses fake localStorage session; never invokes Node auth endpoints. |
| 2 | **User Profile** | `ProfilePage.tsx` | `/api/v1/auth/me` | `User` | None | N/A | **MOCKED** | Reads username from localStorage; profile editing does not hit DB. |
| 3 | **AI Sathi Assistant**| `AISathiWorkspace.tsx` | `/api/v1/chat` | `Message`, `Session` | ChromaDB / Gemini CLI | None | **MOCKED / BROKEN** | UI uses regex heuristic to switch between hardcoded layout cards. Backend fails on closed FastAPI port. |
| 4 | **Chat History** | Left drawer in AI Sathi | `/api/v1/sessions` | `Session`, `Message` | None | N/A | **MOCKED** | UI renders 3 hardcoded static buttons in history drawer. |
| 5 | **Standards Explorer**| `StandardsExplorer.tsx` | `/api/v1/standards` | `Standard` | None | 8 Mock Records | **MOCKED** | `standardService.ts` reads `standards.json` directly with `setTimeout`. |
| 6 | **Standard Detail** | `StandardDetail.tsx` | `/api/v1/standards/:id` | `Standard` | None | 8 Mock Records | **MOCKED** | Finds standard in memory by route parameter `:id`. |
| 7 | **QCO Explorer** | `QCOExplorer.tsx` | `/api/v1/qcos` | `QCO` | None | 5 Mock Records | **MOCKED** | `qcoService.ts` reads `qco.json` directly. |
| 8 | **QCO Detail** | `QCODetail.tsx` | `/api/v1/qcos/:id` | `QCO` | None | 5 Mock Records | **MOCKED** | Finds QCO in memory by route parameter `:id`. |
| 9 | **Laboratory Finder** | `LabFinder.tsx` | `/api/v1/labs` | `Laboratory` | None | 5 Mock Records | **MOCKED** | `laboratoryService.ts` reads `labs.json` directly; client filters city. |
| 10| **Laboratory Detail** | `LabDetail.tsx` | `/api/v1/labs/:id` | `Laboratory` | None | 5 Mock Records | **MOCKED** | Finds Lab in memory by route parameter `:id`. |
| 11| **Resources Library** | `ResourcesLibrary.tsx` | `/api/v1/resources` | `Resource` | None | 5 Mock Records | **MOCKED** | `resourceService.ts` reads `resources.json` directly. |
| 12| **Resource Detail** | `ResourceDetail.tsx` | `/api/v1/resources/:id`| `Resource` | None | 5 Mock Records | **MOCKED** | Finds Resource in memory by route parameter `:id`. |
| 13| **Certification Guide**| `CertificationPage.tsx`| None | None | None | Static UI Text | **UI ONLY** | Fully static marketing/guide page. |
| 14| **Hallmarking Guide** | `HallmarkingPage.tsx` | None | None | None | Static UI Text | **UI ONLY** | Fully static consumer guide page. |
| 15| **Consumer Help** | `HelpCenter.tsx` | None | None | None | Static FAQ Text | **UI ONLY** | Fully static FAQ page with search filter. |
| 16| **Comparison Tray** | `ComparisonTray.tsx`, `ComparisonWorkspace.tsx` | `/api/v1/comparison` | `Standard`, `QCO` | None | Local items | **MOCKED** | Persists comparison tray to `localStorage`; exports CSV locally. |
| 17| **Saved Bookmarks** | `SavedItems.tsx` | `/api/v1/saved` | `SavedItem` | None | Local items | **MOCKED** | Persists bookmarks to `localStorage`. |
| 18| **Compliance Journey**| `ComplianceWorkspace.tsx`, `ComplianceJourneyDetail.tsx` | `/api/v1/compliance/journeys` | `ComplianceJourney`| None | 2 Mock Records | **MOCKED** | Detail view directly imports `complianceJourneys.json`. |
| 19| **Research Reports** | `ReportsList.tsx`, `ReportPreview.tsx` | `/api/v1/reports` | `Report` | None | 3 Mock Records | **MOCKED** | `reportService.ts` reads `reports.json` directly. |
| 20| **Indic Multilingual**| `LanguageContext.tsx`, `i18n.ts` | None | None | None | 12 Locales | **CLIENT WORKING** | Client-side i18next translation working with 12 Indic JSON locale packs. |
