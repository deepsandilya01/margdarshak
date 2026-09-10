// /src/types/complianceJourney.ts
import type { Evidence } from './evidence';

export type ComplianceStage =
  | 'Product'
  | 'Standard'
  | 'Applicability'
  | 'QCO'
  | 'Testing'
  | 'Laboratory'
  | 'Certification'
  | 'Complete';

export type StepStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Verified'
  | 'Needs Review'
  | 'Completed';

export interface ComplianceStep {
  stage: string;
  status: StepStatus;
  description: string;
  evidence: Evidence[];
  documents: { name: string; url: string }[];
  notes: string;
  nextAction: string;
}

export interface ComplianceJourney {
  id: string;
  productName: string;
  currentStage: ComplianceStage;
  steps: ComplianceStep[];
}
