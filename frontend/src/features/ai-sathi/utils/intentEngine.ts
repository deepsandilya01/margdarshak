export type QueryIntent =
  | 'GENERAL'
  | 'EXPLANATION'
  | 'HOW_TO'
  | 'PRODUCT_APPLICABILITY'
  | 'QCO'
  | 'TESTING'
  | 'LAB'
  | 'CERTIFICATION'
  | 'HALLMARKING'
  | 'CONSUMER'
  | 'COMPARISON'
  | 'EVIDENCE'
  | 'COMPLIANCE'
  | 'REPORT';

export function parseIntent(query: string): QueryIntent {
  const lower = query.toLowerCase();

  // Comparison
  if (lower.includes('compare') || lower.includes('difference between')) return 'COMPARISON';

  // How-to / Process
  if (lower.startsWith('how to') || lower.startsWith('how can i') || lower.startsWith('how do i') || lower.includes('process') || lower.includes('apply for')) {
    if (lower.includes('verify') || lower.includes('fake')) return 'CONSUMER';
    if (lower.includes('hallmark')) return 'HALLMARKING';
    return 'HOW_TO';
  }

  // Consumer
  if (lower.includes('verify') || lower.includes('fake') || lower.includes('complaint')) return 'CONSUMER';

  // Evidence
  if (lower.includes('show source') || lower.includes('where is this mentioned') || lower.includes('evidence')) return 'EVIDENCE';

  // Lab
  if (lower.includes('lab') || lower.includes('laboratory') || lower.includes('find a lab') || lower.includes('which labs')) return 'LAB';

  // Testing
  if (lower.includes('test') || lower.includes('what tests')) return 'TESTING';

  // QCO
  if (lower.includes('qco') || lower.includes('quality control order')) return 'QCO';

  // Product Applicability
  if (lower.includes('my product') || lower.includes('which standard applies') || lower.includes('ev batteries') || lower.includes('applicable standard')) return 'PRODUCT_APPLICABILITY';

  // Hallmarking
  if (lower.includes('hallmark')) return 'HALLMARKING';

  // Certification
  if (lower.includes('certification') || lower.includes('registration pathway') || lower.includes('documents required')) return 'CERTIFICATION';

  // Explanation
  if (lower.startsWith('explain') || lower.includes('what does this mean')) return 'EXPLANATION';

  // Compliance (General full workflow)
  if (lower.includes('compliance process') || lower.includes('complete compliance')) return 'COMPLIANCE';

  // Report
  if (lower.includes('report')) return 'REPORT';

  // General Questions
  if (lower.startsWith('what is') || lower.startsWith('what does')) return 'GENERAL';

  // Default fallback (e.g. for ambiguous queries like "solar inverter")
  if (lower.includes('is 16046') || lower.includes('is 1293')) return 'PRODUCT_APPLICABILITY';

  return 'PRODUCT_APPLICABILITY'; // Default to the most powerful research layout if unknown
}
