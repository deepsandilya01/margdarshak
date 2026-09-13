# BIS-SATHI Complete Frontend and Future Backend Blueprint

[CURRENT] This document is documentation-only and is based on the files inspected in the repository at `frontend-web`.

[CURRENT] The frontend is a Vite React 19 TypeScript application. `src/main.tsx` mounts `@/app/App`, imports global CSS and `@/i18n`, and wraps the application in `React.StrictMode`.

[CURRENT] The backend is not present in the inspected frontend repository. No Express server, FastAPI service, MongoDB model, Pinecone client, or LLM client was found in the inspected frontend source.

[CURRENT] The application has local JSON-backed domain services for standards, QCOs, laboratories, reports, and resources; a localStorage-backed mock authentication service; a localStorage-backed workspace context; a Lingva adapter; and an optional API client selected by `VITE_API_BASE_URL`.

[BACKEND REQUIRED] Real authentication, durable user data, authoritative data retrieval, AI retrieval, report persistence, and server-side authorization require backend modules that are not currently implemented.

[PROPOSED] Backend integration should replace service implementations behind the existing frontend-facing contracts instead of making page components call databases, FastAPI, or LLM providers directly.

## 1. Current Frontend Status vs Future Backend Status

| Area                                                        | Status                                                                                                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CURRENT] Routing                                           | `src/app/App.tsx` uses React Router `BrowserRouter`, lazy page imports, animated `Routes`, and a wildcard not-found route.                             |
| [CURRENT] UI state                                          | `LanguageContext`, `ThemeContext`, and `WorkspaceContext` provide global state.                                                                        |
| [CURRENT] Standards, QCOs, laboratories, reports, resources | Local JSON data and feature services are present.                                                                                                      |
| [CURRENT] AI Sathi                                          | `features/ai-sathi/services/chatService.ts` returns a controlled mock response when `VITE_API_BASE_URL` is absent.                                     |
| [CURRENT] Translation                                       | `i18next` has local `common`, `home`, and `aiSathi` resources for 12 language directories; runtime translation uses the `/api/lingva` Vite proxy path. |
| [CURRENT] Auth                                              | `features/auth/services/authService.ts` creates a mock local session and token; this is not production authentication.                                 |
| [CURRENT] Persistence                                       | Language, theme, saved items, comparison items, and mock auth session use browser localStorage in the inspected code.                                  |
| [BACKEND REQUIRED] Production source of truth               | Backend persistence and authorization are absent.                                                                                                      |
| [BACKEND REQUIRED] AI/RAG                                   | Retrieval, evidence validation, model invocation, and server-side citation policy are absent.                                                          |
| [FUTURE] Production operations                              | Deployment, monitoring, backups, migrations, rate limiting, and secret management require backend and infrastructure work.                             |

## 2. System Architecture

[PROPOSED] The intended future system is:

```text
React pages/components
        |
        v
Feature services and hooks
        |
        v
Central apiClient
        |
        v
Node/Express public API gateway
        |
        +--> MongoDB: users, sessions, saved work, reports, metadata
        |
        +--> FastAPI AI service
                  |
                  v
             Retrieval pipeline
                  |
                  v
               Pinecone
                  |
                  v
                  LLM
```

[CURRENT] React pages currently consume local feature hooks/services, contexts, JSON fixtures, i18next, and the chat mock. The optional `apiClient` is the only generic HTTP abstraction inspected.

[PROPOSED] The React layer should own rendering, navigation, local interaction state, and translation presentation. It should not contain database queries, private keys, FastAPI URLs, prompt secrets, or LLM calls.

[BACKEND REQUIRED] The Node/Express gateway should be the public backend boundary for authentication, domain data, saved work, reports, and chat requests. It should normalize authentication, validation, authorization, timeouts, and errors before returning data to React.

[BACKEND REQUIRED] MongoDB should persist users, sessions or refresh-token metadata, saved items, comparison snapshots, research history, compliance journeys, reports, and backend-managed domain records only after schemas and ownership rules are approved.

[BACKEND REQUIRED] FastAPI should own AI orchestration, language-aware response generation, intent handling, retrieval orchestration, citation validation, and explicit insufficient-evidence behavior. No FastAPI code exists in the inspected repository.

[BACKEND REQUIRED] Pinecone should store vectorized authorized source chunks and searchable metadata. The inspected frontend does not define a Pinecone schema; the schema in this document is therefore marked proposed.

[BACKEND REQUIRED] The LLM should receive a controlled prompt assembled by the AI service from the user query and retrieved evidence. It must not be called by the browser.

## 3. Folder-by-Folder Explanation

### `src/app/`

[CURRENT] Contains `src/app/App.tsx`, which is the application shell and actual router. It provides theme, language, workspace, header, footer, comparison tray, suspense loading, and all route declarations.

[CURRENT] No separate `AppLayout.tsx`, `app.routes.tsx`, `app.store.ts`, or route configuration file was found in this folder.

[CURRENT] Belongs here: application composition, providers, route declarations, global shell, and page loading boundaries.

[PROPOSED] Feature business logic and domain data should remain outside this folder.

[BACKEND REQUIRED] This folder depends on backend services only through feature/service contracts and should not gain direct backend SDK calls.

### `src/assets/`

[CURRENT] This folder was requested for inspection but was not present in the inspected `src` tree.

[PROPOSED] Local images, icons, fonts, and other imported build assets may belong here if the project later adopts imported assets instead of public-root assets.

[BACKEND REQUIRED] No backend dependency is defined.

### `src/components/`

[CURRENT] Contains `common`, `feedback`, `layout`, `overlays/search`, and `shared`.

[CURRENT] `common` contains `T.tsx` and `TranslatingText.tsx`; `feedback` contains `EmptyState.tsx` and `StatusPill.tsx`; `layout` contains `Footer.tsx` and `Header.tsx`; `overlays/search` contains `GlobalSearch.tsx` and `SearchOverlay.tsx`; `shared` contains `Button.tsx`, `PageTransition.tsx`, `Skeleton.tsx`, and `Tabs.tsx`.

[CURRENT] These components are shared UI and translation/navigation surfaces used across pages.

[PROPOSED] Components here should remain presentation-oriented and receive service results or callbacks through props/hooks.

[BACKEND REQUIRED] No component should depend directly on MongoDB, Pinecone, FastAPI, or an LLM.

### `src/context/`

[CURRENT] Contains `LanguageContext.tsx`, `ThemeContext.tsx`, and `WorkspaceContext.tsx`.

[CURRENT] `LanguageContext` synchronizes i18next and localStorage, validates supported language codes, exposes `language`, `setLanguage`, and async `translate`, and never uses Hindi as the fallback language.

[CURRENT] `ThemeContext` manages `light`, `dark`, and `system` theme state and persists `bis-sathi-theme`.

[CURRENT] `WorkspaceContext` manages comparison items, saved items, comparison tray state, and browser persistence under `bis-sathi-comparison-items` and `bis-sathi-saved-items`.

[PROPOSED] A later `src/state/` directory could host these contexts only if the move adds value; no move is required by this blueprint.

[BACKEND REQUIRED] Contexts may later hydrate from authenticated service calls, but server authorization must remain server-side.

### `src/core/`

[CURRENT] Contains `apiConfig.ts`, including `TRANSLATION_CONFIG`, the 12 language list, and `LanguageCode`.

[CURRENT] `TRANSLATION_CONFIG.BASE_URL` is an empty string and `vite.config.ts` proxies `/api/lingva` to `https://lingva.ml/api/v1`.

[CURRENT] `LANGUAGES` explicitly contains `en`, `hi`, `mr`, `bn`, `ta`, `te`, `kn`, `gu`, `ml`, `pa`, `or`, and `as`.

[PROPOSED] Environment-derived non-secret configuration may remain here or in `src/services/api/apiConfig.ts`, with one canonical source selected during cleanup.

[BACKEND REQUIRED] No secret may be placed in a `VITE_*` variable. Database passwords, JWT secrets, Pinecone keys, LLM keys, and private service credentials must remain server-side.

### `src/data/`

[CURRENT] Contains six JSON datasets: `compliance/complianceJourneys.json`, `laboratories/labs.json`, `qco/qco.json`, `reports/reports.json`, `resources/resources.json`, and `standards/standards.json`, plus `translations.ts`.

[CURRENT] There is no `src/data/mock/` or `src/data/constants/` directory in the inspected tree.

[PROPOSED] The existing files can be classified as frontend fixture data without moving them unless a migration is intentionally scheduled.

[BACKEND REQUIRED] Durable or authoritative copies require a backend source and explicit provenance policy.

### `src/design-system/`

[CURRENT] Contains `motion.ts`, `tokens.ts`, and `typography.ts`.

[CURRENT] These files define design-system constants and motion/typography utilities; no backend dependency is defined.

[PROPOSED] Keep visual tokens and animation utilities here, not API or feature business logic.

### `src/features/`

[CURRENT] The actual feature folders are `ai-sathi`, `auth`, `comparison`, `compliance`, `evidence`, `laboratories`, `qco`, `reports`, `resources`, and `standards`.

[CURRENT] `ai-sathi` contains layouts, `services/chatService.ts`, and `utils/intentEngine.ts`.

