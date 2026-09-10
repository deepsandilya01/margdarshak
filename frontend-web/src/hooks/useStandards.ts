import { useState, useMemo, useCallback } from 'react';
import standardsData from '../data/standards.json';

export interface Standard {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  division: string;
  divisionName: string;
  concordance: string | null;
  status: 'mandatory_qco' | 'active' | 'superseded' | 'under_revision';
  year: number;
  accreditedLabs: number;
  hsCode: string;
  scope: string;
  mandatoryUnder: string | null;
  ministry: string | null;
  certificationScheme: string | null;
  testingProtocols: string[];
  clauses: { number: string; title: string; mandatory: boolean }[];
  relatedQCOs: string[];
  tags: string[];
  evidence: {
    status: 'verified' | 'source_backed' | 'partial' | 'needs_verification';
    source: string;
    document: string;
    section: string;
    revision: string;
  };
}

type StandardsFilter = {
  search?: string;
  status?: Standard['status'] | 'all';
  division?: string;
};

export function useStandards(filter: StandardsFilter = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const standards = standardsData as Standard[];

  const filtered = useMemo(() => {
    let result = [...standards];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(s =>
        s.code.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q)) ||
        s.division.toLowerCase().includes(q)
      );
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(s => s.status === filter.status);
    }
    if (filter.division) {
      result = result.filter(s => s.division === filter.division);
    }
    return result;
  }, [standards, filter.search, filter.status, filter.division]);

  const getById = useCallback((id: string) => {
    return standards.find(s => s.id === id) ?? null;
  }, [standards]);

  return { standards: filtered, all: standards, isLoading, error, getById };
}
