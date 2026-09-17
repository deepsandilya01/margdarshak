// /src/types/evidence.ts
export type EvidenceStatus =
  | 'verified'
  | 'source_backed'
  | 'partial'
  | 'needs_verification'
  | 'Verified'
  | 'Source-backed'
  | 'Partial'
  | 'Needs Verification';

export interface Evidence {
  id: string;
  status: EvidenceStatus;
  source: string;
  document: string;
  section: string;
  revision: string;
  sourceUrl?: string;
}
