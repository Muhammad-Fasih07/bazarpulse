import { PrismaClient } from '../lib/db';
import { NormalizedProductPayload } from './normalizer';
import { BrandScraperConfig } from './brandConfigs';

export interface IngestionResult {
  brandId: string;
  brandName: string;
  totalProcessed: number;
  newDealsCount: number;
  updatedDealsCount: number;
  priceChangesCount: number;
  expiredDealsCount: number;
  activeDealsCount: number;
}

export async function ingestBrandDeals(
  prisma: PrismaClient,
  brandConfig: BrandScraperConfig,
  products: NormalizedProductPayload[],
  scrapeTimestamp: Date = new Date()
): Promise<IngestionResult> {
  // 1. Ensure Brand exists
  const brand = await prisma.brand.upsert({
    where: { slug: brandConfig.slug },
    update: {
      name: brandConfig.name,
      logoUrl: brandConfig.logoUrl,
      websiteUrl: brandConfig.websiteUrl,
      platform: brandConfig.platform,
      productsEndpoint: brandConfig.productsEndpoint,
      saleEndpoint: brandConfig.saleEndpoint,
      isFeatured: brandConfig.isFeatured ?? false,
    },
    create: {
      name: brandConfig.name,
      slug: brandConfig.slug,
      logoUrl: brandConfig.logoUrl,
      websiteUrl: brandConfig.websiteUrl,
      platform: brandConfig.platform,
      productsEndpoint: brandConfig.productsEndpoint,
      saleEndpoint: brandConfig.saleEndpoint,
      isFeatured: brandConfig.isFeatured ?? false,
    },
  });

  let newDealsCount = 0;
  let updatedDealsCount = 0;
  let priceChangesCount = 0;

  // 2. Fetch existing products for this brand matching the incoming batch externalId or slug
  const incomingSlugs = products.map((p) => p.slug);
  const incomingExternalIds = products
    .map((p) => p.externalId)
    .filter((id): id is string => Boolean(id));

  const existingProducts = await prisma.product.findMany({
    where: {
      brandId: brand.id,
      OR: [
        { slug: { in: incomingSlugs } },
        ...(incomingExternalIds.length > 0
          ? [{ externalId: { in: incomingExternalIds } }]
          : []),
      ],
    },
  });

  // Index existing products by externalId first (exact Shopify match), then by slug
  const existingByIdMap = new Map<string, (typeof existingProducts)[number]>();
  const existingBySlugMap = new Map<string, (typeof existingProducts)[number]>();

  for (const ep of existingProducts) {
    if (ep.externalId) existingByIdMap.set(ep.externalId, ep);
    existingBySlugMap.set(ep.slug, ep);
  }

  const activeSeenProductIds: string[] = [];

  for (const item of products) {
    const existingProduct =
      (item.externalId ? existingByIdMap.get(item.externalId) : undefined) ||
      existingBySlugMap.get(item.slug);

    if (existingProduct) {
      activeSeenProductIds.push(existingProduct.id);

      // Check for price difference
      const priceChanged = Math.abs(existingProduct.salePrice - item.salePrice) > 1;

      if (priceChanged) {
        priceChangesCount++;
        // Record price history entry
        await prisma.priceHistory.create({
          data: {
            productId: existingProduct.id,
            price: item.salePrice,
            originalPrice: item.originalPrice,
            discountPercentage: item.discountPercentage,
            recordedAt: scrapeTimestamp,
          },
        });
      }

      // Update product details and mark scrapedAt to current timestamp
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          externalId: item.externalId || existingProduct.externalId,
          title: item.title,
          category: item.category,
          subCategory: item.subCategory,
          gender: item.gender,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          discountPercentage: item.discountPercentage,
          savingsAmount: item.savingsAmount,
          inStock: item.inStock,
          inventoryQuantity: item.inventoryQuantity,
          productUrl: item.productUrl,
          primaryImageUrl: item.primaryImageUrl,
          imageGallery: JSON.stringify(item.imageGallery),
          sizesAvailable: JSON.stringify(item.sizesAvailable),
          fabric: item.fabric,
          tags: item.tags.join(', '),
          isHotDeal: item.isHotDeal,
          isTrending: item.isTrending,
          scrapedAt: scrapeTimestamp,
        },
      });

      updatedDealsCount++;
    } else {
      // Insert new product cleanly (No duplicates)
      const newProduct = await prisma.product.create({
        data: {
          brandId: brand.id,
          externalId: item.externalId,
          title: item.title,
          slug: item.slug,
          handle: item.handle,
          description: item.description,
          category: item.category,
          subCategory: item.subCategory,
          gender: item.gender,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          discountPercentage: item.discountPercentage,
          savingsAmount: item.savingsAmount,
          currency: 'PKR',
          inStock: item.inStock,
          inventoryQuantity: item.inventoryQuantity,
          productUrl: item.productUrl,
          primaryImageUrl: item.primaryImageUrl,
          imageGallery: JSON.stringify(item.imageGallery),
          sizesAvailable: JSON.stringify(item.sizesAvailable),
          fabric: item.fabric,
          tags: item.tags.join(', '),
          isHotDeal: item.isHotDeal,
          isTrending: item.isTrending,
          scrapedAt: scrapeTimestamp,
        },
      });

      activeSeenProductIds.push(newProduct.id);

      // Insert initial price history
      await prisma.priceHistory.create({
        data: {
          productId: newProduct.id,
          price: item.salePrice,
          originalPrice: item.originalPrice,
          discountPercentage: item.discountPercentage,
          recordedAt: scrapeTimestamp,
        },
      });

      newDealsCount++;
    }
  }

  // 3. AUTOMATIC REMOVAL OF EXPIRED / FINISHED SALES
  // Any product previously marked for this brand that was NOT found in this active sale crawl
  // or whose scrape timestamp is older than this run has either ended its sale or was removed by the store.
  let expiredDealsCount = 0;
  if (activeSeenProductIds.length > 0) {
    const expiredRes = await prisma.product.updateMany({
      where: {
        brandId: brand.id,
        id: { notIn: activeSeenProductIds },
        inStock: true,
      },
      data: {
        inStock: false,
        discountPercentage: 0,
      },
    });
    expiredDealsCount = expiredRes.count;
  }

  // Count verified active deals currently on sale
  const activeDealsCount = await prisma.product.count({
    where: {
      brandId: brand.id,
      inStock: true,
      discountPercentage: { gt: 0 },
    },
  });

  // Update brand active deals count
  await prisma.brand.update({
    where: { id: brand.id },
    data: { activeDealsCount },
  });

  return {
    brandId: brand.id,
    brandName: brand.name,
    totalProcessed: products.length,
    newDealsCount,
    updatedDealsCount,
    priceChangesCount,
    expiredDealsCount,
    activeDealsCount,
  };
}
