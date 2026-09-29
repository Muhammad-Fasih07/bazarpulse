import axios from 'axios';
import * as cheerio from 'cheerio';
import { BrandScraperConfig } from './brandConfigs';
import {
  NormalizedProductPayload,
  inferGender,
  inferCategoryAndSubcategory,
  inferFabric,
} from './normalizer';

const DEFAULT_USER_AGENT =
  process.env.SCRAPER_USER_AGENT ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 BazaarPulse/1.0';

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
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);

    $(selectors.productCard).each((_, el) => {
      try {
        const titleEl = $(el).find(selectors.title);
        const title = titleEl.text().trim();

        let productUrl = $(el).find(selectors.productUrl).attr('href') || titleEl.attr('href') || '';
        if (productUrl.startsWith('/')) {
          const origin = new URL(brandConfig.websiteUrl).origin;
          productUrl = `${origin}${productUrl}`;
        }

        const imgEl = $(el).find(selectors.image);
        let imageUrl =
          imgEl.attr('src') ||
          imgEl.attr('data-src') ||
          imgEl.attr('srcset')?.split(' ')[0] ||
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80';

        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
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

        // Skip non-discounted items if this is a sale scraper
        if (discountPercentage <= 0) return;

        const savingsAmount = Math.max(0, originalPrice - salePrice);
        const combinedContext = `${title} ${brandConfig.name}`.toLowerCase();
        const gender = inferGender(combinedContext, brandConfig);
        const { category, subCategory } = inferCategoryAndSubcategory(combinedContext, '', title);
        const fabric = inferFabric(combinedContext);

        const cleanHandle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const slug = `${brandConfig.slug}-${cleanHandle}`;

        products.push({
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
        });
      } catch (err) {
        // Continue to next item on single item failure
      }
    });

    console.log(`[HTML Scraper] Extracted ${products.length} discounted products from ${brandConfig.name}`);
    return products;
  } catch (error: any) {
    console.error(`[HTML Scraper Error] Failed to scrape ${brandConfig.name}:`, error?.message);
    return [];
  }
}
