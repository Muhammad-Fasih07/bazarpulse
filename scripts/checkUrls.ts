import { prisma } from '../src/lib/db';

async function main() {
  const products = await prisma.product.findMany({
    take: 15,
    select: {
      id: true,
      title: true,
      productUrl: true,
      brand: { select: { name: true, websiteUrl: true } }
    }
  });

  console.log('Sample Products in DB:');
  products.forEach((p) => {
    console.log(`- [${p.brand.name}] ${p.title}`);
    console.log(`  URL: ${p.productUrl}\n`);
  });

  await prisma.$disconnect();
}

main();
