/**
 * services/resources/resourceService.ts
 * Domain service for BIS Resources/Library data.
 *
 * CURRENT: returns local mock data.
 * FUTURE:  apiClient.get('/resources')
 */
import type { Resource } from '@/features/resources/types/resource';
import resourcesData from '@/data/resources/resources.json';

const _resources = resourcesData as Resource[];

export const resourceService = {
  getAll: async (): Promise<Resource[]> =>
    new Promise(resolve => setTimeout(() => resolve(_resources), 200)),

  getById: async (id: string): Promise<Resource | undefined> =>
    new Promise(resolve =>
      setTimeout(() => resolve(_resources.find(r => r.id === id)), 100)
    ),

  search: async (query: string, category?: string): Promise<Resource[]> => {
    const q = query.toLowerCase();
    return new Promise(resolve =>
      setTimeout(() =>
        resolve(
          _resources.filter(r => {
            const matchesQuery =
              !q ||
              r.title?.toLowerCase().includes(q) ||
              r.summary?.toLowerCase().includes(q);
            const matchesCat = !category || category === 'All' || r.category === category;
            return matchesQuery && matchesCat;
          })
        ), 150)
    );
  },
};