[CURRENT] `auth` contains `services/authService.ts`.

[CURRENT] `comparison` contains `components/ComparisonTray.tsx`.

[CURRENT] `compliance` contains `types/complianceJourney.ts`.

[CURRENT] `evidence` contains `components/EvidenceBadge.tsx` and `types/evidence.ts`.

[CURRENT] `laboratories` contains hooks, service, and type files; `qco` contains hooks, service, and type files; `reports` contains service and type files; `resources` contains service and type files; `standards` contains hooks, service, and type files.

[CURRENT] No feature folder was found for products, certification, hallmarking, consumer, or research even though routed pages exist for those areas.

[PROPOSED] Feature folders should own feature-specific pages/components/hooks/services/types when those files are deliberately migrated and imports are updated.

[BACKEND REQUIRED] Feature services are the intended replacement boundary for local JSON access when backend APIs become available.

### `src/hooks/`

[CURRENT] Contains `useLanguage.ts` and `useTranslation.ts`.

[CURRENT] `useTranslation.ts` provides `translate`, `useT`, `useLingvaText`, and `useLingvaBatch`; `useLanguage.ts` wraps the context and i18next for compatibility.

[PROPOSED] Shared hooks belong here; domain hooks can remain under their feature folders as they currently do.

[BACKEND REQUIRED] Hooks should call services and expose loading, success, empty, and error state rather than call backend providers directly.

### `src/locales/`

[CURRENT] Contains `en`, `hi`, `mr`, `bn`, `ta`, `te`, `kn`, `gu`, `ml`, `pa`, `or`, and `as`. Each inspected language directory contains `common.json`, `home.json`, and `aiSathi.json`.

[CURRENT] `i18n.ts` imports all 36 JSON resources and configures `fallbackLng: 'en'`, localStorage detection through `bis-sathi-lang`, and no React suspense.

[CURRENT] `src/data/translations.ts` is a separate legacy-style map documented in its header as English and Hindi only. Its usage and complete migration status were not established by the inspected files.

[PROPOSED] Keep `src/locales` as the canonical static translation source and audit/remove `data/translations.ts` only after a complete reference search.

### `src/pages/`

[CURRENT] Contains routed pages under `about`, `ai-sathi`, `auth`, `certification`, `comparison`, `compliance`, `consumer`, `hallmarking`, `home`, `laboratories`, `not-found`, `notifications`, `products`, `profile`, `qco`, `reports`, `research`, `resources`, and `standards`.

[CURRENT] The page locations are the actual imports in `src/app/App.tsx`; the feature folder layer is only partially colocated with them.

[PROPOSED] Pages may gradually move into matching feature folders, but no move is required for the future backend contract.

[BACKEND REQUIRED] Page components should depend on feature services, contexts, and hooks, not backend SDKs.

### `src/services/`

[CURRENT] Contains `api/apiClient.ts`, `api/apiConfig.ts`, `translation/translationApi.ts`, `translation/translationCache.ts`, and `translation/translationService.ts`.

[CURRENT] `apiClient` supports GET, POST, PUT, PATCH, and DELETE, JSON parsing, bearer-token injection, timeout, and normalized `ApiError` instances.

[CURRENT] Domain service implementations currently live under feature folders for standards, QCOs, laboratories, reports, and resources; auth and chat services also live under feature folders.

[PROPOSED] Keep one service boundary per domain and avoid adding duplicate `src/services/*` implementations unless the repository adopts a deliberate migration.

### `src/types/`

[CURRENT] This folder was requested for inspection but was not present in the inspected current tree. Typed contracts are instead under feature folders.

[CURRENT] Actual feature-local types include standard, QCO, laboratory, report, resource, evidence, and compliance journey contracts.

[PROPOSED] A shared `src/types/` folder should be created only for genuinely cross-feature contracts.

### `src/utils/`

[CURRENT] Contains `formatDate.ts`.

[PROPOSED] Pure formatting and validation helpers belong here; API calls and feature state do not.

[BACKEND REQUIRED] No backend dependency is defined.

## 4. Component Inventory

| Scope                                 | Current files                                                                                                                          | Consumers or role                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [CURRENT] Global layout               | `components/layout/Header.tsx`, `Footer.tsx`                                                                                           | App shell, navigation, language/theme controls, footer. |
| [CURRENT] Global search               | `components/overlays/search/GlobalSearch.tsx`, `SearchOverlay.tsx`                                                                     | Header search and global search overlay.                |
| [CURRENT] Shared translation          | `components/common/T.tsx`, `TranslatingText.tsx`                                                                                       | Runtime text translation for page content.              |
| [CURRENT] Shared feedback             | `components/feedback/EmptyState.tsx`, `StatusPill.tsx`                                                                                 | Empty/error-like states and status labels.              |
| [CURRENT] Shared utilities            | `components/shared/Button.tsx`, `PageTransition.tsx`, `Skeleton.tsx`, `Tabs.tsx`                                                       | Reusable controls, transitions, loading, tabs.          |
| [CURRENT] Feature-specific AI         | `features/ai-sathi/components/layouts/ApplicabilityAnalysis.tsx`, `ComparisonWorkspace.tsx`, `KnowledgeAnswer.tsx`, `ProcessGuide.tsx` | AI Sathi result layouts.                                |
| [CURRENT] Feature-specific comparison | `features/comparison/components/ComparisonTray.tsx`                                                                                    | Global comparison tray rendered by App.                 |
| [CURRENT] Feature-specific evidence   | `features/evidence/components/EvidenceBadge.tsx`                                                                                       | Evidence status badge/drawer behavior.                  |
| [CURRENT] Other feature components    | No component files were found in the other seven feature folders.                                                                      | Their pages and services remain in separate locations.  |

## 5. Context Inventory

| Context                      | State and behavior                                                           | Consumers                                                                                 | Persistence                                            | Backend dependency                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [CURRENT] `LanguageContext`  | Current language, setter, async translation, i18next synchronization.        | Header, translation components, hooks, pages through `useLanguage`.                       | `bis-sathi-lang` and i18next detector.                 | [CURRENT] Lingva through the translation service/proxy; [BACKEND REQUIRED] no domain backend needed. |
| [CURRENT] `ThemeContext`     | `light`, `dark`, `system`, `isDark`.                                         | Header and application shell.                                                             | `bis-sathi-theme`.                                     | [CURRENT] None.                                                                                      |
| [CURRENT] `WorkspaceContext` | Comparison items, saved items, tray open state, save/remove/compare helpers. | Standards, QCO, labs, saved page, comparison page, compliance workspace, comparison tray. | `bis-sathi-comparison-items`, `bis-sathi-saved-items`. | [BACKEND REQUIRED] Server synchronization if multi-device or authenticated persistence is required.  |

## 6. `src/core/` API Configuration and Secret Warning

[CURRENT] `src/core/apiConfig.ts` defines `TRANSLATION_CONFIG`, including empty browser base URL, English defaults, 8-second translation timeout, and a legacy cache prefix.

[CURRENT] The same file defines the explicit 12-language `LANGUAGES` array and `LanguageCode` union.

[CURRENT] `src/services/api/apiConfig.ts` reads `VITE_API_BASE_URL` and retrieves the browser token from `bis-sathi-auth-token`.

[CURRENT] `vite.config.ts` defines the `/api/lingva` development proxy to Lingva.

[PROPOSED] Use `VITE_API_BASE_URL` only for a public gateway origin and other non-secret browser configuration.

[BACKEND REQUIRED] Never put DB passwords, JWT secrets, Pinecone API keys, LLM keys, FastAPI private keys, or service credentials in any `VITE_*` variable because Vite exposes such values to browser code.

## 7. `src/data/` JSON Dataset Inventory

[CURRENT] The inspected JSON inventory contains exactly six files and the following counts: 8 standards, 5 QCOs, 5 laboratories, 3 reports, 5 resources, and 2 compliance journeys.

### `standards/standards.json`

[CURRENT] Purpose: local standards explorer/detail fixture consumed by `features/standards/services/standardService.ts` and `features/standards/hooks/useStandards.ts`.

[CURRENT] Schema observed in `features/standards/hooks/useStandards.ts`: `id`, `code`, `title`, `shortTitle`, `description`, `division`, `divisionName`, `concordance`, `status`, `year`, `accreditedLabs`, `hsCode`, `scope`, `mandatoryUnder`, `ministry`, `certificationScheme`, `testingProtocols`, `clauses`, `relatedQCOs`, `tags`, and `evidence`.

[CURRENT] Evidence fields are `status`, `source`, `document`, `section`, and `revision`.

[CURRENT] Example verified from the file: `{ "id": "IS-1293-2019", "code": "IS 1293:2019", "title": "Plugs and Socket-Outlets for Household and Similar Purposes", "status": "mandatory_qco", "year": 2019 }`.

[CURRENT] Consuming service: `standardService.getAll`, `getById`, and `search`; consuming hook: `useStandards`.

[PROPOSED] Future collection: `standards`; future read APIs: `GET /api/standards` and `GET /api/standards/:id`.

[BACKEND REQUIRED] Migration status: fixture only; no migration script or authoritative synchronization is defined.

### `qco/qco.json`

