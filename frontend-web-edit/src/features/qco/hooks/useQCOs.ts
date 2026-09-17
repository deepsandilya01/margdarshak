import { useState, useMemo, useCallback } from 'react';
import qcoData from '@/data/qco/qco.json';

export interface QCO {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  ministry: string;
  ministry_short: string;
  gazetteRef: string;
  gazetteVolume: string;
  effectiveDate: string;
  notificationDate: string;
  status: 'active' | 'draft' | 'amended';
  coveredStandards: string[];
  coveredStandardCodes: string[];
  hsNPCodes: string[];
  penaltyProvisions: string;
  applicability: string;
  exemptions: string[];
  testingRequirements: string;
  certificationPath: string;
  description: string;
  summary: string;
  tags: string[];
  evidence: {
    status: 'verified' | 'source_backed' | 'partial' | 'needs_verification';
    source: string;
    document: string;
    section: string;
    revision: string;
  };
}

type QCOFilter = { search?: string; status?: QCO['status'] | 'all'; ministry?: string };

export function useQCOs(filter: QCOFilter = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const qcos = qcoData as QCO[];

  const filtered = useMemo(() => {
    let result = [...qcos];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(q2 =>
        q2.code.toLowerCase().includes(q) ||
        q2.title.toLowerCase().includes(q) ||
        q2.ministry.toLowerCase().includes(q) ||
        q2.tags.some(t => t.includes(q))
      );
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(q2 => q2.status === filter.status);
    }
    if (filter.ministry) {
      result = result.filter(q2 => q2.ministry_short === filter.ministry);
    }
    return result;
  }, [qcos, filter.search, filter.status, filter.ministry]);

  const getById = useCallback((id: string) => qcos.find(q => q.id === id) ?? null, [qcos]);

  return { qcos: filtered, all: qcos, isLoading, error, getById };
}
