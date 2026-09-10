// /src/types/report.ts
import type { Evidence } from './evidence';

export type ReportType =
  | 'Product Compliance Report'
  | 'Standard Summary'
  | 'QCO Summary'
  | 'Testing Requirement Report'
  | 'Research Summary';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  date: string;                  // ISO 8601
  status: 'Draft' | 'Final';
  productContext?: string;
  summary: string;
  sections: { heading: string; content: string }[];
  evidence: Evidence[];
  references: string[];
}
