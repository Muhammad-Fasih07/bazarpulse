import { PrismaClient } from '../lib/db';
import { PAKISTANI_BRANDS_CONFIG, BrandScraperConfig } from './brandConfigs';
import { scrapeShopifyBrand } from './shopifyScraper';
import { scrapeHtmlBrand } from './cheerioScraper';
import { ingestBrandDeals, IngestionResult } from './changeDetector';
import { NormalizedProductPayload } from './normalizer';

export interface PipelineSummary {
  startedAt: Date;
  completedAt: Date;
  durationSeconds: number;
  totalBrandsProcessed: number;
  totalDealsFound: number;
  totalNewDeals: number;
  totalUpdatedDeals: number;
  totalPriceChanges: number;
  totalExpiredDeals: number;
  brandResults: IngestionResult[];
  errors: { brand: string; error: string }[];
}

export async function runScraperPipeline(
  prisma: PrismaClient,
  targetBrandSlug?: string
): Promise<PipelineSummary> {
  const startedAt = new Date();
  const startTime = Date.now();

  const brandsToScrape: BrandScraperConfig[] = targetBrandSlug
    ? PAKISTANI_BRANDS_CONFIG.filter((b) => b.slug === targetBrandSlug)
    : PAKISTANI_BRANDS_CONFIG;

  const brandResults: IngestionResult[] = [];
  const errors: { brand: string; error: string }[] = [];

  let totalDealsFound = 0;
  let totalNewDeals = 0;
  let totalUpdatedDeals = 0;
  let totalPriceChanges = 0;
  let totalExpiredDeals = 0;

  for (const brandConfig of brandsToScrape) {
    const brandStartTime = Date.now();

    // Create a RUNNING log
    const brandRecord = await prisma.brand.findUnique({
      where: { slug: brandConfig.slug },
    });

    const scrapeLog = await prisma.scrapeLog.create({
      data: {
        brandId: brandRecord?.id,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });

    try {
      console.log(`[BazaarPulse Ingestor] Scraping ${brandConfig.name} (${brandConfig.platform})...`);
      let discountedProducts: NormalizedProductPayload[] = [];
      let totalFetched = 0;

      if (brandConfig.platform === 'SHOPIFY') {
        const scraperRes = await scrapeShopifyBrand(brandConfig, 2);
        discountedProducts = scraperRes.discountedProducts;
        totalFetched = scraperRes.totalProductsFetched;
      } else {
        // MAGENTO_HTML, HTML_CHEERIO, or custom
        discountedProducts = await scrapeHtmlBrand(brandConfig);
        totalFetched = discountedProducts.length;
      }

      totalDealsFound += discountedProducts.length;

      let ingestRes: IngestionResult;
      if (discountedProducts.length > 0) {
        ingestRes = await ingestBrandDeals(
          prisma,
          brandConfig,
          discountedProducts,
          startedAt
        );
      } else {
        ingestRes = {
          brandId: brandRecord?.id || '',
          brandName: brandConfig.name,
          totalProcessed: 0,
          newDealsCount: 0,
          updatedDealsCount: 0,
          priceChangesCount: 0,
          expiredDealsCount: 0,
          activeDealsCount: brandRecord?.activeDealsCount || 0,
        };
      }

      brandResults.push(ingestRes);
      totalNewDeals += ingestRes.newDealsCount;
      totalUpdatedDeals += ingestRes.updatedDealsCount;
      totalPriceChanges += ingestRes.priceChangesCount;
      totalExpiredDeals += ingestRes.expiredDealsCount;

      // Update scrape log to SUCCESS
      await prisma.scrapeLog.update({
        where: { id: scrapeLog.id },
        data: {
          brandId: ingestRes.brandId || brandRecord?.id,
          status: 'SUCCESS',
          itemsScraped: totalFetched,
          itemsDiscounted: discountedProducts.length,
          durationMs: Date.now() - brandStartTime,
          completedAt: new Date(),
        },
      });

      console.log(
        `[BazaarPulse Ingestor] Completed ${brandConfig.name}: ${discountedProducts.length} deals found (${ingestRes.expiredDealsCount} expired sales retired).`
      );
    } catch (err: any) {
      const errMsg = err?.message || 'Unknown scraping error';
      console.error(`[BazaarPulse Ingestor] Error on ${brandConfig.name}:`, errMsg);
      errors.push({ brand: brandConfig.name, error: errMsg });

      await prisma.scrapeLog.update({
        where: { id: scrapeLog.id },
        data: {
          status: 'FAILED',
          error: errMsg,
          durationMs: Date.now() - brandStartTime,
          completedAt: new Date(),
        },
      });
    }
  }

  const completedAt = new Date();
  const durationSeconds = Math.round((Date.now() - startTime) / 1000);

  return {
    startedAt,
    completedAt,
    durationSeconds,
    totalBrandsProcessed: brandsToScrape.length,
    totalDealsFound,
    totalNewDeals,
    totalUpdatedDeals,
    totalPriceChanges,
    totalExpiredDeals,
    brandResults,
    errors,
  };
}
