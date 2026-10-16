import { formatDistanceToNow } from 'date-fns';

/**
 * Format numbers into Pakistani Rupee currency string (e.g. Rs. 4,990)
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs. 0';
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

/**
 * Format relative timestamp (e.g. "15m ago", "2h ago", "Just now")
 */
export function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'Recently';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Recently';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

/**
 * Returns color classes depending on discount depth
 */
export function getDiscountBadgeClass(discount: number): string {
  if (discount >= 60) {
    return 'bg-slate-900 text-white font-black shadow-sm border border-slate-900';
  }
  if (discount >= 50) {
    return 'bg-rose-50 text-rose-600 font-bold border border-rose-200';
  }
  if (discount >= 30) {
    return 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200';
  }
  return 'bg-slate-100 text-slate-700 font-medium border border-slate-200';
}

/**
 * Helper to truncate text with ellipsis
 */
export function truncate(str: string, length = 60): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Clean up brand URLs to attach aggregator analytics UTM tags
 */
export function buildProductAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return '#';
  try {
    let targetUrl = originalUrl;

    // Preserve original product link directly and attach UTM parameters for aggregator analytics
    const url = new URL(originalUrl);
    url.searchParams.set('utm_source', 'bazaarpulse');
    url.searchParams.set('utm_medium', 'deal_aggregator');
    url.searchParams.set('utm_campaign', 'sales_finder');
    return url.toString();
  } catch {
    return originalUrl;
  }
}
