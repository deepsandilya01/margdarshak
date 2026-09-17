# BIS-SATHI — API MASTER INVENTORY

This document catalogs **every API route discovered across the primary-server codebase**, verifying route registration in `src/app.js`, controller mappings, service/repository invocations, database queries, and frontend consumption.

---

## 1. Master Route Inventory Table

| # | HTTP Method | Route Path | Auth Required | Role | Controller | Service Called | Repository Called | Purpose | Execution Status | Frontend Connected? |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | POST | `/api/v1/auth/register` | None | Public | `auth.controller.js:register` | `authService.registerUser` | `user.repository.js` | User account registration | Syntax Crash on boot | No (Uses mock localStorage) |
| 2 | POST | `/api/v1/auth/login` | None | Public | `auth.controller.js:login` | `authService.loginUser` | `user.repository.js` | User authentication | Syntax Crash on boot | No (Uses mock localStorage) |
| 3 | POST | `/api/v1/auth/refresh` | None | Public | `auth.controller.js:refreshAccessToken` | `authService.refreshAccessToken` | `user.repository.js` | Refresh JWT access token | Syntax Crash on boot | No |
| 4 | POST | `/api/v1/auth/forgot-password`| None | Public | `auth.controller.js:forgotPassword` | `authService.initiatePasswordReset` | `user.repository.js` | Initiate password reset | Syntax Crash on boot | No |
| 5 | POST | `/api/v1/auth/reset-password` | None | Public | `auth.controller.js:resetPassword` | `authService.resetPassword` | `user.repository.js` | Reset password via token | Syntax Crash on boot | No |
| 6 | GET | `/api/v1/auth/me` | Bearer JWT | USER | `auth.controller.js:getMe` | *Direct req.user* | `user.repository.js` | Get current user profile | Syntax Crash on boot | No |
| 7 | POST | `/api/v1/auth/logout` | Bearer JWT | USER | `auth.controller.js:logout` | `authService.logoutUser` | `user.repository.js` | Invalidate refresh token | Syntax Crash on boot | No (Clears localStorage) |
| 8 | POST | `/api/v1/auth/change-password`| Bearer JWT| USER | `auth.controller.js:changePassword` | `authService.changePassword` | `user.repository.js` | Update password | Syntax Crash on boot | No |
| 9 | POST | `/api/v1/chat` | Bearer JWT | USER | `chat.controller.js:chat` | `chatService.processChatRequest` | `message.repository.js` | AI RAG chat gateway | Fails (FastAPI port closed)| Calls `/chat` (404/503) |
| 10| POST | `/api/v1/sessions` | Bearer JWT | USER | `session.controller.js:createSession` | `sessionService.createSession` | `session.repository.js` | Create chat session | Syntax Crash on boot | No |
| 11| GET | `/api/v1/sessions` | Bearer JWT | USER | `session.controller.js:getSessions` | `sessionService.findSessions` | `session.repository.js` | List chat sessions | Syntax Crash on boot | No |
| 12| GET | `/api/v1/sessions/:id` | Bearer JWT | USER | `session.controller.js:getSessionById` | `sessionService.findSessionById` | `session.repository.js` | Get session metadata | Syntax Crash on boot | No |
| 13| GET | `/api/v1/sessions/:id/messages`| Bearer JWT| USER | `session.controller.js:getSessionMessages`| `sessionService.findSessionMessages`| `message.repository.js` | Get chat message history | Syntax Crash on boot | No |
| 14| GET | `/api/v1/standards` | None | Public | `standards.controller.js:getStandards` | `standardsService.findStandards` | `standards.repository.js`| Search/filter standards | Syntax Crash on boot | No (Reads `standards.json`) |
| 15| GET | `/api/v1/standards/:id` | None | Public | `standards.controller.js:getStandardById` | `standardsService.findStandardById` | `standards.repository.js`| Get standard detail | Syntax Crash on boot | No (Reads `standards.json`) |
| 16| GET | `/api/v1/qcos` | None | Public | `qco.controller.js:getQCOs` | `qcoService.findQCOs` | `qco.repository.js` | Search/filter QCOs | Syntax Crash on boot | No (Reads `qco.json`) |
| 17| GET | `/api/v1/qcos/:id` | None | Public | `qco.controller.js:getQCOById` | `qcoService.findQCOById` | `qco.repository.js` | Get QCO detail | Syntax Crash on boot | No (Reads `qco.json`) |
| 18| GET | `/api/v1/labs` | None | Public | `labs.controller.js:getLabs` | `labsService.findLabs` | `labs.repository.js` | Search/filter laboratories | Syntax Crash on boot | No (Reads `labs.json`) |
| 19| GET | `/api/v1/labs/:id` | None | Public | `labs.controller.js:getLabById` | `labsService.findLabById` | `labs.repository.js` | Get laboratory detail | Syntax Crash on boot | No (Reads `labs.json`) |
| 20| GET | `/api/v1/resources` | None | Public | `resources.controller.js:getResources` | `resourcesService.findResources` | `resources.repository.js`| Search/filter resources | Syntax Crash on boot | No (Reads `resources.json`) |
| 21| GET | `/api/v1/resources/:id` | None | Public | `resources.controller.js:getResourceById` | `resourcesService.findResourceById` | `resources.repository.js`| Get resource detail | Syntax Crash on boot | No (Reads `resources.json`) |
| 22| GET | `/api/v1/reports` | Bearer JWT | USER | `reports.controller.js:getReports` | `reportsService.findReports` | `reports.repository.js` | List user reports | Syntax Crash on boot | No (Reads `reports.json`) |
| 23| GET | `/api/v1/reports/:id` | Bearer JWT | USER | `reports.controller.js:getReportById` | `reportsService.findReportById` | `reports.repository.js` | Get report preview | Syntax Crash on boot | No (Reads `reports.json`) |
| 24| GET | `/api/v1/compliance/journeys` | Bearer JWT| USER | `compliance.controller.js:getComplianceJourneys` | `complianceService.findComplianceJourneys` | `compliance.repository.js`| List user journeys | Syntax Crash on boot | No (Reads local JSON) |
| 25| GET | `/api/v1/compliance/journeys/:id`| Bearer JWT| USER| `compliance.controller.js:getComplianceJourneyById`| `complianceService.findComplianceJourneyById`| `compliance.repository.js`| Get journey detail | Syntax Crash on boot | No (Reads local JSON) |
| 26| POST | `/api/v1/comparison` | None | Public | `comparison.controller.js:compareEntities` | `comparisonService.getComparisonData` | `comparison.repository.js`| Compare up to 4 entities | Syntax Crash on boot | No (Uses localStorage) |
| 27| GET | `/api/v1/saved` | Bearer JWT | USER | `saved.controller.js:getSavedItems` | `savedService.findSavedItems` | `saved.repository.js` | List saved bookmarks | Syntax Crash on boot | No (Uses localStorage) |
| 28| POST | `/api/v1/saved` | Bearer JWT | USER | `saved.controller.js:saveItem` | `savedService.createSavedItem` | `saved.repository.js` | Bookmark an entity | Syntax Crash on boot | No (Uses localStorage) |
| 29| DELETE| `/api/v1/saved/:id` | Bearer JWT | USER | `saved.controller.js:deleteSavedItem` | `savedService.removeSavedItem` | `saved.repository.js` | Remove saved bookmark | Syntax Crash on boot | No (Uses localStorage) |
| 30| GET | `/api/v1/admin/users` | Bearer JWT | ADMIN | `admin.controller.js:getAllUsers` | `adminService.fetchAllUsers` | `user.repository.js` | Admin list all users | Syntax Crash on boot | No UI exists |
| 31| POST | `/api/v1/admin/standards` | Bearer JWT | ADMIN | `admin.controller.js:createStandard` | `adminService.createStandardRecord` | `standards.repository.js`| Admin create standard | Syntax Crash on boot | No UI exists |
| 32| PUT | `/api/v1/admin/standards/:id` | Bearer JWT| ADMIN | `admin.controller.js:updateStandard` | `adminService.updateStandardRecord` | `standards.repository.js`| Admin update standard | Syntax Crash on boot | No UI exists |

---

## 2. Unmounted & Orphan Route Files

- **File:** `primary-server/src/routes/data.routes.js`
  - **Status:** ORPHAN / UNMOUNTED.
  - Contains ES Module definitions (`export default router`) for 14 duplicate endpoints (`/standards`, `/qcos`, `/labs`, `/reports`, etc.).
  - This file is never imported in `primary-server/src/app.js`.

---

## 3. Missing Infrastructure Endpoints

- **`/health` or `/api/v1/health`:** Completely missing. No endpoint exists for Docker, Kubernetes, or load balancer health checks.
- **Evidence API:** There is no dedicated evidence verification endpoint (e.g. `/api/v1/evidence/:id`). Evidence is embedded in entity schemas or chat messages.
