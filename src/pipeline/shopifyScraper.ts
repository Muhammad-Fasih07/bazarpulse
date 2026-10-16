import { BrandScraperConfig } from './brandConfigs';
import { normalizeShopifyProduct, NormalizedProductPayload } from './normalizer';
import { safeFetch } from './httpClient';
import { validateProductPayload } from './validator';

export interface ScraperResult {
  brand: BrandScraperConfig;
  totalProductsFetched: number;
  discountedProducts: NormalizedProductPayload[];
  isFallback: boolean;
  error?: string;
  durationMs: number;
}

export async function scrapeShopifyBrand(
  brandConfig: BrandScraperConfig,
  maxPages = 2
): Promise<ScraperResult> {
  const startTime = Date.now();
  const endpointsToTry: string[] = [];

  // Priority: 1. Specific sale collection, 2. Additional collection endpoints, 3. Main products endpoint
  if (brandConfig.saleEndpoint) {
    endpointsToTry.push(brandConfig.saleEndpoint);
  }
  if (brandConfig.collectionEndpoints && brandConfig.collectionEndpoints.length > 0) {
    endpointsToTry.push(...brandConfig.collectionEndpoints);
  }
  if (brandConfig.productsEndpoint) {
    endpointsToTry.push(brandConfig.productsEndpoint);
  }

  let allProducts: any[] = [];
  let fetchError: string | undefined;

  for (const endpoint of endpointsToTry) {
    try {
      let endpointProductsCount = 0;

      for (let page = 1; page <= maxPages; page++) {
        const url = new URL(endpoint);
        url.searchParams.set('limit', '250');
        url.searchParams.set('page', String(page));

        const response = await safeFetch(url.toString(), {
          timeout: 12000,
          retries: 2,
          retryDelayMs: 1000,
          rateLimitDelayMs: 250,
        });

        if (response.data && Array.isArray(response.data.products)) {
          const products = response.data.products;
          if (products.length === 0) break;
          allProducts.push(...products);
          endpointProductsCount += products.length;

          // If less than 250 products returned, there is no next page
          if (products.length < 250) break;
        } else {
          break;
        }
      }

      // If we got products from a designated sale collection or specific endpoints,
      // continue collecting unless we have gathered a healthy sample (>= 200 items)
      if (allProducts.length >= 250) {
        break;
      }
    } catch (err: any) {
      fetchError = err?.message || 'Network request failed';
      // Continue to next endpoint in case one specific collection endpoint changed
    }
  }

  // Deduplicate products by id and handle
  const seenIds = new Set<string>();
  const uniqueRawProducts = allProducts.filter((p) => {
    const id = String(p.id || p.handle || '');
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  const normalizedList: NormalizedProductPayload[] = [];
  let validationErrorsCount = 0;

  for (const raw of uniqueRawProducts) {
    const normalized = normalizeShopifyProduct(raw, brandConfig);
    if (!normalized || normalized.discountPercentage <= 0) {
      continue;
    }

    // Apply strict validation rules
    const validation = validateProductPayload(normalized, brandConfig);
    if (validation.isValid) {
      normalizedList.push(normalized);
    } else {
      validationErrorsCount++;
    }
  }

  if (validationErrorsCount > 0) {
    console.log(
      `[Shopify Scraper] Filtered out ${validationErrorsCount} invalid items from ${brandConfig.name} due to strict validation rules.`
    );
  }

  const durationMs = Date.now() - startTime;

  return {
    brand: brandConfig,
    totalProductsFetched: uniqueRawProducts.length,
    discountedProducts: normalizedList,
    isFallback: false,
    error: uniqueRawProducts.length === 0 ? fetchError : undefined,
    durationMs,
  };
}
