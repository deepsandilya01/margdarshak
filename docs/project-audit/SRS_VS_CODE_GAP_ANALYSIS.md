# BIS-SATHI — SRS vs ACTUAL CODE GAP ANALYSIS

This document provides a systematic comparison between the requirements specified in **`BIS_AI_Assistant_Complete_SRS_Architecture_Build_Blueprint_v2.pdf`** (and related architecture guides) and the actual implementation in the codebase.

---

## SRS Requirement Verification Table

| SRS Module / Requirement | Document Description | Actual Code Implementation | Status | Source Code Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-01: Microservices Architecture** | Standalone Node.js API Gateway, private Python FastAPI AI microservice, MongoDB database, Pinecone vector index. | Node Express server exists (syntax crash); FastAPI app does not exist; Pinecone does not exist. Python scripts use ChromaDB. | **CONTRADICTED / PARTIAL** | `ai-microservice/RAG/` contains only 3 Python scripts; no FastAPI server instance. |
| **REQ-02: AI RAG & Grounded Q&A** | Semantic retrieval over BIS standards with exact clause, section, and page citations. | AI Sathi workspace uses client-side regex heuristics (`intentEngine.ts`) and renders static components with hardcoded text. | **MOCKED** | `KnowledgeAnswer.tsx:26-45`, `ApplicabilityAnalysis.tsx:18-26`, `intentEngine.ts:17-70`. |
| **REQ-03: Vector Search with Pinecone** | Managed vector database indexing chunks of Indian Standards and QCO gazettes. | Code uses local `langchain_chroma.Chroma`. No Pinecone SDK imports or API keys exist in code. | **CONTRADICTED** | `2_retrievel_pipeline.py:3`, `3_answer_generation.py:4`. |
| **REQ-04: Multilingual Voice & Indic Support**| Voice input and multilingual support across 12 scheduled Indian languages. | Web Speech API integration in `AISathiWorkspace.tsx:63-80` works for browser voice-to-text. Locales JSON files exist for 12 languages. | **PARTIALLY IMPLEMENTED** | `frontend-web/src/locales/` contains 12 language directories; UI text translates via `i18next`. Dynamic AI translation is not implemented. |
| **REQ-05: Product to Standard Applicability** | Intelligent mapping from product description or HS Code to mandatory Indian Standards and QCOs. | Hardcoded view for "Secondary lithium battery pack" renders for all applicability queries. | **MOCKED** | `ApplicabilityAnalysis.tsx:18-26`. |
| **REQ-06: Standards Explorer** | Complete searchable catalog of Indian Standards with technical clauses, revisions, and status. | UI displays 8 hardcoded mock standards from `standards.json`. Backend API exists but is not connected. | **MOCKED / PARTIAL** | `standardService.ts:10` imports `standards.json`. |
| **REQ-07: QCO Explorer** | Searchable database of Quality Control Orders with gazette references, enforcement dates, and penalty provisions. | UI displays 5 mock QCOs from `qco.json`. | **MOCKED** | `qcoService.ts:9` imports `qco.json`. |
| **REQ-08: NABL / BIS Laboratory Finder** | Geo-located directory of accredited testing laboratories with capability filters. | UI displays 5 mock laboratories from `labs.json`. Filters operate in-memory on frontend. | **MOCKED** | `laboratoryService.ts:9` imports `labs.json`. |
| **REQ-09: End-to-End Compliance Journey** | Interactive multi-step compliance tracker from product discovery to license issuance. | UI displays hardcoded 6-step timeline reading from `complianceJourneys.json`. | **MOCKED** | `ComplianceJourneyDetail.tsx:6`. |
| **REQ-10: Technical Entity Comparison** | Side-by-side comparison of standards, QCOs, and testing protocols with difference highlighting. | Comparison workspace stores selections in `localStorage`; AI Sathi layout displays hardcoded comparison of IS 16046 vs IS 17387. | **MOCKED** | `ComparisonWorkspace.tsx:18-22`. |
| **REQ-11: Research Reports Generation** | On-demand generation and PDF export of compliance assessment reports. | UI renders 3 static mock reports from `reports.json`. | **MOCKED** | `reportService.ts:9`. |
| **REQ-12: JWT Authentication & Role-Based Access Control** | Secure signup, login, JWT token rotation, and admin authorization. | Backend has full implementation in `auth.service.js` and `auth.middleware.js`, but frontend uses fake `localStorage` tokens. Admin routes have no UI. | **BACKEND ONLY / DISCONNECTED** | `frontend-web/src/features/auth/services/authService.ts:21-31`. |
| **REQ-13: Data Ingestion Pipeline** | Automated scrapers and PDF ingestion pipeline from official BIS sources. | `data-ingestion/` directory is 0 bytes / empty. No scrapers or automated ingestion scripts exist. | **MISSING** | `data-ingestion/` contains 0 files. |
