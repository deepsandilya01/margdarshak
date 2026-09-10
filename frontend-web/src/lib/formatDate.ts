// /src/lib/formatDate.ts

/**
 * Shared date formatter — all dates in data are ISO 8601 strings.
 * Format for display using this function only; never format ad hoc in components.
 */
export function formatDate(isoString: string | null | undefined, style: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    
    switch (style) {
      case 'short':
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      case 'long':
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      case 'medium':
      default:
        return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }
  } catch {
    return isoString;
  }
}

/**
 * Format an ISO date as relative time (e.g. "2 days ago", "3 months ago")
 */
export function formatRelativeDate(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return isoString ?? '—';
  }
}
