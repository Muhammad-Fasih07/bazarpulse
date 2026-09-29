import axios from 'axios';
import { BrandScraperConfig } from './brandConfigs';
import { normalizeShopifyProduct, NormalizedProductPayload } from './normalizer';

const DEFAULT_USER_AGENT =
  process.env.SCRAPER_USER_AGENT ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 BazaarPulse/1.0';

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

  if (brandConfig.saleEndpoint) {
    endpointsToTry.push(brandConfig.saleEndpoint);
  }
  if (brandConfig.productsEndpoint) {
    endpointsToTry.push(brandConfig.productsEndpoint);
  }
  if (brandConfig.collectionEndpoints) {
    endpointsToTry.push(...brandConfig.collectionEndpoints);
  }

  let allProducts: any[] = [];
  let fetchError: string | undefined;

  for (const endpoint of endpointsToTry) {
    try {
      for (let page = 1; page <= maxPages; page++) {
        const url = new URL(endpoint);
        url.searchParams.set('limit', '250');
        url.searchParams.set('page', String(page));

        const response = await axios.get(url.toString(), {
          headers: {
            'User-Agent': DEFAULT_USER_AGENT,
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 10000,
        });

        if (response.data && Array.isArray(response.data.products)) {
          const products = response.data.products;
          if (products.length === 0) break;
          allProducts.push(...products);
        } else {
          break;
        }
      }

      if (allProducts.length > 0) {
        break; // Successfully got products from this endpoint
      }
    } catch (err: any) {
      fetchError = err?.message || 'Network request failed';
      // Continue to next endpoint
    }
  }

  // Deduplicate products by id
  const seenIds = new Set<string>();
  const uniqueRawProducts = allProducts.filter((p) => {
    const id = String(p.id || p.handle);
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  const normalizedList: NormalizedProductPayload[] = [];

  for (const raw of uniqueRawProducts) {
    const normalized = normalizeShopifyProduct(raw, brandConfig);
    if (normalized && normalized.discountPercentage > 0) {
      normalizedList.push(normalized);
    }
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