[CURRENT] Purpose: local QCO explorer/detail fixture consumed by `features/qco/services/qcoService.ts` and `features/qco/hooks/useQCOs.ts`.

[CURRENT] Schema observed in the hook/type: `id`, `code`, `title`, `shortTitle`, `ministry`, `ministry_short`, `gazetteRef`, `gazetteVolume`, `effectiveDate`, `notificationDate`, `status`, `coveredStandards`, `coveredStandardCodes`, `hsNPCodes`, `penaltyProvisions`, `applicability`, `exemptions`, `testingRequirements`, `certificationPath`, `description`, `summary`, `tags`, and `evidence`.

[CURRENT] Example verified from the file: `{ "id": "QCO-DPIIT-2022-Plugs", "code": "QCO-DPIIT-2022-01", "title": "Plugs and Sockets Quality Control Order 2022", "ministry_short": "DPIIT", "status": "active" }`.

[CURRENT] Consuming service: `qcoService.getAll`, `getById`, and `search`; consuming hook: `useQCOs`.

[PROPOSED] Future collection: `qcos`; future read APIs: `GET /api/qcos` and `GET /api/qcos/:id`.

[BACKEND REQUIRED] Migration status: fixture only; official provenance and update process are not defined in frontend code.

### `laboratories/labs.json`

[CURRENT] Purpose: laboratory finder/detail fixture consumed by `features/laboratories/services/laboratoryService.ts` and `features/laboratories/hooks/useLabs.ts`.

[CURRENT] Schema observed in the hook/type: `id`, `accreditationNumber`, `name`, `shortName`, `type`, `city`, `state`, `address`, `phone`, `email`, `website`, `nablStatus`, `accreditedSince`, `lastRenewal`, `validUntil`, `disciplines`, `testingScopes`, `standardsCovered`, `turnaroundDays`, `capacity`, `onlineBooking`, `nabl_scope_url`, `description`, `accreditedFor`, `coordinates`, and `evidence`.

[CURRENT] Example verified from the file: `{ "id": "NABL-TC-8801", "accreditationNumber": "NABL-TC-8801", "name": "National Centre for Electrotechnical Testing", "city": "New Delhi", "state": "Delhi", "nablStatus": "Accredited", "onlineBooking": true }`.

[CURRENT] Consuming service: `laboratoryService.getAll`, `getById`, and `search`; consuming hook: `useLabs`.

[PROPOSED] Future collection: `laboratories`; future read APIs: `GET /api/laboratories` and `GET /api/laboratories/:id`.

[BACKEND REQUIRED] Migration status: fixture only. The inspected data includes demo-style contacts and `example.com` URLs, so it must not be presented as verified live directory data without a provenance process.

### `reports/reports.json`

[CURRENT] Purpose: report preview fixture consumed by `features/reports/services/reportService.ts` and the report page.

[CURRENT] Schema observed in `features/reports/types/report.ts`: `id`, `name`, `type`, `date`, `status`, optional `productContext`, `summary`, `sections`, `evidence`, and `references`.

[CURRENT] Section fields are `heading` and `content`; report status is `Draft` or `Final` in the type.

[CURRENT] Example verified from the file: `{ "id": "RPT-2025-001", "name": "IS 16046 (Part 2) Compliance Assessment — EV Battery Pack", "type": "Product Compliance Report", "date": "2025-09-01", "status": "Final" }`.

[CURRENT] Consuming service: `reportService.getAll` and `getById`; the routed report list and preview also import/report this dataset.

[PROPOSED] Future collection: `reports`; future APIs: `GET /api/reports`, `GET /api/reports/:id`, and a report-generation POST only after the frontend generation input contract is defined.

[BACKEND REQUIRED] Migration status: fixture only; report ownership, authorship, and versioning are not defined.

### `resources/resources.json`

[CURRENT] Purpose: resource library/detail fixture consumed by `features/resources/services/resourceService.ts`.

[CURRENT] Schema observed in `features/resources/types/resource.ts`: `id`, `title`, `category`, `summary`, `body`, and `publishedDate`.

[CURRENT] Example verified from the file: `{ "id": "RES-001", "title": "BIS Certification Schemes — Complete Guide for Manufacturers", "category": "Guidelines", "publishedDate": "2025-01-15" }`.

[CURRENT] Consuming service: `resourceService.getAll`, `getById`, and `search`.

[PROPOSED] Future collection: `resources`; future APIs: `GET /api/resources` and `GET /api/resources/:id`.

[BACKEND REQUIRED] Migration status: fixture only; editorial ownership and publication approval are not defined.

### `compliance/complianceJourneys.json`

[CURRENT] Purpose: compliance workspace and journey-detail fixture. It is imported directly by the compliance pages.

[CURRENT] Schema observed in `features/compliance/types/complianceJourney.ts`: journey `id`, `productName`, `currentStage`, and `steps`; each step has `stage`, `status`, `description`, `evidence`, `documents`, `notes`, and `nextAction`.

[CURRENT] Example verified from the file: `{ "id": "CJ-2025-001", "productName": "Li-Ion Battery Pack — EV Application", "currentStage": "Certification" }`.

[CURRENT] Count: 2 journeys. No compliance domain service file was found in `src/features/compliance`.

[PROPOSED] Future collection: `complianceJourneys`; future APIs: `GET /api/compliance/journeys` and `GET /api/compliance/journeys/:id`.

[BACKEND REQUIRED] Migration status: fixture only; document upload, notes, ownership, and step mutation contracts are not defined.

### `src/data/translations.ts`

[CURRENT] This is a TypeScript map, not JSON. Its header says it contains English and Hindi string maps and defines a two-language `Language` type.

[CURRENT] It is not part of the 36-resource `i18n.ts` import list inspected.

[PROPOSED] Complete reference analysis is required before deletion or consolidation.

## 8. Hooks Inventory

| Hook                                                 | Current purpose                                                            | Data/service dependency                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [CURRENT] `src/hooks/useLanguage.ts`                 | Compatibility wrapper exposing `t`, language, setter, translate, and i18n. | `LanguageContext`, react-i18next.                             |
| [CURRENT] `src/hooks/useTranslation.ts`              | `useT`, async translation, single-text translation, and batch translation. | `translationService`, react-i18next, in-memory session cache. |
| [CURRENT] `features/standards/hooks/useStandards.ts` | Synchronous filtering and ID lookup over standards JSON.                   | `standards.json`.                                             |
| [CURRENT] `features/qco/hooks/useQCOs.ts`            | Synchronous filtering and ID lookup over QCO JSON.                         | `qco.json`.                                                   |
| [CURRENT] `features/laboratories/hooks/useLabs.ts`   | Synchronous filtering by query/state/discipline/standard ID and ID lookup. | `labs.json`.                                                  |
| [CURRENT] Per-feature hooks in other feature folders | None found in the inspected file inventory.                                | [NOT CURRENTLY DEFINED IN FRONTEND]                           |
| [PROPOSED] Backend query hooks                       | React Query or equivalent may be introduced later.                         | [FUTURE] Dependency choice is not defined in current code.    |

## 9. Locale and i18n Handling

[CURRENT] Static translation is initialized by `src/i18n.ts` with local JSON resources for `common`, `home`, and `aiSathi` in all 12 language directories.

[CURRENT] The fallback language is English. The inspected `LanguageContext` validates persisted codes against `LANGUAGES` and calls `i18n.changeLanguage` without reloading the page.

[CURRENT] Runtime dynamic translation flows through `translationService.ts` -> `translationApi.ts` -> `/api/lingva/:source/:target/:encodedText` -> the Vite proxy -> Lingva.

[CURRENT] `translationCache.ts` keys values by `sourceLanguage|targetLanguage|originalText` in memory and localStorage. `translationService.ts` also deduplicates pending requests and protects identifiers including BIS, ISI, QCO, NABL, CRS, FMCS, AI Sathi, and BIS-SATHI.

[CURRENT] `useLingvaBatch` deduplicates input strings but issues parallel per-string calls; no Lingva batch endpoint was found.

[CURRENT] AI Sathi’s `ChatRequest.language` is the selected `LanguageCode`; the current mock response echoes the message as `answer` and returns no citations.

[BACKEND REQUIRED] A production translation provider or gateway policy, quota policy, and availability monitoring are not defined.

[PROPOSED] Keep official identifiers and codes out of translation, and use selected-language -> English fallback only when local resources and Lingva fail.

## 10. Full Page-to-Feature-to-API Route Table

[CURRENT] The actual router is `src/app/App.tsx`. All routes below were read from its `Route` declarations.

