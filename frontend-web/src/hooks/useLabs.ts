import { useState, useMemo, useCallback } from 'react';
import labsData from '../data/labs.json';

export interface Lab {
  id: string;
  accreditationNumber: string;
  name: string;
  shortName: string;
  type: 'Government' | 'Private';
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  nablStatus: 'Accredited' | 'Expired' | 'Suspended';
  accreditedSince: string;
  lastRenewal: string;
  validUntil: string;
  disciplines: string[];
  testingScopes: string[];
  standardsCovered: string[];
  turnaroundDays: number;
  capacity: 'High' | 'Medium' | 'Low';
  onlineBooking: boolean;
  nabl_scope_url: string;
  description: string;
  accreditedFor: string[];
  coordinates: { lat: number; lng: number };
  evidence: {
    status: 'verified' | 'source_backed' | 'partial' | 'needs_verification';
    source: string;
    document: string;
    section: string;
    revision: string;
  };
}

type LabFilter = { search?: string; state?: string; discipline?: string; standardId?: string };

export function useLabs(filter: LabFilter = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const labs = labsData as Lab[];

  const filtered = useMemo(() => {
    let result = [...labs];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.accreditationNumber.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.disciplines.some(d => d.toLowerCase().includes(q))
      );
    }
    if (filter.state) result = result.filter(l => l.state === filter.state);
    if (filter.discipline) result = result.filter(l => l.disciplines.includes(filter.discipline!));
    if (filter.standardId) result = result.filter(l => l.standardsCovered.includes(filter.standardId!));
    return result;
  }, [labs, filter.search, filter.state, filter.discipline, filter.standardId]);

  const getById = useCallback((id: string) => labs.find(l => l.id === id) ?? null, [labs]);
  const states = useMemo(() => [...new Set(labs.map(l => l.state))].sort(), [labs]);
  const disciplines = useMemo(() => [...new Set(labs.flatMap(l => l.disciplines))].sort(), [labs]);

  return { labs: filtered, all: labs, isLoading, error, getById, states, disciplines };
}
