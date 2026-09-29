import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runScraperPipeline } from '@/pipeline/runner';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let brandSlug: string | undefined;

    try {
      const body = await request.json();
      brandSlug = body.brand;
    } catch {
      // No json body provided, run all
    }

    const summary = await runScraperPipeline(prisma, brandSlug);

    return NextResponse.json({
      success: true,
      message: 'Scraping pipeline finished successfully',
      data: summary,
    });
  } catch (error: any) {
    console.error('API Scrape Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Pipeline execution failed',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return recent scrape logs
    const logs = await prisma.scrapeLog.findMany({
      take: 15,
      orderBy: { startedAt: 'desc' },
      include: {
        brand: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
