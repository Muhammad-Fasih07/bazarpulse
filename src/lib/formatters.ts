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

    // Safety fallback for sample/mock product handles to ensure zero 404s
    const sampleHandles = [
      'silk-tunic-emerald', 'azure-bloom-3pc', 'jacquard-kurti', 'velvet-khussa',
      'varsity-bomber-jacket', 'relaxed-cargo-jeans', 'womens-cropped-hoodie', 'juniors-windbreaker',
      'ruby-crimson-3pc', 'chapter2-kurta-ochre', 'printed-lawn-coord', 'kameez-shalwar-navy',
      'jamawar-waistcoat', 'janisa-perfume', 'marigold-bliss-3pc', 'salt-denim-jacket',
      'velvet-shawl-3pc', 'muzlin-3pc-lawn', 'mahay-coord-ivory', 'baby-frock-pink',
      'boys-dino-tracksuit', 'silk-peplum-kurti', 'cambric-2pc-bloom', 'quilted-clutch'
    ];

    if (sampleHandles.some((h) => targetUrl.includes(h))) {
      const parsed = new URL(targetUrl);
      if (parsed.hostname.includes('sapphire')) {
        targetUrl = 'https://pk.sapphireonline.com.pk/collections/special-offers';
      } else if (parsed.hostname.includes('outfitters')) {
        targetUrl = 'https://outfitters.com.pk/collections/sale';
      } else if (parsed.hostname.includes('khaadi')) {
        targetUrl = 'https://pk.khaadi.com/collections/sale';
      } else if (parsed.hostname.includes('junaidjamshed')) {
        targetUrl = 'https://www.junaidjamshed.com/collections/promotions';
      } else if (parsed.hostname.includes('gulahmed')) {
        targetUrl = 'https://www.gulahmedshop.com/collections/sale';
      } else if (parsed.hostname.includes('nishatlinen')) {
        targetUrl = 'https://nishatlinen.com/collections/sale';
      } else if (parsed.hostname.includes('sanasafinaz')) {
        targetUrl = 'https://www.sanasafinaz.com/collections/sale';
      } else if (parsed.hostname.includes('bachaaparty')) {
        targetUrl = 'https://bachaaparty.com/collections/clearance-sale';
      } else if (parsed.hostname.includes('ethnic')) {
        targetUrl = 'https://ethnic.pk/collections/sale';
      } else if (parsed.hostname.includes('limelight')) {
        targetUrl = 'https://www.limelight.pk/collections/sale';
      }
    }

    const url = new URL(targetUrl);
    url.searchParams.set('utm_source', 'bazaarpulse');
    url.searchParams.set('utm_medium', 'deal_aggregator');
    url.searchParams.set('utm_campaign', 'sales_finder');
    return url.toString();
  } catch {
    return originalUrl;
  }
}
