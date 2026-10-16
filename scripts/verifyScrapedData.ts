import { prisma } from '../src/lib/db';
import axios from 'axios';

interface VerificationStats {
  totalChecked: number;
  validLinks: number;
  brokenLinks: number;
  validImages: number;
  brokenImages: number;
  validPrices: number;
  invalidPrices: number;
  failures: {
    brand: string;
    title: string;
    url: string;
    imageUrl: string;
    reason: string;
  }[];
}

async function verifyItem(deal: any): Promise<{ linkOk: boolean; imgOk: boolean; priceOk: boolean; reason?: string }> {
  let linkOk = false;
  let imgOk = false;
  let priceOk = false;
  const reasons: string[] = [];

  // 1. Verify Price
  if (deal.salePrice > 0 && deal.originalPrice >= deal.salePrice && deal.discountPercentage > 0) {
    priceOk = true;
  } else {
    reasons.push(`Price anomaly (sale: ${deal.salePrice}, orig: ${deal.originalPrice}, disc: ${deal.discountPercentage}%)`);
  }

  // 2. Verify Product Link
  try {
    const linkRes = await axios.get(deal.productUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });
    linkOk = linkRes.status >= 200 && linkRes.status < 400;
  } catch (err: any) {
    linkOk = false;
    reasons.push(`Broken Product URL (${err?.response?.status || err?.code || err?.message})`);
  }

  // 3. Verify Image URL
  try {
    if (deal.primaryImageUrl.includes('unsplash.com') || deal.primaryImageUrl.includes('placeholder')) {
      imgOk = false;
      reasons.push('Image is placeholder/stock photo');
    } else {
      const imgRes = await axios.get(deal.primaryImageUrl, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
      });
      const rawContentType = imgRes.headers['content-type'];
      const contentType = typeof rawContentType === 'string' ? rawContentType : String(rawContentType || '');
      imgOk = imgRes.status === 200 && (contentType.startsWith('image/') || contentType.includes('octet-stream'));
      if (!imgOk) {
        reasons.push(`Image invalid content-type: ${contentType}`);
      }
    }
  } catch (err: any) {
    imgOk = false;
    reasons.push(`Broken Image URL (${err?.response?.status || err?.code || err?.message})`);
  }

  return {
    linkOk,
    imgOk,
    priceOk,
    reason: reasons.join('; '),
  };
}

async function main() {
  console.log('========================================================================');
  console.log('🔍 BazaarPulse Quality Assurance: Link, Image & Data Verification');
  console.log('========================================================================\n');

  const targetBrand = process.argv[2];
  const sampleLimit = parseInt(process.argv[3] || '10', 10);

  const whereClause: any = { inStock: true, discountPercentage: { gt: 0 } };
  if (targetBrand) {
    whereClause.brand = { slug: targetBrand };
  }

  const sampleDeals = await prisma.product.findMany({
    where: whereClause,
    take: sampleLimit,
    orderBy: { scrapedAt: 'desc' },
    include: { brand: true },
  });

  if (sampleDeals.length === 0) {
    console.log('⚠️ No active scraped deals found in database to verify.');
    await prisma.$disconnect();
    return;
  }

  console.log(`Auditing a sample of ${sampleDeals.length} active deals...\n`);

  const stats: VerificationStats = {
    totalChecked: sampleDeals.length,
    validLinks: 0,
    brokenLinks: 0,
    validImages: 0,
    brokenImages: 0,
    validPrices: 0,
    invalidPrices: 0,
    failures: [],
  };

  for (let i = 0; i < sampleDeals.length; i++) {
    const deal = sampleDeals[i];
    process.stdout.write(`[${i + 1}/${sampleDeals.length}] Checking "${deal.title.substring(0, 32)}..." `);

    const result = await verifyItem(deal);

    if (result.linkOk) stats.validLinks++;
    else stats.brokenLinks++;

    if (result.imgOk) stats.validImages++;
    else stats.brokenImages++;

    if (result.priceOk) stats.validPrices++;
    else stats.invalidPrices++;

    if (result.linkOk && result.imgOk && result.priceOk) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL -> ${result.reason}`);
      stats.failures.push({
        brand: deal.brand.name,
        title: deal.title,
        url: deal.productUrl,
        imageUrl: deal.primaryImageUrl,
        reason: result.reason || 'Unknown',
      });
    }
  }

  console.log('\n=================== Verification Report ===================');
  console.log(`Total Products Tested: ${stats.totalChecked}`);
  console.log(`Product Links (200 OK): ${stats.validLinks}/${stats.totalChecked} (${Math.round((stats.validLinks / stats.totalChecked) * 100)}%)`);
  console.log(`Valid Real Images:      ${stats.validImages}/${stats.totalChecked} (${Math.round((stats.validImages / stats.totalChecked) * 100)}%)`);
  console.log(`Valid Prices:           ${stats.validPrices}/${stats.totalChecked} (${Math.round((stats.validPrices / stats.totalChecked) * 100)}%)`);
  console.log('===========================================================\n');

  if (stats.failures.length > 0) {
    console.log('Detailed Failures:');
    stats.failures.forEach((f) => {
      console.log(`• [${f.brand}] ${f.title}`);
      console.log(`  Reason: ${f.reason}`);
      console.log(`  Link:   ${f.url}`);
      console.log(`  Image:  ${f.imageUrl}\n`);
    });
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Audit Error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