| Route                         | Page import                                | Current feature/data                                         | Backend API                                                                              |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [CURRENT] `/`                 | `pages/home/Homepage`                      | Home page; local standards/home data where used.             | [BACKEND REQUIRED] No current API.                                                       |
| [CURRENT] `/standards`        | `pages/standards/StandardsExplorer`        | Standards feature hook/service and standards JSON.           | [PROPOSED] `GET /api/standards`.                                                         |
| [CURRENT] `/standards/:id`    | `pages/standards/StandardDetail`           | Standards lookup, evidence, save/compare.                    | [PROPOSED] `GET /api/standards/:id`.                                                     |
| [CURRENT] `/discover`         | `pages/products/ProductDiscovery`          | Product discovery page and local answers.                    | [BACKEND REQUIRED] Product recommendation endpoint is not currently defined in frontend. |
| [CURRENT] `/discover/results` | `pages/products/DiscoveryResults`          | Product results route state.                                 | [BACKEND REQUIRED] Product recommendation contract is not currently defined.             |
| [CURRENT] `/qco`              | `pages/qco/QCOExplorer`                    | QCO hook/service and qco JSON.                               | [PROPOSED] `GET /api/qcos`.                                                              |
| [CURRENT] `/qco/:id`          | `pages/qco/QCODetail`                      | QCO lookup, evidence, save/compare.                          | [PROPOSED] `GET /api/qcos/:id`.                                                          |
| [CURRENT] `/laboratories`     | `pages/laboratories/LabFinder`             | Laboratory hook/service and labs JSON.                       | [PROPOSED] `GET /api/laboratories`.                                                      |
| [CURRENT] `/laboratories/:id` | `pages/laboratories/LabDetail`             | Laboratory lookup and evidence.                              | [PROPOSED] `GET /api/laboratories/:id`.                                                  |
| [CURRENT] `/ai-sathi`         | `pages/ai-sathi/AISathiWorkspace`          | Intent parser, chat service, AI layouts, evidence UI.        | [PROPOSED] `POST /api/chat`.                                                             |
| [CURRENT] `/history`          | `pages/research/ResearchHistory`           | Static history fixture in page.                              | [BACKEND REQUIRED] Durable history API not currently used.                               |
| [CURRENT] `/ai-sathi/history` | `pages/research/ResearchHistory`           | Alias route to same history page.                            | [BACKEND REQUIRED] Same as `/history`.                                                   |
| [CURRENT] `/workspace`        | `pages/compliance/ComplianceWorkspace`     | Compliance JSON plus saved workspace state.                  | [BACKEND REQUIRED] Durable journeys not currently wired.                                 |
| [CURRENT] `/workspace/:id`    | `pages/compliance/ComplianceJourneyDetail` | Compliance journey JSON and evidence drawer.                 | [PROPOSED] `GET /api/compliance/journeys/:id`.                                           |
| [CURRENT] `/saved`            | `pages/profile/saved/SavedItems`           | `WorkspaceContext` local saved items.                        | [BACKEND REQUIRED] Saved-item synchronization not currently used.                        |
| [CURRENT] `/compare`          | `pages/comparison/ComparisonWorkspace`     | `WorkspaceContext` local comparison items and CSV export UI. | [BACKEND REQUIRED] Server comparison persistence is not currently used.                  |
| [CURRENT] `/resources`        | `pages/resources/ResourcesLibrary`         | Resources service and JSON.                                  | [PROPOSED] `GET /api/resources`.                                                         |
| [CURRENT] `/resources/:id`    | `pages/resources/ResourceDetail`           | Resource lookup and runtime translation.                     | [PROPOSED] `GET /api/resources/:id`.                                                     |
| [CURRENT] `/certification`    | `pages/certification/CertificationPage`    | Static page content.                                         | [NOT CURRENTLY DEFINED IN FRONTEND]                                                      |
| [CURRENT] `/hallmarking`      | `pages/hallmarking/HallmarkingPage`        | Static page content.                                         | [NOT CURRENTLY DEFINED IN FRONTEND]                                                      |
| [CURRENT] `/help`             | `pages/consumer/HelpCenter`                | Consumer help page.                                          | [NOT CURRENTLY DEFINED IN FRONTEND]                                                      |
| [CURRENT] `/reports`          | `pages/reports/ReportsList`                | Reports JSON/list UI.                                        | [PROPOSED] `GET /api/reports`.                                                           |
| [CURRENT] `/reports/:id`      | `pages/reports/ReportPreview`              | Report lookup, evidence, print UI.                           | [PROPOSED] `GET /api/reports/:id`.                                                       |
| [CURRENT] `/profile`          | `pages/profile/ProfilePage`                | Profile page; persistence contract not defined.              | [BACKEND REQUIRED] `GET/PATCH /api/profile` only after contract definition.              |
| [CURRENT] `/login`            | `pages/auth/Login`                         | Local mock `signIn`.                                         | [BACKEND REQUIRED] `POST /api/auth/login`.                                               |
| [CURRENT] `/signup`           | `pages/auth/Signup`                        | Local mock `signUp`.                                         | [BACKEND REQUIRED] `POST /api/auth/signup`.                                              |
| [CURRENT] `/forgot-password`  | `pages/auth/ForgotPassword`                | Frontend form/timer behavior.                                | [BACKEND REQUIRED] Password-reset API contract is not currently defined.                 |
| [CURRENT] `/about`            | `pages/about/About`                        | Static about page.                                           | [NOT CURRENTLY DEFINED IN FRONTEND]                                                      |
| [CURRENT] `/notifications`    | `pages/notifications/Notifications`        | Static/local notification page.                              | [BACKEND REQUIRED] Notification persistence contract is not currently defined.           |
| [CURRENT] `/settings`         | `pages/profile/ProfilePage`                | Same page import as `/profile`.                              | [NOT CURRENTLY DEFINED IN FRONTEND]                                                      |
| [CURRENT] `*`                 | `pages/not-found/NotFound`                 | Not-found page.                                              | [CURRENT] None.                                                                          |

## 11. Service Layer Diagram

[CURRENT] The current intended domain flow is:

```text
Page
  -> feature hook or feature service
  -> local JSON fixture
  -> rendered state
```

[PROPOSED] The backend-ready replacement is:

```text
Page
  -> feature hook
  -> feature service
  -> apiClient
  -> Node/Express gateway
  -> MongoDB or FastAPI as appropriate
  -> normalized response
```

[CURRENT] Standards, QCO, laboratory, report, and resource services currently return local data after short timers. Auth returns local sessions. Chat selects a backend implementation only when `VITE_API_BASE_URL` exists; otherwise it uses the mock implementation.

[BACKEND REQUIRED] No current domain service exists for product recommendation, compliance, notifications, profile, or password reset.

## 12. Master Feature Table

| Feature                    | Pages                                                               | Components                                                                   | Hooks                    | Service                                     | Data                                       | Backend module                                                   | APIs                                                         |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------ | ------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| [CURRENT] AI Sathi         | `pages/ai-sathi/AISathiWorkspace`, `pages/research/ResearchHistory` | AI layouts; evidence component                                               | Shared translation hooks | `features/ai-sathi/services/chatService.ts` | No AI JSON fixture; static history in page | [BACKEND REQUIRED] AI gateway + FastAPI                          | [PROPOSED] `POST /api/chat`                                  |
| [CURRENT] Auth             | `pages/auth/*`                                                      | Shared form/layout components                                                | `useLanguage`            | `features/auth/services/authService.ts`     | localStorage session                       | [BACKEND REQUIRED] Auth module                                   | [BACKEND REQUIRED] login/signup/reset APIs                   |
| [CURRENT] Standards        | standards pages                                                     | shared status/evidence; no feature component file beyond types/hooks/service | `useStandards`           | `standardService`                           | `standards.json`                           | [BACKEND REQUIRED] Standards module                              | [PROPOSED] standards GET APIs                                |
| [CURRENT] QCO              | QCO pages                                                           | shared status/evidence                                                       | `useQCOs`                | `qcoService`                                | `qco.json`                                 | [BACKEND REQUIRED] QCO module                                    | [PROPOSED] QCO GET APIs                                      |
| [CURRENT] Laboratories     | laboratory pages                                                    | shared status                                                                | `useLabs`                | `laboratoryService`                         | `labs.json`                                | [BACKEND REQUIRED] Laboratory module                             | [PROPOSED] laboratory GET APIs                               |
| [CURRENT] Reports          | report pages                                                        | shared status/evidence                                                       | None found               | `reportService`                             | `reports.json`                             | [BACKEND REQUIRED] Reports module                                | [PROPOSED] report GET APIs                                   |
| [CURRENT] Resources        | resource pages                                                      | shared translation                                                           | None found               | `resourceService`                           | `resources.json`                           | [BACKEND REQUIRED] Resource module                               | [PROPOSED] resource GET APIs                                 |
| [CURRENT] Compliance       | compliance pages                                                    | evidence component                                                           | None found               | No compliance service found                 | `complianceJourneys.json`                  | [BACKEND REQUIRED] Compliance module                             | [PROPOSED] journey GET APIs                                  |
| [CURRENT] Comparison       | comparison pages/tray                                               | `ComparisonTray`                                                             | None found               | `WorkspaceContext`                          | local saved comparison state               | [BACKEND REQUIRED] Optional workspace module                     | [BACKEND REQUIRED] No current server API need is implemented |
| [CURRENT] Evidence         | evidence component and consumers                                    | `EvidenceBadge`                                                              | None found               | No evidence service found                   | embedded evidence objects                  | [BACKEND REQUIRED] Evidence provenance service if server-managed | [BACKEND REQUIRED] Not currently defined                     |
| [CURRENT] Products         | product pages                                                       | page-local UI                                                                | None found               | No product service found                    | No product JSON found                      | [BACKEND REQUIRED] Product recommendation module                 | [BACKEND REQUIRED] Not currently defined                     |
| [CURRENT] Certification    | certification page                                                  | page-local UI                                                                | None found               | None found                                  | No certification JSON found                | [NOT CURRENTLY DEFINED IN FRONTEND]                              | [NOT CURRENTLY DEFINED IN FRONTEND]                          |
| [CURRENT] Hallmarking      | hallmarking page                                                    | page-local UI                                                                | None found               | None found                                  | No hallmarking JSON found                  | [NOT CURRENTLY DEFINED IN FRONTEND]                              | [NOT CURRENTLY DEFINED IN FRONTEND]                          |
| [CURRENT] Consumer         | consumer help page                                                  | page-local UI                                                                | None found               | None found                                  | No consumer JSON found                     | [NOT CURRENTLY DEFINED IN FRONTEND]                              | [NOT CURRENTLY DEFINED IN FRONTEND]                          |
| [CURRENT] Notifications    | notifications page                                                  | page-local UI                                                                | None found               | None found                                  | No notification JSON found                 | [BACKEND REQUIRED] If notifications become user-specific         | [NOT CURRENTLY DEFINED IN FRONTEND]                          |
| [CURRENT] Profile/Settings | profile page under two routes                                       | page-local UI                                                                | None found               | None found                                  | No profile JSON found                      | [BACKEND REQUIRED] Profile module if persisted                   | [NOT CURRENTLY DEFINED IN FRONTEND]                          |

