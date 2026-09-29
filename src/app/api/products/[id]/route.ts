import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        brand: true,
        priceHistory: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch related deals from same category or brand
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        category: product.category,
        inStock: true,
      },
      include: {
        brand: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
      orderBy: { discountPercentage: 'desc' },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    console.error('API Product Detail Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
