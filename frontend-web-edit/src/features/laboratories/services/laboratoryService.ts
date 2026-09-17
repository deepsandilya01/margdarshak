/**
 * services/laboratories/laboratoryService.ts
 * Domain service for NABL/BIS Laboratories data.
 *
 * CURRENT: returns local mock data.
 * FUTURE:  apiClient.get('/laboratories')
 */
import type { Laboratory } from '@/features/laboratories/types/laboratory';
import labsData from '@/data/laboratories/labs.json';

const _labs = labsData as unknown as Laboratory[];

export const laboratoryService = {
  getAll: async (): Promise<Laboratory[]> =>
    new Promise(resolve => setTimeout(() => resolve(_labs), 200)),

  getById: async (id: string): Promise<Laboratory | undefined> =>
    new Promise(resolve =>
      setTimeout(() => resolve(_labs.find(l => l.id === id)), 100)
    ),

  search: async (query: string, city?: string): Promise<Laboratory[]> => {
    const q = query.toLowerCase();
    return new Promise(resolve =>
      setTimeout(() =>
        resolve(
          _labs.filter(lab => {
            const matchesQuery =
              !q ||
              lab.name?.toLowerCase().includes(q) ||
              lab.city?.toLowerCase().includes(q);
            const matchesCity = !city || city === 'All' || lab.city === city;
            return matchesQuery && matchesCity;
          })
        ), 150)
    );
  },
};
