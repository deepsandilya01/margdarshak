/**
 * services/reports/reportService.ts
 * Domain service for BIS-SATHI Research Reports.
 *
 * CURRENT: returns local mock data.
 * FUTURE:  apiClient.get('/reports')
 */
import type { Report } from '@/features/reports/types/report';
import reportsData from '@/data/reports/reports.json';

const _reports = reportsData as Report[];

export const reportService = {
  getAll: async (): Promise<Report[]> =>
    new Promise(resolve => setTimeout(() => resolve(_reports), 200)),

  getById: async (id: string): Promise<Report | undefined> =>
    new Promise(resolve =>
      setTimeout(() => resolve(_reports.find(r => r.id === id)), 100)
    ),
};
