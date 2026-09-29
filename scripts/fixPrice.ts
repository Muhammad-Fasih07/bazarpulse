import { prisma } from '../src/lib/db';
import axios from 'axios';
import { normalizeShopifyProduct } from '../src/pipeline/normalizer';

async function run() {
  const { data } = await axios.get('https://outfitters.com.pk/products/f0454-503.js');
  const normalized = normalizeShopifyProduct(data, {
    id: 'outfitters',
    name: 'Outfitters',
    slug: 'outfitters',
    logoUrl: '',
    websiteUrl: 'https://outfitters.com.pk',
    platform: 'SHOPIFY',
  });
  console.log('Normalized with in-stock priority:');
  console.log('Sale Price:', normalized?.salePrice);
  console.log('Original Price:', normalized?.originalPrice);
  console.log('Discount %:', normalized?.discountPercentage);

  if (normalized) {
    const res = await prisma.product.updateMany({
      where: {
        OR: [
          { handle: 'f0454-503' },
          { slug: { contains: 'f0454-503' } },
          { title: { contains: 'Basic Oxford Shirt' } },
        ],
      },
      data: {
        salePrice: normalized.salePrice,
        originalPrice: normalized.originalPrice,
        discountPercentage: normalized.discountPercentage,
        savingsAmount: normalized.savingsAmount,
      },
    });
    console.log('Updated in DB:', res.count);
  }
  await prisma.$disconnect();
}
run();
