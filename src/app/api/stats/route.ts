import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AggregatorStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalActiveDeals, aggregateRes, brandsCount, latestScrape, topDeal] =
      await Promise.all([
        prisma.product.count({
          where: { inStock: true, discountPercentage: { gt: 0 } },
        }),
        prisma.product.aggregate({
          where: { inStock: true, discountPercentage: { gt: 0 } },
          _avg: { discountPercentage: true },
          _max: { discountPercentage: true },
          _sum: { savingsAmount: true },
        }),
        prisma.brand.count(),
        prisma.scrapeLog.findFirst({
          where: { status: 'SUCCESS' },
          orderBy: { completedAt: 'desc' },
        }),
        prisma.product.findFirst({
          where: { inStock: true },
          include: { brand: { select: { name: true } } },
          orderBy: { discountPercentage: 'desc' },
        }),
      ]);

    const stats: AggregatorStats = {
      totalActiveDeals,
      averageDiscount: Math.round(aggregateRes._avg.discountPercentage || 0),
      maxDiscount: aggregateRes._max.discountPercentage || 0,
      totalSavingsPkr: Math.round(aggregateRes._sum.savingsAmount || 0),
      brandsMonitoredCount: brandsCount,
      lastScrapedAt: latestScrape?.completedAt?.toISOString() || null,
      topBrandDiscount: topDeal
        ? {
            brandName: topDeal.brand.name,
            discountPercentage: topDeal.discountPercentage,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('API Stats Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
