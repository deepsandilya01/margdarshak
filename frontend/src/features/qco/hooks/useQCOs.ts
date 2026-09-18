import { useMemo } from 'react';
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
  status: 'active' | 'superseded' | 'upcoming';
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

type QCOFilter = { search?: string; status?: QCO['status'] | 'all' };

export function useQCOs(filter: QCOFilter = {}) {
  const all = qcoData as QCO[];
  const qcos = useMemo(() => {
    let result = [...all];
    if (filter.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(qco =>
        qco.code.toLowerCase().includes(query) ||
        qco.title.toLowerCase().includes(query) ||
        qco.shortTitle.toLowerCase().includes(query) ||
        qco.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(qco => qco.status === filter.status);
    }
    return result;
  }, [all, filter.search, filter.status]);

  return { qcos, all, isLoading: false, error: null };
}