import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting BazaarPulse Automated Integration & API Test Suite...\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err?.message || err);
      failed++;
    }
  }

  // 1. Stats Endpoint
  await test('GET /api/stats returns aggregator KPIs', async () => {
    const res = await axios.get(`${BASE_URL}/api/stats`);
    if (!res.data.success) throw new Error('API success false');
    const { totalActiveDeals, averageDiscount, brandsMonitoredCount } = res.data.data;
    if (totalActiveDeals <= 0) throw new Error('No active deals');
    if (averageDiscount < 30) throw new Error('Average discount unexpected');
    if (brandsMonitoredCount < 5) throw new Error('Brands count too low');
    console.log(`   → Active Deals: ${totalActiveDeals}, Avg Off: ${averageDiscount}%, Brands: ${brandsMonitoredCount}`);
  });

  // 2. Brands Endpoint
  await test('GET /api/brands returns full brand list with deal counts', async () => {
    const res = await axios.get(`${BASE_URL}/api/brands`);
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Invalid brands response');
    if (res.data.data.length < 8) throw new Error('Expected at least 8 brands');
    const sapphire = res.data.data.find((b: any) => b.slug === 'sapphire');
    if (!sapphire) throw new Error('Sapphire brand not found');
    console.log(`   → Found ${res.data.data.length} brands. Sapphire has ${sapphire.activeDealsCount} active deals.`);
  });

  // 3. Sales Events Endpoint
  await test('GET /api/sales returns active campaigns', async () => {
    const res = await axios.get(`${BASE_URL}/api/sales`);
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Invalid sales response');
    if (res.data.data.length === 0) throw new Error('No sales campaigns returned');
    console.log(`   → Found ${res.data.data.length} active promotional campaigns.`);
  });

  // 4. Products Search & Faceted Filter
  await test('GET /api/products?gender=WOMEN&minDiscount=50 filters correctly', async () => {
    const res = await axios.get(`${BASE_URL}/api/products?gender=WOMEN&minDiscount=50`);
    if (!res.data.success) throw new Error('Invalid products response');
    const items = res.data.data;
    if (items.length === 0) throw new Error('Expected filtered products');
    for (const item of items) {
      if (item.gender !== 'WOMEN') throw new Error(`Wrong gender: ${item.gender}`);
      if (item.discountPercentage < 50) throw new Error(`Discount too low: ${item.discountPercentage}%`);
    }
    console.log(`   → Returned ${items.length} Women deals with >= 50% discount.`);
  });

  // 5. Keyword Full-Text Search
  await test('GET /api/products?search=Lawn returns lawn items', async () => {
    const res = await axios.get(`${BASE_URL}/api/products?search=Lawn`);
    if (!res.data.success) throw new Error('Invalid search response');
    if (res.data.data.length === 0) throw new Error('No items found for "Lawn"');
    console.log(`   → Search "Lawn" returned ${res.data.data.length} matching products.`);
  });

  // 6. Single Product Detail & Price History
  await test('GET /api/products/[id] returns detail with price history timeline', async () => {
    const listRes = await axios.get(`${BASE_URL}/api/products?limit=1`);
    const productId = listRes.data.data[0].id;
    const detailRes = await axios.get(`${BASE_URL}/api/products/${productId}`);
    if (!detailRes.data.success) throw new Error('Failed to fetch detail');
    const prod = detailRes.data.data;
    if (!prod.priceHistory || prod.priceHistory.length === 0) throw new Error('No price history attached');
    console.log(`   → Product "${prod.title}" has ${prod.priceHistory.length} price timeline snapshots.`);
  });

  // 7. HTML Homepage Load
  await test('GET / returns HTML page with BazaarPulse elements', async () => {
    const res = await axios.get(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.data.includes('Bazaar') && !res.data.includes('Pulse')) throw new Error('Missing branding in HTML');
    console.log(`   → Homepage HTML loaded successfully (${res.data.length} bytes).`);
  });

  console.log(`\n================ Summary ================`);
  console.log(`Passed: ${passed} / ${passed + failed}`);
  console.log(`Failed: ${failed}`);
  console.log(`=========================================\n`);
}

runTests().catch(console.error);
