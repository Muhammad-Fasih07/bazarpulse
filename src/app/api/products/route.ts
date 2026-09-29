import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SortOption } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search') || '';
    const gender = searchParams.get('gender') || 'ALL';
    const brand = searchParams.get('brand') || '';
    const category = searchParams.get('category') || 'ALL';
    const minDiscount = parseInt(searchParams.get('minDiscount') || '0', 10);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const inStockOnly = searchParams.get('inStock') !== 'false';
    const sort = (searchParams.get('sort') || 'discount_desc') as SortOption;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get('limit') || '16', 10)));

    // Build Where filter
    const where: any = {
      discountPercentage: {
        gte: isNaN(minDiscount) ? 0 : minDiscount,
      },
      salePrice: {
        gte: isNaN(minPrice) ? 0 : minPrice,
        lte: isNaN(maxPrice) ? 999999 : maxPrice,
      },
    };

    if (inStockOnly) {
      where.inStock = true;
    }

    if (gender && gender !== 'ALL') {
      where.gender = gender;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (brand) {
      const brandSlugs = brand.split(',').map((s) => s.trim()).filter(Boolean);
      if (brandSlugs.length > 0) {
        where.brand = {
          slug: {
            in: brandSlugs,
          },
        };
      }
    }

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { category: { contains: q } },
        { subCategory: { contains: q } },
        { brand: { name: { contains: q } } },
      ];
    }

    // Build OrderBy
    let orderBy: any = { discountPercentage: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { salePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { salePrice: 'desc' };
        break;
      case 'savings_desc':
        orderBy = { savingsAmount: 'desc' };
        break;
      case 'newest':
        orderBy = { scrapedAt: 'desc' };
        break;
      case 'discount_desc':
      default:
        orderBy = [{ discountPercentage: 'desc' }, { savingsAmount: 'desc' }];
        break;
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
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
          priceHistory: {
            orderBy: { recordedAt: 'asc' },
            take: 10,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    // Aggregate category counts for filter chips
    const allCategories = await prisma.product.groupBy({
      by: ['category'],
      where: inStockOnly ? { inStock: true, discountPercentage: { gt: 0 } } : { discountPercentage: { gt: 0 } },
      _count: { id: true },
    });

    const formattedCategories = allCategories.map((c: (typeof allCategories)[number]) => ({
      name: c.category,
      count: c._count.id,
    }));

    // Aggregate gender counts
    const allGenders = await prisma.product.groupBy({
      by: ['gender'],
      where: inStockOnly ? { inStock: true, discountPercentage: { gt: 0 } } : { discountPercentage: { gt: 0 } },
      _count: { id: true },
    });

    const formattedGenders = allGenders.map((g: (typeof allGenders)[number]) => ({
      name: g.gender,
      count: g._count.id,
    }));

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
      filters: {
        categories: formattedCategories,
        genders: formattedGenders,
        minPrice: 0,
        maxPrice: 25000,
      },
    });
  } catch (error: any) {
    console.error('API Products Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
