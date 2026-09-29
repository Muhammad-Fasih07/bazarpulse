import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch explicitly registered promotional sale events
    const manualSales = await prisma.saleEvent.findMany({
      where: { isActive: true },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            websiteUrl: true,
          },
        },
      },
      orderBy: { discountUpTo: 'desc' },
    });

    const manualBrandIds = new Set(manualSales.map((s) => s.brandId));

    // 2. Automatically discover all brands with active scraped deals in database
    const brandsWithDeals = await prisma.brand.findMany({
      where: {
        id: { notIn: Array.from(manualBrandIds) },
        products: {
          some: {
            inStock: true,
            discountPercentage: { gte: 20 },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        websiteUrl: true,
        products: {
          where: { inStock: true, discountPercentage: { gte: 20 } },
          orderBy: { discountPercentage: 'desc' },
          take: 1,
          select: {
            discountPercentage: true,
            primaryImageUrl: true,
            productUrl: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { inStock: true, discountPercentage: { gt: 0 } },
            },
          },
        },
      },
    });

    // 3. Map dynamic brand sale events
    const dynamicSales = brandsWithDeals
      .filter((b) => b._count.products > 0 && b.products.length > 0)
      .map((b) => {
        const topProduct = b.products[0];
        const maxDiscount = topProduct?.discountPercentage || 50;
        return {
          id: `dyn-sale-${b.id}`,
          brandId: b.id,
          brand: {
            id: b.id,
            name: b.name,
            slug: b.slug,
            logoUrl: b.logoUrl,
            websiteUrl: b.websiteUrl,
          },
          title: `${b.name} Active Season Sale`,
          description: `Live discount deals verified on official store. Save up to ${maxDiscount}% OFF across ${b._count.products.toLocaleString()} on-sale items.`,
          discountUpTo: maxDiscount,
          badgeText: `Up to ${maxDiscount}% OFF`,
          bannerUrl: topProduct?.primaryImageUrl || null,
          saleUrl: b.websiteUrl,
          startDate: null,
          endDate: null,
          isActive: true,
          createdAt: new Date(),
        };
      });

    // Combine manual curated campaigns and dynamic live brand sales, sorted by highest discount
    const allSales = [...manualSales, ...dynamicSales].sort(
      (a, b) => b.discountUpTo - a.discountUpTo
    );

    return NextResponse.json({
      success: true,
      data: allSales,
    });
  } catch (error: any) {
    console.error('API Sales Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch sales events' },
      { status: 500 }
    );
  }
}
