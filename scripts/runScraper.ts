import { prisma } from '../src/lib/db';
import { runScraperPipeline } from '../src/pipeline/runner';

async function main() {
  console.log('====================================================');
  console.log('⚡ BazaarPulse Pipeline: Ingestion & Change Detector');
  console.log('====================================================\n');

  const targetBrand = process.argv[2];
  if (targetBrand) {
    console.log(`Targeting single brand: ${targetBrand}\n`);
  } else {
    console.log('Scraping all configured Pakistani fashion brands...\n');
  }

  const result = await runScraperPipeline(prisma, targetBrand);

  console.log('\n================ Pipeline Report ===================');
  console.log(`Brands Processed: ${result.totalBrandsProcessed}`);
  console.log(`Deals Found:      ${result.totalDealsFound}`);
  console.log(`New Deals Added:  ${result.totalNewDeals}`);
  console.log(`Deals Updated:    ${result.totalUpdatedDeals}`);
  console.log(`Price Drops/Diff: ${result.totalPriceChanges}`);
  console.log(`Total Time:       ${result.durationSeconds}s`);
  console.log('====================================================\n');

  if (result.errors.length > 0) {
    console.log('Errors encountered:');
    result.errors.forEach((e) => console.log(` - ${e.brand}: ${e.error}`));
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Fatal Pipeline Error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
