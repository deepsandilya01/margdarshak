/**
 * services/qco/qcoService.ts
 * Domain service for QCO (Quality Control Orders) data.
 *
 * CURRENT: returns local mock data.
 * FUTURE:  apiClient.get('/qcos')
 */
import type { QCO } from '@/features/qco/types/qco';
import qcoData from '@/data/qco/qco.json';

const _qcos = qcoData as unknown as QCO[];

export const qcoService = {
  getAll: async (): Promise<QCO[]> =>
    new Promise(resolve => setTimeout(() => resolve(_qcos), 200)),

  getById: async (id: string): Promise<QCO | undefined> =>
    new Promise(resolve =>
      setTimeout(() => resolve(_qcos.find(q => q.id === id)), 100)
    ),

  search: async (query: string): Promise<QCO[]> => {
    const q = query.toLowerCase();
    return new Promise(resolve =>
      setTimeout(() =>
        resolve(
          !q
            ? _qcos
            : _qcos.filter(
                item =>
                  item.title?.toLowerCase().includes(q) ||
                  item.summary?.toLowerCase().includes(q)
              )
        ), 150)
    );
  },
};