## 13. Feature Deep Dive for Actual `src/features/` Features

### AI Sathi

[CURRENT] Purpose: parse a query into a `QueryIntent`, call `chatService.ask`, and render one of the AI result layouts.

[CURRENT] Supported intent union: `GENERAL`, `EXPLANATION`, `HOW_TO`, `PRODUCT_APPLICABILITY`, `QCO`, `TESTING`, `LAB`, `CERTIFICATION`, `HALLMARKING`, `CONSUMER`, `COMPARISON`, `EVIDENCE`, `COMPLIANCE`, and `REPORT`.

[CURRENT] Pages: `pages/ai-sathi/AISathiWorkspace.tsx` and `pages/research/ResearchHistory.tsx`.

[CURRENT] Components: `ApplicabilityAnalysis`, `ComparisonWorkspace`, `KnowledgeAnswer`, and `ProcessGuide` under `features/ai-sathi/components/layouts`.

[CURRENT] Hooks: no AI-specific hook file was found; shared translation hooks are used.

[CURRENT] Service: `features/ai-sathi/services/chatService.ts`.

[CURRENT] Types: chat request/response/status types are declared in the service file; intent types are in `utils/intentEngine.ts`.

[CURRENT] Data: no AI JSON dataset is defined. Research history is an in-page `MOCK_HISTORY` fixture.

[CURRENT] Workflow: input -> `parseIntent` -> `chatService.ask` -> research state -> layout selection. The current mock returns `answer: message`, `citations: []`, `intent: 'GENERAL'`, a `mock-*` request ID, and `status: 'success'`.

[CURRENT] Voice recognition maps the selected language code to an `*-IN` locale in the page implementation.

[BACKEND REQUIRED] A real chat API must validate `message`, `language`, optional `sessionId`, optional context, authorization, rate limits, and request size.

[PROPOSED] Request JSON is the existing type: `{ "message": string, "language": LanguageCode, "sessionId": string?, "context": object? }`.

[PROPOSED] Success response JSON is the existing type: `{ "answer": string, "citations": [{ "title": string, "url": string?, "page": string? }], "intent": string, "requestId": string, "status": "success" }`.

[PROPOSED] Error response JSON should preserve the existing status vocabulary: `{ "status": "validation_error" | "service_unavailable" | "timeout" | "unauthorized" | "insufficient_evidence", "message": string, "requestId": string? }`.

[BACKEND REQUIRED] The RAG pipeline must retrieve authorized source chunks, retain source identifiers and locations, pass only retrieved evidence to the model, validate citations against retrieved chunks, and return `insufficient_evidence` when support is inadequate.

[PROPOSED] Pinecone metadata may include `documentId`, `title`, `sourceUrl`, `page`, `clause`, `section`, `version`, `retrievedAt`, `contentType`, and `accessScope`; this is a proposal because the frontend defines no Pinecone metadata schema.

### Auth

[CURRENT] `features/auth/services/authService.ts` defines `AuthSession` with `email`, `displayName`, optional `organization`, and `token`.

[CURRENT] `signIn` validates non-empty email and password length of at least six; `signUp` additionally requires display name, organization, and email; both persist a mock session and token in localStorage.

[BACKEND REQUIRED] Production auth needs server-side password hashing, credential validation, token rotation, revocation, reset-token handling, and authorization. The current frontend does not define a protected-route wrapper.

[PROPOSED] MongoDB user document should contain only approved fields derived from the actual session plus server metadata; exact roles, password fields, and verification fields are [NOT CURRENTLY DEFINED IN FRONTEND].

### Standards

[CURRENT] `standardService` reads `standards.json`, exposes `getAll`, `getById`, and `search`; `useStandards` filters query, status, and division locally.

[CURRENT] Standard typed fields and relationships are documented in the dataset section; `relatedQCOs` and evidence establish links to QCO IDs and evidence objects.

[BACKEND REQUIRED] APIs must preserve these response fields or provide an explicit mapping adapter.

### QCO

[CURRENT] `qcoService` reads `qco.json`, exposes `getAll`, `getById`, and `search`; `useQCOs` filters query, status, and ministry.

[CURRENT] QCO data links to standards through `coveredStandards` and `coveredStandardCodes`.

[BACKEND REQUIRED] QCO API responses require stable IDs and linked-standard references.

### Laboratories

[CURRENT] `laboratoryService` reads `labs.json`, exposes `getAll`, `getById`, and `search`; `useLabs` filters query, state, discipline, and standard ID.

[CURRENT] Laboratory data links to standards through `standardsCovered` and includes embedded evidence.

[BACKEND REQUIRED] A live laboratory service requires provenance and freshness rules; the fixture includes demo-style contact values.

### Reports

[CURRENT] `reportService` reads `reports.json`, exposes `getAll` and `getById`; report type and section/evidence shapes are typed.

[BACKEND REQUIRED] Report creation, ownership, immutable versions, and download authorization are not currently defined.

### Resources

[CURRENT] `resourceService` reads `resources.json`, exposes `getAll`, `getById`, and `search` by text/category.

[BACKEND REQUIRED] Editorial publication, versioning, and source approval are not currently defined.

### Comparison

[CURRENT] `ComparisonTray` is the feature component. Item type is `standard`, `qco`, `lab`, or `product`; each item has `id`, `label`, `title`, and string attributes.

[CURRENT] Comparison state is held in `WorkspaceContext`, limited to four items, and persisted locally.

[BACKEND REQUIRED] Server comparison snapshots are optional and not required by current frontend behavior.

### Compliance

[CURRENT] Only `features/compliance/types/complianceJourney.ts` exists in the feature folder; pages consume the JSON directly.

[CURRENT] Journey status, stage, documents, notes, next action, and evidence are defined by the feature type.

[BACKEND REQUIRED] Mutating notes, documents, statuses, and ownership needs an API contract that the frontend does not currently define.

### Evidence

[CURRENT] `EvidenceBadge` and `Evidence` type support status, source, document, section, revision, and optional source URL.

[CURRENT] Evidence is embedded in standards, QCOs, laboratories, reports, and compliance steps; no standalone evidence service was found.

[BACKEND REQUIRED] Evidence provenance, access control, immutable source snapshots, and citation validation need server policy.

## 14. Auth Flow and User Model

[CURRENT] Current flow: Login form -> local `signIn` -> localStorage mock session/token -> navigation to `/workspace`; Signup follows the same local flow through `signUp`.

[CURRENT] `getAuthSession` reads `bis-sathi-auth-session`; `signOut` removes it and `bis-sathi-auth-token`.

[CURRENT] No auth context, route guard, logout control, refresh token, or server call was found in the inspected current implementation.

[BACKEND REQUIRED] Future flow: React auth service -> `POST /api/auth/login` or `/signup` -> Node gateway -> user store -> secure session/token response.

[PROPOSED] Minimal user document fields justified by current UI are `email`, `displayName`, and optional `organization`; `_id`, timestamps, password hash, verification state, roles, and token metadata are [NOT CURRENTLY DEFINED IN FRONTEND] and require product/security decisions.

## 15. Sessions, History, Saved Data

[CURRENT] `ChatRequest` includes optional `sessionId`, and the current AI page sends the fixed string `local-ai-sathi-session`.

[CURRENT] Research history is an in-page static array with delete-only local component state; no history service or persistence is present.

[CURRENT] Saved and comparison items persist in localStorage through `WorkspaceContext`.

[BACKEND REQUIRED] APIs are needed only when history/saved/comparison data must be durable, user-specific, multi-device, or server-authorized.

[PROPOSED] Such APIs may be `GET /api/sessions`, `GET /api/sessions/:id`, `GET /api/saved`, `POST /api/saved`, `DELETE /api/saved/:id`, and `POST /api/comparisons`, but their exact schemas are not currently defined by frontend behavior.

