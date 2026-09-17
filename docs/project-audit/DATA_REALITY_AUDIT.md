# BIS-SATHI — DATA REALITY & KNOWLEDGE BASE AUDIT

This document audits the data reality across the BIS-SATHI repository, identifying data sources, actual record counts, provenance, schema mapping, and pipeline functionality.

---

## 1. Physical Dataset Inventory & Counts

All structured data across both frontend applications and the primary server originates from a single set of 6 mock JSON files stored in `frontend-web/src/data/`:

| Dataset | File Path | Records | Real / Mock | Topics Covered | Provenance & Source Metadata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standards** | `frontend-web/src/data/standards/standards.json` | **8** | Synthetic / Mock | Plugs (IS 1293), EV Charging (IS 17017), Batteries (IS 16046), Solar PV (IS 14286), Toys (IS 9873), Smart Meters (IS 16444), Footwear (IS 15844), Packaged Water (IS 14543) | Hardcoded strings referencing "BIS Official Website" |
| **Quality Control Orders (QCOs)** | `frontend-web/src/data/qco/qco.json` | **5** | Synthetic / Mock | Plugs & Sockets (DPIIT), Toys (DPIIT), Air Conditioners (DPIIT), Solar PV Modules (MNRE), Footwear (DPIIT) | Synthetic S.O. gazette numbers (e.g. "S.O. 1234(E)") |
| **Laboratories** | `frontend-web/src/data/laboratories/labs.json` | **5** | Synthetic / Mock | AES Labs (Noida), Central Power Research Inst (Bengaluru), ERDA (Vadodara), TUV Rheinland (Bengaluru), National Test House (Kolkata) | Sample contact phone numbers and generic addresses |
| **Resources & Guidelines** | `frontend-web/src/data/resources/resources.json` | **5** | Synthetic / Mock | Product Manual for IS 1293, Scheme I Guidelines, Testing Guidelines for Electronics, BIS Act 2016 PDF, Gazette Notification Sample | Placeholder relative URLs (e.g. `/docs/resources/is1293-manual.pdf`) |
| **Research Reports** | `frontend-web/src/data/reports/reports.json` | **3** | Synthetic / Mock | EV Charging Compliance Report, Domestic Plugs Market Readiness, Toy Safety QCO Impact Assessment | Static sections and pre-written findings |
| **Compliance Journeys** | `frontend-web/src/data/compliance/complianceJourneys.json`| **2** | Synthetic / Mock | "Smart Wi-Fi Plug 16A" (CJ-2025-001) & "EV Charging Station Type 2" (CJ-2025-002) | 6-step compliance track with static evidence links |

**Total Records Across All Collections:** **28 Records**.

---

## 2. Ingestion Pipeline Reality: Where Does Data Flow?

```
DOCUMENTED PIPELINE:
Official BIS Gazette / Manakonline
        │ (Web Scraping / Ingestion Engine)
        ▼
data-ingestion/ (Extraction, OCR, Chunking)
        │
        ├──> Vector DB (Embeddings & Semantic Search)
        └──> MongoDB (Relational Entity Catalog)

REALITY IN CODE:
data-ingestion/ [EMPTY DIRECTORY - 0 FILES]
data/data.txt [EMPTY FILE - 0 BYTES]
        │
        ▼
Curated Frontend JSON Files (frontend-web/src/data/*.json)
        │
        ├──> Frontend React components read directly via require/import
        │
        └──> primary-server/src/utils/seeder.js
                 │ (Reads frontend JSON files from disk)
                 ▼
             MongoDB Atlas Collections (standards, qcos, labs, resources)
```

---

## 3. Database Seeding Analysis (`seeder.js`)

In `primary-server/src/utils/seeder.js`:
- Line 14:
  ```javascript
  const FRONTEND_DATA_PATH = path.join(__dirname, "../../../frontend-web/src/data");
  ```
- Lines 35-40:
  ```javascript
  const standardsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "standards/standards.json"), "utf8"));
  const qcosData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "qco/qco.json"), "utf8"));
  const labsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "laboratories/labs.json"), "utf8"));
  const resourcesData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "resources/resources.json"), "utf8"));
  const reportsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "reports/reports.json"), "utf8"));
  const complianceData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "compliance/complianceJourneys.json"), "utf8"));
  ```

**Observations:**
1. The backend server does not have its own seed data. It depends on the relative directory structure of `frontend-web`. If `primary-server` is deployed independently or in a separate Docker container, `seeder.js` fails with `ENOENT`.
2. `package.json` in `primary-server` does not define a `npm run seed` command.

---

## 4. Evidence Dropping in `standard.model.js`

In `standards.json`, each standard includes an `evidence` object:
```json
"evidence": {
  "status": "verified",
  "source": "BIS Official Website",
  "document": "IS 1293:2019 Published Specification",
  "section": "Clause 1 – Scope",
  "revision": "Third Revision (2019)"
}
```
However, inspect `primary-server/src/models/standard.model.js`:
- `standardSchema` declares: `originalId`, `code`, `title`, `shortTitle`, `description`, `division`, `divisionName`, `concordance`, `status`, `year`, `accreditedLabs`, `hsCode`, `scope`, `mandatoryUnder`, `ministry`, `certificationScheme`, `testingProtocols`, `clauses`.
- **Finding:** There is **NO `evidence` field** in `standardSchema`.
- **Result:** Due to Mongoose default `strict: true`, when `seeder.js` inserts standards, Mongoose discards the `evidence` field. The evidence data is lost upon insertion into MongoDB.
