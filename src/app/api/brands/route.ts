import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                inStock: true,
                discountPercentage: { gt: 0 },
              },
            },
            salesEvents: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { activeDealsCount: 'desc' },
        { name: 'asc' },
      ],
    });

    const formattedBrands = brands.map((b: (typeof brands)[number]) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      websiteUrl: b.websiteUrl,
      platform: b.platform,
      isFeatured: b.isFeatured,
      activeDealsCount: b._count.products,
      activeSalesCount: b._count.salesEvents,
    }));

    return NextResponse.json({
      success: true,
      data: formattedBrands,
    });
  } catch (error: any) {
    console.error('API Brands Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
