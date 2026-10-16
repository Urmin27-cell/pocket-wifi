/**
 * Formats amount into Malagasy Ariary (MGA), e.g., 180 000 Ar.
 */
export function formatAriary(amount: number): string {
  if (isNaN(amount)) return '0 Ar';
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' Ar';
}

/**
 * Formats ISO date string into human readable Malagasy date.
 */
export function formatDateMg(isoDateString?: string): string {
  if (!isoDateString) return '-';
  try {
    const d = new Date(isoDateString);
    return d.toLocaleDateString('fr-MG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDateString;
  }
}

/**
 * Creates a clean URL slug from a title string.
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
