// /src/types/standard.ts
import type { Evidence } from './evidence';

export interface Standard {
  id: string;                    // e.g. "IS-1234-2019"
  title: string;
  category: string;
  status: 'Active' | 'Under Revision' | 'Withdrawn' | 'Draft';
  year: number;
  currentVersion: string;
  description: string;           // short, homepage/list use
  scope: string;                 // longer, detail page
  applicableProducts: string[];
  requirements: { id: string; title: string; detail: string }[];
  testing: { id: string; name: string; method: string }[];
  certificationNotes: string;
  relatedQCO: string[];          // QCO ids
  amendments: { date: string; summary: string }[];
  relatedStandards: string[];    // Standard ids
  evidence: Evidence[];
  // Legacy/extended fields (kept for backward compat with existing components)
  code?: string;
  division?: string;
  divisionName?: string;
  concordance?: string | null;
  accreditedLabs?: number;
  hsCode?: string;
  mandatoryUnder?: string | null;
  ministry?: string | null;
  certificationScheme?: string | null;
  testingProtocols?: string[];
  clauses?: { number: string; title: string; mandatory: boolean }[];
  relatedQCOs?: string[];
  tags?: string[];
  shortTitle?: string;
}
