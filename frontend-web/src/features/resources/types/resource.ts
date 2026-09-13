// /src/types/resource.ts
export type ResourceCategory =
  | 'Standards'
  | 'QCOs'
  | 'Guidelines'
  | 'Circulars'
  | 'FAQs'
  | 'Educational Resources';

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  summary: string;
  body: string;
  publishedDate: string;         // ISO 8601
}