## 16. AI Sathi, RAG, Evidence, and Insufficient Evidence

[CURRENT] Current flow: `AISathiWorkspace` -> `features/ai-sathi/services/chatService.ts` -> local mock response when no API base URL is configured.

[PROPOSED] Future flow: `AISathiWorkspace` -> chat feature service -> `apiClient` -> Node gateway -> FastAPI -> query classification and retrieval -> Pinecone -> authorized chunks -> LLM -> citation validation -> ChatResponse.

[CURRENT] Query types supported by the intent union and parser are the 14 values listed in the AI Sathi deep dive. Parser matching is primarily English keyword/prefix based; multilingual natural-language intent coverage is [NOT CURRENTLY DEFINED IN FRONTEND].

[CURRENT] Exact ChatRequest fields are `message`, `language`, optional `sessionId`, and optional `context`.

[CURRENT] Exact ChatResponse fields are `answer`, `citations`, `intent`, `requestId`, and `status`.

[CURRENT] Exact citation shape is an array of objects with required `title` and optional `url` and `page`.

[CURRENT] Exact evidence shape is `id`, `status`, `source`, `document`, `section`, `revision`, and optional `sourceUrl`.

[BACKEND REQUIRED] A RAG service must never manufacture a citation, standard, QCO, laboratory claim, or source URL. It must return `insufficient_evidence` when retrieval or source support is inadequate.

[PROPOSED] RAG stages are: normalize request; authorize user; detect language and intent; retrieve scoped chunks; rerank; construct a citation-constrained prompt; call the LLM; validate citations; map result to ChatResponse; log request metadata without sensitive content.

[PROPOSED] Pinecone metadata fields are not frontend-defined. A candidate schema is listed only as a proposal in the AI Sathi section and must be approved against ingestion/source requirements.

## 17. Compliance, Reports, Comparison, Resources, Notifications, Profile/Settings

[CURRENT] Compliance uses two local journey records and embedded evidence/documents; no compliance service exists.

[BACKEND REQUIRED] Compliance persistence is needed for user-owned journeys, editable notes, document metadata, step status, and audit history; exact mutation APIs are not currently defined.

[CURRENT] Reports use three local records with typed sections, evidence, references, and print UI.

[BACKEND REQUIRED] Report persistence/generation is needed only when reports must be user-owned or generated from server research; current frontend does not define a generation request shape.

[CURRENT] Comparison uses local context state and CSV export; no comparison backend is required for current local behavior.

[CURRENT] Resources use five local records and a local search service.

[BACKEND REQUIRED] Resources need a backend only for controlled publication, updates, access, or authoritative content delivery.

[CURRENT] Notifications page exists, but a notification service/data contract was not found.

[BACKEND REQUIRED] User-specific notifications require an API and persistence model that are [NOT CURRENTLY DEFINED IN FRONTEND].

[CURRENT] `/settings` routes to the same `ProfilePage` component as `/profile`; a separate settings model was not found.

[BACKEND REQUIRED] Profile persistence needs an approved PATCH contract; settings persistence is [NOT CURRENTLY DEFINED IN FRONTEND].

## 18. Complete API Inventory

[CURRENT] Current backend API endpoint count is zero in the inspected frontend. The generic `apiClient` is present, but no configured live backend URL is present in the inspected source.

| Method                   | Endpoint                       | Feature      | Purpose                                    | Auth                                                    | Request                                                           | Response                                                                                        | DB                 | AI  |
| ------------------------ | ------------------------------ | ------------ | ------------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------ | --- |
| [PROPOSED] GET           | `/api/standards`               | Standards    | Replace local `getAll/search`.             | Optional/public policy is [NOT CURRENTLY DEFINED].      | Query parameters derived from current search/filter fields.       | `Standard[]` shape from current type.                                                           | standards          | No  |
| [PROPOSED] GET           | `/api/standards/:id`           | Standards    | Replace local `getById`.                   | [NOT CURRENTLY DEFINED].                                | Path `id`.                                                        | `Standard` or normalized not-found error.                                                       | standards          | No  |
| [PROPOSED] GET           | `/api/qcos`                    | QCO          | Replace local `getAll/search`.             | [NOT CURRENTLY DEFINED].                                | Query/filter parameters.                                          | `QCO[]`.                                                                                        | qcos               | No  |
| [PROPOSED] GET           | `/api/qcos/:id`                | QCO          | Replace local `getById`.                   | [NOT CURRENTLY DEFINED].                                | Path `id`.                                                        | `QCO` or not-found error.                                                                       | qcos               | No  |
| [PROPOSED] GET           | `/api/laboratories`            | Laboratories | Replace local `getAll/search`.             | [NOT CURRENTLY DEFINED].                                | Query, state, discipline, standard ID.                            | `Laboratory[]`.                                                                                 | laboratories       | No  |
| [PROPOSED] GET           | `/api/laboratories/:id`        | Laboratories | Replace local `getById`.                   | [NOT CURRENTLY DEFINED].                                | Path `id`.                                                        | `Laboratory` or not-found error.                                                                | laboratories       | No  |
| [PROPOSED] GET           | `/api/resources`               | Resources    | Replace local `getAll/search`.             | [NOT CURRENTLY DEFINED].                                | Query/category parameters.                                        | `Resource[]`.                                                                                   | resources          | No  |
| [PROPOSED] GET           | `/api/resources/:id`           | Resources    | Replace local `getById`.                   | [NOT CURRENTLY DEFINED].                                | Path `id`.                                                        | `Resource` or not-found error.                                                                  | resources          | No  |
| [PROPOSED] GET           | `/api/reports`                 | Reports      | Replace local report list.                 | User ownership policy is [NOT CURRENTLY DEFINED].       | Query parameters [NOT CURRENTLY DEFINED].                         | `Report[]`.                                                                                     | reports            | No  |
| [PROPOSED] GET           | `/api/reports/:id`             | Reports      | Replace local report lookup.               | User ownership policy is [NOT CURRENTLY DEFINED].       | Path `id`.                                                        | `Report`.                                                                                       | reports            | No  |
| [BACKEND REQUIRED] POST  | `/api/auth/login`              | Auth         | Replace mock sign-in.                      | Public endpoint with abuse protection.                  | Email/password fields are based on current form.                  | Auth session shape is based on `AuthSession`; secure token details are [NOT CURRENTLY DEFINED]. | users/sessions     | No  |
| [BACKEND REQUIRED] POST  | `/api/auth/signup`             | Auth         | Replace mock sign-up.                      | Public endpoint with abuse protection.                  | Email, password, displayName, organization based on current form. | Auth session shape based on current type.                                                       | users/sessions     | No  |
| [PROPOSED] POST          | `/api/chat`                    | AI Sathi     | Replace mock `chatService.ask`.            | Auth policy [NOT CURRENTLY DEFINED].                    | Exact `ChatRequest`.                                              | Exact `ChatResponse`.                                                                           | sessions/audit     | Yes |
| [BACKEND REQUIRED] PATCH | `/api/profile`                 | Profile      | Persist current profile form when defined. | Authenticated.                                          | Profile fields are [NOT CURRENTLY DEFINED].                       | Profile shape is [NOT CURRENTLY DEFINED].                                                       | users              | No  |
| [BACKEND REQUIRED] GET   | `/api/compliance/journeys/:id` | Compliance   | Replace direct journey fixture lookup.     | Authenticated ownership policy [NOT CURRENTLY DEFINED]. | Path `id`.                                                        | `ComplianceJourney`.                                                                            | complianceJourneys | No  |

[CURRENT] No current frontend behavior justifies claiming APIs for certification, hallmarking, consumer help, notifications, product recommendation, password reset, or report generation; those contracts are not currently defined.

## 19. Request, Response, and Error JSON

[CURRENT] The current frontend sends no live domain GET/POST/PATCH request unless `VITE_API_BASE_URL` is configured for the optional chat/API implementation.

[PROPOSED] Standards GET response: `[{ "id": "IS-1293-2019", "code": "IS 1293:2019", "title": "...", "evidence": [{ "id": "...", "status": "verified", "source": "...", "document": "...", "section": "...", "revision": "..." }] }]`; the complete field set is the current Standard type.

[PROPOSED] QCO GET response: `[{ "id": "QCO-DPIIT-2022-Plugs", "code": "QCO-DPIIT-2022-01", "title": "...", "linkedStandards": ["..."] }]`; the complete field set is the current QCO type and legacy JSON compatibility fields.

[PROPOSED] Laboratory GET response: `[{ "id": "NABL-TC-8801", "name": "...", "city": "New Delhi", "state": "Delhi", "standardsCovered": ["..."] }]`; the complete field set is the current Laboratory hook/type.

[PROPOSED] Resource GET response: `[{ "id": "RES-001", "title": "...", "category": "Guidelines", "summary": "...", "body": "...", "publishedDate": "2025-01-15" }]`.

[PROPOSED] Report GET response: `[{ "id": "RPT-2025-001", "name": "...", "type": "Product Compliance Report", "date": "2025-09-01", "status": "Final", "sections": [], "evidence": [], "references": [] }]`.

