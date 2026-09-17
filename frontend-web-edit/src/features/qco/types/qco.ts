// /src/types/qco.ts
import type { Evidence } from '@/features/evidence/types/evidence';

export interface QCO {
  id: string;                    // e.g. "QCO-2022-0091"
  title: string;
  applicability: string;
  effectiveDate: string;         // ISO 8601: "2022-06-01"
  overview: string;
  scope: string;
  requirements: { id: string; title: string; detail: string }[];
  linkedStandards: string[];     // Standard ids
  testing: { id: string; name: string; method: string }[];
  certificationImplications: string;
  resources: string[];           // Resource ids
  evidence: Evidence[];
  // Legacy/extended fields (kept for backward compat)
  code?: string;
  status?: string;
  summary?: string;
  ministry_short?: string;
  gazetteRef?: string;
  ministry?: string;
  product_categories?: string[];
}
