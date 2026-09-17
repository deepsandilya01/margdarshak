/**
 * utils/formatDate.ts
 * Date formatting utilities.
 */

type FormatStyle = 'short' | 'long' | 'numeric';

export function formatDate(
  dateStr: string | Date | undefined | null,
  style: FormatStyle = 'short',
): string {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const options: Intl.DateTimeFormatOptions =
      style === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : style === 'numeric'
        ? { year: 'numeric', month: '2-digit', day: '2-digit' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(d);
  } catch {
    return String(dateStr);
  }
}
