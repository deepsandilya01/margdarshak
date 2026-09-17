/**
 * services/standards/standardService.ts
 * Domain service for BIS Standards data.
 *
 * CURRENT: returns local mock data (backend not ready).
 * FUTURE:  swap implementation to call apiClient.get('/standards').
 *          UI components/hooks stay unchanged.
 */
import type { Standard } from '@/features/standards/types/standard';
import standardsData from '@/data/standards/standards.json';

const _standards = standardsData as unknown as Standard[];

export const standardService = {
  /** Get all standards */
  getAll: async (): Promise<Standard[]> => {
    return new Promise(resolve => setTimeout(() => resolve(_standards), 200));
  },

  /** Get a single standard by ID */
  getById: async (id: string): Promise<Standard | undefined> => {
    return new Promise(resolve =>
      setTimeout(() => resolve(_standards.find(s => s.id === id)), 100)
    );
  },

  /** Search/filter standards */
  search: async (query: string, category?: string): Promise<Standard[]> => {
    return new Promise(resolve => {
      const q = query.toLowerCase();
      const results = _standards.filter(s => {
        const matchesQuery =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.code?.toLowerCase().includes(q) ||
          s.divisionName?.toLowerCase().includes(q);
        const matchesCat = !category || category === 'All' || s.divisionName === category;
        return matchesQuery && matchesCat;
      });
      setTimeout(() => resolve(results), 150);
    });
  },
};