[PROPOSED] Chat POST request: `{ "message": "What is BIS?", "language": "en", "sessionId": "local-ai-sathi-session", "context": { "source": "ai-sathi-workspace" } }`.

[PROPOSED] Chat success response: `{ "answer": "...", "citations": [{ "title": "...", "url": "...", "page": "..." }], "intent": "GENERAL", "requestId": "...", "status": "success" }`.

[PROPOSED] Auth signup request: `{ "email": "...", "password": "...", "displayName": "...", "organization": "..." }`; exact response beyond current `AuthSession` is [NOT CURRENTLY DEFINED IN FRONTEND].

[PROPOSED] Auth login request: `{ "email": "...", "password": "..." }`; exact response beyond current `AuthSession` is [NOT CURRENTLY DEFINED IN FRONTEND].

[PROPOSED] Normalized error JSON for every endpoint: `{ "status": "validation_error" | "unauthorized" | "not_found" | "conflict" | "timeout" | "service_unavailable", "message": string, "requestId": string? }`.

[BACKEND REQUIRED] The exact request and response contracts for profile, password reset, notifications, product recommendation, compliance mutation, saved items, history, comparison persistence, and report generation are not defined by current frontend code and must not be guessed.

## 20. MongoDB Collection Table

[PROPOSED] The following collections are a future design, not current implementation.

| Collection                      | Fields justified or proposed                                                                             | Indexes                                     | Relationships                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| [PROPOSED] `users`              | Current `email`, `displayName`, optional `organization`; server auth fields are [NOT CURRENTLY DEFINED]. | Unique email.                               | Owns sessions, saved items, reports, journeys.               |
| [PROPOSED] `sessions`           | Current optional `sessionId`; token/session lifecycle fields are [NOT CURRENTLY DEFINED].                | User ID, expiry.                            | Belongs to users; references chat history.                   |
| [PROPOSED] `standards`          | Current Standard fields.                                                                                 | `id`, code, division, tags.                 | Links related QCO IDs and evidence IDs.                      |
| [PROPOSED] `qcos`               | Current QCO fields.                                                                                      | `id`, code, status, effectiveDate.          | Links standard IDs and evidence IDs.                         |
| [PROPOSED] `laboratories`       | Current Laboratory fields.                                                                               | `id`, state, disciplines, standardsCovered. | Links standard IDs and evidence IDs.                         |
| [PROPOSED] `resources`          | Current Resource fields.                                                                                 | `id`, category, publishedDate.              | May be cited by QCOs or reports.                             |
| [PROPOSED] `reports`            | Current Report fields plus owner/version fields not defined in frontend.                                 | Owner ID, report ID, date.                  | Links evidence and references.                               |
| [PROPOSED] `complianceJourneys` | Current ComplianceJourney fields plus owner/audit fields not defined.                                    | Owner ID, journey ID, currentStage.         | Links product/standard/QCO/lab/evidence IDs where available. |
| [PROPOSED] `researchSessions`   | Chat request/response metadata based on current contract.                                                | Owner ID, session ID, createdAt.            | Links chat turns and reports.                                |
| [PROPOSED] `savedItems`         | Current SavedItem fields from WorkspaceContext.                                                          | Owner ID, item ID, type.                    | References standards/QCOs/labs/products by ID.               |

[BACKEND REQUIRED] No current frontend contract defines product, notification, feedback, document-upload, audit-log, or Pinecone synchronization collections.

## 21. Data Ownership Matrix

| Data                                                   | Frontend current owner        | Future Node                 | Future FastAPI               | Future MongoDB                          | Future Pinecone          |
| ------------------------------------------------------ | ----------------------------- | --------------------------- | ---------------------------- | --------------------------------------- | ------------------------ |
| [CURRENT] Static locale resources                      | i18next/local JSON            | No                          | No                           | No                                      | No                       |
| [CURRENT] Fixture standards/QCO/labs/resources/reports | JSON and feature services     | Read gateway                | No                           | [FUTURE] authoritative copy if approved | No                       |
| [CURRENT] Language preference                          | LanguageContext/localStorage  | No                          | No                           | [FUTURE] optional user preference       | No                       |
| [CURRENT] Saved/comparison state                       | WorkspaceContext/localStorage | [FUTURE] sync gateway       | No                           | [FUTURE] optional durable owner data    | No                       |
| [CURRENT] Mock auth session                            | authService/localStorage      | [FUTURE] auth gateway       | No                           | [FUTURE] users/sessions                 | No                       |
| [CURRENT] Chat request/response mock                   | chatService                   | [FUTURE] public API         | [FUTURE] AI orchestration    | [FUTURE] audit/session metadata         | [FUTURE] retrieval index |
| [CURRENT] Evidence objects                             | Embedded in fixture records   | [FUTURE] provenance gateway | [FUTURE] citation validation | [FUTURE] source metadata                | [FUTURE] chunk metadata  |

## 22. Frontend-to-Backend File Mapping

| Frontend file                                                   | Current source                | Future API                                           | Backend module       | DB                     |
| --------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- | -------------------- | ---------------------- |
| [CURRENT] `features/standards/services/standardService.ts`      | `standards.json`              | `GET /api/standards`, `GET /api/standards/:id`       | Node standards       | standards              |
| [CURRENT] `features/qco/services/qcoService.ts`                 | `qco.json`                    | `GET /api/qcos`, `GET /api/qcos/:id`                 | Node QCO             | qcos                   |
| [CURRENT] `features/laboratories/services/laboratoryService.ts` | `labs.json`                   | `GET /api/laboratories`, `GET /api/laboratories/:id` | Node laboratories    | laboratories           |
| [CURRENT] `features/resources/services/resourceService.ts`      | `resources.json`              | `GET /api/resources`, `GET /api/resources/:id`       | Node resources       | resources              |
| [CURRENT] `features/reports/services/reportService.ts`          | `reports.json`                | `GET /api/reports`, `GET /api/reports/:id`           | Node reports         | reports                |
| [CURRENT] `features/auth/services/authService.ts`               | localStorage mock session     | `POST /api/auth/login`, `POST /api/auth/signup`      | Node auth            | users/sessions         |
| [CURRENT] `features/ai-sathi/services/chatService.ts`           | controlled mock               | `POST /api/chat`                                     | Node chat + FastAPI  | sessions/audit         |
| [CURRENT] `context/WorkspaceContext.tsx`                        | localStorage saved/comparison | [FUTURE] saved/comparison endpoints                  | Node workspace       | savedItems/comparisons |
| [CURRENT] `src/services/translation/*`                          | local cache + Lingva proxy    | Existing Lingva proxy or approved gateway            | Translation boundary | No required DB         |

## 23. Mock JSON to API Migration Steps

[PROPOSED] Standards: preserve the Standard type, add a backend adapter inside `standardService`, map API pagination/filter parameters, retain local fixture fallback only in development, and add provenance/version checks.

[PROPOSED] QCOs: preserve QCO IDs and linked standard IDs, replace `qco.json` reads in `qcoService`, and validate links during ingestion.

[PROPOSED] Laboratories: replace local search with server filtering while retaining standard/state/discipline query parameters; verify accreditation provenance before publication.

[PROPOSED] Resources: move records through an editorial ingestion process and preserve `publishedDate`, category, body, and summary.

[PROPOSED] Reports: replace fixture reads with owner-authorized reads and retain section/evidence/reference shapes.

[PROPOSED] Compliance journeys: introduce a service first because current pages import JSON directly; preserve step/evidence/document relationships.

[PROPOSED] AI: replace only the backend branch of `chatService`; keep `ChatRequest` and `ChatResponse` stable.

[PROPOSED] Auth: replace local `signIn/signUp` internals with API calls and introduce server-issued session handling without exposing secrets.

## 24. Frontend Files That Need Changes When Backend Lands

| File/area                                             | Current                   | Future change                                                                |
| ----------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| [CURRENT] Domain services                             | Local JSON and timers     | [FUTURE] Call `apiClient` and map normalized API results.                    |
| [CURRENT] `features/ai-sathi/services/chatService.ts` | Mock/backend switch       | [FUTURE] Use gateway response and explicit status handling.                  |
| [CURRENT] `features/auth/services/authService.ts`     | Local session             | [FUTURE] Call auth endpoints and manage server session safely.               |
| [CURRENT] `WorkspaceContext.tsx`                      | localStorage only         | [FUTURE] Optional authenticated hydration/sync.                              |
| [CURRENT] Research history page                       | In-page fixture           | [FUTURE] Service-backed session history if product requires it.              |
| [CURRENT] Compliance pages                            | Direct JSON import        | [FUTURE] Compliance service and mutation states.                             |
| [CURRENT] `src/services/api/apiConfig.ts`             | Reads `VITE_API_BASE_URL` | [FUTURE] Configure public gateway origin only.                               |
| [CURRENT] Pages                                       | Existing UI contracts     | [FUTURE] Ideally unchanged except loading/error and auth-state presentation. |

## 25. API Client Design

[CURRENT] `src/services/api/apiClient.ts` provides generic `get`, `post`, `put`, `patch`, and `delete` methods.

[CURRENT] It uses `API_CONFIG.baseUrl`, JSON `Accept`/`Content-Type`, an optional bearer token from localStorage, `AbortController`, configurable timeout, JSON parsing, 204 handling, and `ApiError` status values.

