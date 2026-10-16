import * as cheerio from 'cheerio';
import { BrandScraperConfig } from './brandConfigs';
import {
  NormalizedProductPayload,
  inferGender,
  inferCategoryAndSubcategory,
  inferFabric,
} from './normalizer';
import { safeFetch } from './httpClient';
import { validateProductPayload } from './validator';

export async function scrapeHtmlBrand(
  brandConfig: BrandScraperConfig
): Promise<NormalizedProductPayload[]> {
  const url = brandConfig.saleEndpoint || brandConfig.websiteUrl;
  const products: NormalizedProductPayload[] = [];
  const selectors = brandConfig.selectors;

  if (!selectors) {
    console.warn(`[HTML Scraper] No CSS selectors configured for ${brandConfig.name}`);
    return [];
  }

  try {
    const response = await safeFetch<string>(url, {
      timeout: 15000,
      retries: 2,
      retryDelayMs: 1500,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    $(selectors.productCard).each((_, el) => {
      try {
        const titleEl = $(el).find(selectors.title);
        const title = titleEl.text().trim();

        let rawHref = $(el).find(selectors.productUrl).attr('href') || titleEl.attr('href') || '';
        let productUrl = '';
        if (rawHref) {
          if (rawHref.startsWith('http')) {
            productUrl = rawHref;
          } else {
            const origin = new URL(brandConfig.websiteUrl).origin;
            productUrl = `${origin}${rawHref.startsWith('/') ? '' : '/'}${rawHref}`;
          }
        }

        // Comprehensive image discovery: checking lazy-load attributes and picture tags
        const imgEl = $(el).find(selectors.image);
        let imageUrl =
          imgEl.attr('data-src') ||
          imgEl.attr('data-original') ||
          imgEl.attr('data-lazy-src') ||
          imgEl.attr('src') ||
          imgEl.attr('data-srcset')?.split(',')[0]?.trim().split(' ')[0] ||
          imgEl.attr('srcset')?.split(',')[0]?.trim().split(' ')[0] ||
          '';

        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
          const origin = new URL(brandConfig.websiteUrl).origin;
          imageUrl = `${origin}${imageUrl}`;
        }

        // Zero-Fake-Image policy: Drop item if real image cannot be extracted
        if (!imageUrl || imageUrl.includes('unsplash.com') || imageUrl.includes('pixel') || imageUrl.includes('blank.gif')) {
          return;
        }

        // Numeric price sanitization
        const rawSale = $(el).find(selectors.salePrice).text().replace(/[^0-9.]/g, '');
        const rawOrig = $(el).find(selectors.originalPrice).text().replace(/[^0-9.]/g, '');

        const salePrice = parseFloat(rawSale);
        const originalPrice = parseFloat(rawOrig) || salePrice;

        if (!title || isNaN(salePrice) || salePrice <= 0) return;

        const discountPercentage =
          originalPrice > salePrice
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : 0;

        // Skip non-discounted items
        if (discountPercentage <= 0) return;

        const savingsAmount = Math.max(0, originalPrice - salePrice);
        const combinedContext = `${title} ${brandConfig.name}`.toLowerCase();
        const gender = inferGender(combinedContext, brandConfig);
        const { category, subCategory } = inferCategoryAndSubcategory(combinedContext, '', title);
        const fabric = inferFabric(combinedContext);

        const cleanHandle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const slug = `${brandConfig.slug}-${cleanHandle}`;

        const payload: NormalizedProductPayload = {
          externalId: slug,
          title,
          slug,
          handle: cleanHandle,
          description: title,
          category,
          subCategory,
          gender,
          originalPrice: Math.round(originalPrice),
          salePrice: Math.round(salePrice),
          discountPercentage,
          savingsAmount: Math.round(savingsAmount),
          currency: 'PKR',
          inStock: true,
          inventoryQuantity: 10,
          productUrl: productUrl || brandConfig.websiteUrl,
          primaryImageUrl: imageUrl,
          imageGallery: [],
          sizesAvailable: ['Standard'],
          fabric,
          tags: [brandConfig.name, category, `${discountPercentage}% OFF`],
          isHotDeal: discountPercentage >= 50,
          isTrending: discountPercentage >= 40,
        };

        const validation = validateProductPayload(payload, brandConfig);
        if (validation.isValid) {
          products.push(payload);
        }
      } catch (err) {
        // Continue to next item on single item failure
      }
    });

    console.log(`[HTML Scraper] Extracted ${products.length} validated discounted products from ${brandConfig.name}`);
    return products;
  } catch (error: any) {
    console.error(`[HTML Scraper Error] Failed to scrape ${brandConfig.name}:`, error?.message);
    return [];
  }
}
