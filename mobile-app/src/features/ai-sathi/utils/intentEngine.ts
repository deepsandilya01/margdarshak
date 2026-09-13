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

  if (lower.includes('compare') || lower.includes('difference between')) return 'COMPARISON';

  if (
    lower.startsWith('how to') ||
    lower.startsWith('how can i') ||
    lower.startsWith('how do i') ||
    lower.includes('process') ||
    lower.includes('apply for')
  ) {
    if (lower.includes('verify') || lower.includes('fake')) return 'CONSUMER';
    if (lower.includes('hallmark')) return 'HALLMARKING';
    return 'HOW_TO';
  }

  if (lower.includes('verify') || lower.includes('fake') || lower.includes('complaint')) return 'CONSUMER';

  if (lower.includes('show source') || lower.includes('where is this mentioned') || lower.includes('evidence')) return 'EVIDENCE';

  if (lower.includes('lab') || lower.includes('laboratory') || lower.includes('find a lab') || lower.includes('which labs')) return 'LAB';

  if (lower.includes('test') || lower.includes('what tests')) return 'TESTING';

  if (lower.includes('qco') || lower.includes('quality control order')) return 'QCO';

  if (
    lower.includes('my product') ||
    lower.includes('which standard applies') ||
    lower.includes('ev batteries') ||
    lower.includes('applicable standard')
  )
    return 'PRODUCT_APPLICABILITY';

  if (lower.includes('hallmark')) return 'HALLMARKING';

  if (
    lower.includes('certification') ||
    lower.includes('registration pathway') ||
    lower.includes('documents required')
  )
    return 'CERTIFICATION';

  if (lower.startsWith('explain') || lower.includes('what does this mean')) return 'EXPLANATION';

  if (lower.includes('compliance process') || lower.includes('complete compliance')) return 'COMPLIANCE';

  if (lower.includes('report')) return 'REPORT';

  if (lower.startsWith('what is') || lower.startsWith('what does')) return 'GENERAL';

  if (lower.includes('is 16046') || lower.includes('is 1293')) return 'PRODUCT_APPLICABILITY';

  return 'PRODUCT_APPLICABILITY';
}