[CURRENT] If no base URL exists, it throws `ApiError('Backend API is not configured', 503)`.

[PROPOSED] Keep endpoint-specific validation and mapping in feature services, not in the generic client.

[BACKEND REQUIRED] Production clients need correlation/request IDs, retry policy appropriate to idempotent methods, refresh-session behavior, structured server error parsing, and telemetry hooks.

## 26. Security, AI Safety, Performance, and Deployment

[BACKEND REQUIRED] Use HTTPS, secure cookies or an approved token model, password hashing, CSRF protection where cookie auth is used, authorization checks, input validation, file constraints, and audit logging.

[BACKEND REQUIRED] Never expose DB passwords, JWT secrets, Pinecone keys, LLM keys, or private service credentials in `VITE_*` variables. This warning applies to frontend builds, source maps, CI variables, and public configuration.

[BACKEND REQUIRED] AI safety must reject unsupported claims, prevent prompt injection from becoming system instructions, scope retrieval by authorization, and validate every citation against retrieved evidence.

[BACKEND REQUIRED] Rate-limit chat, login, signup, password reset, search abuse, and expensive report operations.

[PROPOSED] Cache immutable catalog responses with versioned keys and cache translation responses by source, target, and original text as the current frontend already does.

[BACKEND REQUIRED] Observability should record request ID, endpoint, latency, status, model/RAG timing, and safe error categories without logging secrets or unnecessary user content.

[PROPOSED] Deployment topology: static Vite assets behind a CDN -> Node/Express gateway -> internal FastAPI service and managed MongoDB/Pinecone; private network boundaries and identity configuration are [FUTURE].

## 27. Backend Project Structure Proposal

[PROPOSED] Node/Express gateway:

```text
backend-node/
  src/
    app.ts
    config/
    middleware/
    routes/
      auth.ts
      chat.ts
      standards.ts
      qcos.ts
      laboratories.ts
      resources.ts
      reports.ts
      compliance.ts
    controllers/
    services/
    repositories/
    validators/
    errors/
    observability/
  tests/
```

[PROPOSED] `routes` define public HTTP boundaries; `controllers` translate HTTP to service calls; `services` implement use cases; `repositories` isolate MongoDB; `validators` enforce request schemas; `middleware` handles auth/rate limits/errors.

[PROPOSED] FastAPI AI service:

```text
backend-ai/
  app/
    main.py
    api/
    schemas/
    orchestration/
    retrieval/
    embeddings/
    citations/
    safety/
    providers/
    observability/
  tests/
```

[PROPOSED] `orchestration` handles chat flow; `retrieval` handles authorized search; `citations` validates evidence; `safety` handles policy checks; `providers` isolates embedding and LLM vendors.

## 28. Phased Implementation Roadmap

[PROPOSED] Phase 0: freeze and document current contracts, fixture provenance, route ownership, and the current API/client boundaries.

[PROPOSED] Phase 1: add backend schemas and validation for users, catalog records, evidence, reports, journeys, and chat contracts without changing the frontend UI.

[PROPOSED] Phase 2: implement Node gateway read endpoints for standards, QCOs, laboratories, resources, and reports; switch feature services one at a time.

[PROPOSED] Phase 3: implement auth and server-side session management, then add optional workspace hydration and protected routes.

[PROPOSED] Phase 4: implement FastAPI retrieval, authorized source ingestion, Pinecone metadata, citation validation, and insufficient-evidence behavior.

[PROPOSED] Phase 5: switch chat service to the gateway, run contract tests, and verify selected-language responses without Hindi fallback.

[PROPOSED] Phase 6: add durable history, compliance mutations, reports, notifications, profile, and any product recommendation contract only after each frontend need is specified.

[PROPOSED] Phase N: production hardening, load testing, accessibility testing, mobile/language QA, monitoring, backup, and incident response.

## 29. Gap Analysis

| Currently Implemented                                                         | Backend Required                                             | Not Yet Defined                                                                   | Future Enhancement                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [CURRENT] React/Vite application and routed pages.                            | [BACKEND REQUIRED] Public gateway and persistence.           | [NOT CURRENTLY DEFINED IN FRONTEND] Protected route policy.                       | [FUTURE] Route-level code/data prefetching.             |
| [CURRENT] Nine feature folders with typed services/hooks in selected domains. | [BACKEND REQUIRED] Domain API implementations.               | [NOT CURRENTLY DEFINED IN FRONTEND] Product service contract.                     | [FUTURE] Full page colocation under features.           |
| [CURRENT] 12-language local resources and Lingva cache/proxy.                 | [BACKEND REQUIRED] Provider availability/quota policy.       | [NOT CURRENTLY DEFINED IN FRONTEND] Translation observability and batch endpoint. | [FUTURE] Locale completeness beyond current namespaces. |
| [CURRENT] Mock chat contract and intent parser.                               | [BACKEND REQUIRED] RAG, FastAPI, LLM, citation validation.   | [NOT CURRENTLY DEFINED IN FRONTEND] Multilingual intent parser semantics.         | [FUTURE] Streaming responses.                           |
| [CURRENT] Local saved/comparison persistence.                                 | [BACKEND REQUIRED] Multi-device synchronization if required. | [NOT CURRENTLY DEFINED IN FRONTEND] Ownership and conflict resolution.            | [FUTURE] Shared workspaces.                             |
| [CURRENT] Local mock auth.                                                    | [BACKEND REQUIRED] Secure auth and authorization.            | [NOT CURRENTLY DEFINED IN FRONTEND] Roles and identity verification.              | [FUTURE] SSO.                                           |
| [CURRENT] Fixture reports, compliance, resources, standards, QCOs, labs.      | [BACKEND REQUIRED] Provenance and editorial governance.      | [NOT CURRENTLY DEFINED IN FRONTEND] Official source update process.               | [FUTURE] Scheduled ingestion.                           |

## 30. Final API Master List, Data Master List, and Relationships

[CURRENT] Current frontend backend endpoint count: 0.

[PROPOSED] Future API master list justified by current service/page behavior: `GET /api/standards`, `GET /api/standards/:id`, `GET /api/qcos`, `GET /api/qcos/:id`, `GET /api/laboratories`, `GET /api/laboratories/:id`, `GET /api/resources`, `GET /api/resources/:id`, `GET /api/reports`, `GET /api/reports/:id`, `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/chat`, `PATCH /api/profile`, and `GET /api/compliance/journeys/:id`.

[CURRENT] Data master list: `standards.json` with 8 items; `qco.json` with 5; `labs.json` with 5; `reports.json` with 3; `resources.json` with 5; `complianceJourneys.json` with 2; `translations.ts` with a separate English/Hindi map; and 36 locale JSON resources across 12 languages.

[CURRENT] Relationship fields verified in types/data include standards -> related QCO IDs, QCOs -> covered standard IDs/codes, laboratories -> standards covered, compliance steps -> evidence/documents, reports -> evidence/references, and resources -> IDs referenced by the QCO type.

[PROPOSED] Relationship diagram:

```text
Product discovery input
        |
        v
Applicable Standard(s) -------> QCO(s)
        |                           |
        v                           v
Testing protocols ---------> Laboratory(ies)
        |                           |
        +-------------> Evidence <---+
                         |
                         v
                 Compliance Journey
                         |
                         v
                       Report
                         |
                         v
                    Chat citations
```

[BACKEND REQUIRED] Product-to-standard, standard-to-QCO, testing-to-laboratory, and citation relationships must be validated during ingestion; current frontend data does not establish every relationship for every product or feature.

## Validation Record

[CURRENT] Inspected directories included `src/app`, `src/components`, `src/context`, `src/core`, `src/data`, `src/design-system`, `src/features`, `src/hooks`, `src/locales`, `src/pages`, `src/services`, and `src/utils`.

[CURRENT] `src/assets` and `src/types` were explicitly checked and were not present in the current filesystem; feature-local types were inspected instead.

[CURRENT] Inspected root frontend files included `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `postcss.config.js`, `tailwind.config.js`, `src/app/App.tsx`, `src/main.tsx`, `src/i18n.ts`, and `src/core/apiConfig.ts`.

[CURRENT] Every route declared in the inspected `src/app/App.tsx` is represented in the page-to-feature-to-API route table.

[CURRENT] Every JSON file found under `src/data/` is represented in the dataset inventory.

[CURRENT] Every actual feature folder found under `src/features/` is represented in the feature inventory and master feature table.

[CURRENT] No backend implementation was claimed as current. Future API, MongoDB, FastAPI, Pinecone, LLM, and security content is explicitly marked `[BACKEND REQUIRED]`, `[PROPOSED]`, or `[FUTURE]`.

[CURRENT] No claim of official BIS accuracy, live laboratory status, live QCO status, live certification status, or fabricated citation provenance is made by this blueprint.

[NOT CURRENTLY DEFINED IN FRONTEND] Browser console results, production deployment configuration, backend schemas, protected-route requirements, profile/settings persistence, notification persistence, password-reset contract, product recommendation contract, report-generation request contract, and complete multilingual intent semantics were not determinable from the inspected frontend code.
