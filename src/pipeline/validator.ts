import { NormalizedProductPayload } from './normalizer';
import { BrandScraperConfig } from './brandConfigs';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates scraped product payload strictly against data quality standards.
 * Ensures:
 * 1. Title is descriptive and clean
 * 2. Prices are positive numbers, original >= salePrice
 * 3. Discount percentage is within valid range (1% to 95%)
 * 4. Product URL is a valid absolute HTTP/HTTPS URL
 * 5. Primary image URL is valid and NOT a generic placeholder/stock photo
 */
export function validateProductPayload(
  product: NormalizedProductPayload,
  brandConfig: BrandScraperConfig
): ValidationResult {
  const errors: string[] = [];

  // 1. Title check
  if (!product.title || product.title.trim().length < 3) {
    errors.push('Title is missing or too short (< 3 chars)');
  }
  const genericTitles = ['product', 'item', 'sale', 'home', 'collection', 'default title'];
  if (genericTitles.includes(product.title.trim().toLowerCase())) {
    errors.push(`Title "${product.title}" is too generic`);
  }

  // 2. Price validation
  if (typeof product.salePrice !== 'number' || isNaN(product.salePrice) || product.salePrice <= 0) {
    errors.push(`Invalid salePrice: ${product.salePrice}`);
  }
  if (typeof product.originalPrice !== 'number' || isNaN(product.originalPrice) || product.originalPrice <= 0) {
    errors.push(`Invalid originalPrice: ${product.originalPrice}`);
  }
  if (product.originalPrice < product.salePrice) {
    errors.push(`Original price (${product.originalPrice}) is less than sale price (${product.salePrice})`);
  }

  // 3. Discount range check
  if (
    typeof product.discountPercentage !== 'number' ||
    product.discountPercentage <= 0 ||
    product.discountPercentage > 95
  ) {
    errors.push(`Unrealistic or zero discount percentage: ${product.discountPercentage}%`);
  }

  // 4. Product URL validation
  if (!product.productUrl || !product.productUrl.startsWith('http')) {
    errors.push(`Invalid productUrl: ${product.productUrl}`);
  } else {
    try {
      const parsedUrl = new URL(product.productUrl);
      const brandHost = new URL(brandConfig.websiteUrl).hostname.replace(/^www\./, '');
      const parsedHost = parsedUrl.hostname.replace(/^www\./, '');

      // Check domain match or subdomains
      if (!parsedHost.includes(brandHost) && !brandHost.includes(parsedHost)) {
        errors.push(`Product URL domain mismatch: ${parsedUrl.hostname} vs brand ${brandConfig.websiteUrl}`);
      }
    } catch {
      errors.push(`Malformed product URL: ${product.productUrl}`);
    }
  }

  // 5. Image validation - NO PLACEHOLDERS OR RANDOM STOCK PHOTOS
  if (!product.primaryImageUrl || !product.primaryImageUrl.startsWith('http')) {
    errors.push(`Missing or invalid primaryImageUrl: ${product.primaryImageUrl}`);
  } else {
    // Explicitly reject random stock photos and placeholders
    const placeholderPatterns = [
      'unsplash.com',
      'placeholder',
      'no-image',
      'default-image',
      'blank.gif',
      'pixel.gif',
      'dummyimage',
      'placehold.it',
    ];
    if (placeholderPatterns.some((pattern) => product.primaryImageUrl.toLowerCase().includes(pattern))) {
      errors.push(`Image rejected as placeholder or random stock image: ${product.primaryImageUrl}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
