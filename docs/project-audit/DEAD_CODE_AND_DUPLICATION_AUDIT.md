# BIS-SATHI — DEAD CODE & DUPLICATION AUDIT

This document identifies unused files, abandoned subsystems, duplicate implementations, empty stub files, and module-system conflicts across the codebase.

---

## 1. Dead Code & Orphan Files Inventory

| File Path | Nature of File | Why It Is Dead / Orphaned | Impact / Risk |
| :--- | :--- | :--- | :--- |
| `primary-server/src/routes/data.routes.js` | Express Router | Written in ES Module syntax (`export default router`); never imported in `src/app.js`. | Confuses developers; duplicates endpoints handled by domain routers. |
| `primary-server/src/controllers/data.controller.js` | Controller | ES Module controller; only called by `data.routes.js` which is unmounted. | Dead code (267 lines). |
| `primary-server/src/services/catalog.service.js` | Service | ES Module service; only called by `data.controller.js`. | Dead code (15 lines). |
| `primary-server/src/repositories/catalog.repository.js` | Repository | ES Module repository; only called by `catalog.service.js`. | Dead code (41 lines). |
| `primary-server/src/config/env.js` | Config Module | ES Module file reading `.env`; only imported by `redis.js`. The rest of the server uses `dotenv` directly. | Dead code (32 lines). |
| `primary-server/src/config/redis.js` | Redis Client | ES Module file importing package `redis` (which is not in `package.json`). Never imported by any active controller or service. | Syntax error if imported; uninstalled package dependency. |
| `primary-server/src/utils/pagination.js` | Helper | ES Module file; only imported by `data.controller.js`. The rest of the server handles pagination manually in controllers/services. | Dead code (31 lines). |
| `primary-server/src/validators/comparison.validator.js`| Validator | Completely empty (0 bytes). | Empty placeholder. |
| `primary-server/src/validators/standard.validator.js`| Validator | Completely empty (0 bytes). | Empty placeholder. |
| `primary-server/src/validators/auth.validator.js` | Validator | Fully written validator functions; **never imported or attached** in `auth.routes.js`. | Dead validation logic (70 lines). |
| `data/data.txt` | Data File | Completely empty (0 bytes). | Empty placeholder. |
| `data-ingestion/` | Directory | Empty directory (0 files). | Empty placeholder. |

---

## 2. Duplicate Model Conflict: `compliance.model.js` vs `complianceJourney.model.js`

In `primary-server/src/models/`, two files define the exact same Mongoose model name:

1. **`compliance.model.js` (CommonJS - Active):**
   - Line 52: `const ComplianceJourney = mongoose.model("ComplianceJourney", complianceJourneySchema);`
   - Schema has detailed fields: `originalId`, `userId`, `productName`, `currentStage`, `steps` (with `evidence`, `documents`, `stage`, `status`, `notes`).
   - Imported by: `primary-server/src/repositories/compliance.repository.js` and `seeder.js`.

2. **`complianceJourney.model.js` (ES Module - Dead):**
   - Line 12: `export default mongoose.model("ComplianceJourney", complianceJourneySchema);`
   - Schema is minimal: `id`, `productName`, `currentStage` with `{ strict: false }`.
   - Imported by: `primary-server/src/controllers/data.controller.js`.

### Critical Risk:
If both files were ever loaded into the same running Node process, Mongoose throws a fatal error:
```
OverwriteModelError: Cannot overwrite 'ComplianceJourney' model once compiled.
```
`complianceJourney.model.js` is redundant and should be removed.

---

## 3. The `ApiResponse` File Structure Conflict

- **Disk File:** `primary-server/src/utils/apiResponse.js` (lowercase `a`)
- **Disk File Contents:**
  ```javascript
  export function successResponse(...) { ... }
  export function errorResponse(...) { ... }
  ```
- **Controller Imports in 12 Files:**
  ```javascript
  const { ApiResponse } = require("../utils/ApiResponse");
  ```
- **Analysis:**
  The CommonJS controllers were written expecting an `ApiResponse` class (e.g. `new ApiResponse(statusCode, data, message)`). However, someone replaced or initialized `apiResponse.js` as an ES Module utility containing functional helpers `successResponse` and `errorResponse`. This architectural mismatch breaks all 12 controllers.

---

## 4. Unused Frontend API Code

- `frontend-web/src/services/api/apiClient.ts`:
  - Implements `get()`, `post()`, `put()`, `patch()`, `delete()`.
  - Only `post()` is used (in `chatService.ts`).
  - `get()`, `put()`, `patch()`, and `delete()` are never invoked anywhere in the frontend codebase.
