import { Gender, Category } from '../lib/types';
import { BrandScraperConfig } from './brandConfigs';

export interface NormalizedProductPayload {
  externalId: string;
  title: string;
  slug: string;
  handle: string;
  description: string;
  category: Category;
  subCategory: string;
  gender: Gender;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  savingsAmount: number;
  currency: string;
  inStock: boolean;
  inventoryQuantity: number;
  productUrl: string;
  primaryImageUrl: string;
  imageGallery: string[];
  sizesAvailable: string[];
  fabric: string;
  tags: string[];
  isHotDeal: boolean;
  isTrending: boolean;
}

export function normalizeShopifyProduct(
  raw: any,
  brandConfig: BrandScraperConfig
): NormalizedProductPayload | null {
  if (!raw || !raw.title) return null;

  const title: string = (raw.title || '').trim();
  const handle: string = (raw.handle || '').trim();
  const description: string = (raw.body_html || raw.description || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Combine title, handle, tags, product_type for deep taxonomy inference
  const rawTags: string[] = Array.isArray(raw.tags)
    ? raw.tags
    : typeof raw.tags === 'string'
    ? raw.tags.split(',').map((t: string) => t.trim())
    : [];

  const productType: string = (raw.product_type || '').toLowerCase();
  const combinedContext = `${title} ${handle} ${productType} ${rawTags.join(' ')}`.toLowerCase();

  // 1. Gender Inference
  let gender: Gender = inferGender(combinedContext, brandConfig);

  // 2. Category Inference
  const { category, subCategory } = inferCategoryAndSubcategory(combinedContext, productType, title);

  // 3. Price and Variant normalization
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  if (variants.length === 0) return null;

  let minSalePrice = Infinity;
  let correspondingOriginalPrice = 0;
  let hasInStockVariant = false;
  let totalInventory = 0;
  const availableSizes: string[] = [];

  // First pass: look for available/in-stock variants
  // Second pass fallback: any variant if none in stock
  let inStockMinPrice = Infinity;
  let inStockOrigPrice = 0;
  let overallMinPrice = Infinity;
  let overallOrigPrice = 0;

  for (const variant of variants) {
    let rawPrice = parseFloat(variant.price);
    let rawComparePrice = variant.compare_at_price ? parseFloat(variant.compare_at_price) : 0;

    // Shopify .js endpoint returns prices in cents (e.g. 139000 for 1390 PKR), while /products.json returns "1390.00"
    if (rawPrice > 50000 && !String(variant.price).includes('.')) {
      rawPrice = rawPrice / 100;
      if (rawComparePrice > 0) rawComparePrice = rawComparePrice / 100;
    }

    if (isNaN(rawPrice) || rawPrice <= 0) continue;

    const originalP = rawComparePrice > rawPrice ? rawComparePrice : rawPrice;
    const isAvailable = variant.available !== false && (variant.inventory_quantity === undefined || variant.inventory_quantity > 0);

    if (isAvailable) {
      hasInStockVariant = true;
      if (variant.title && variant.title !== 'Default Title') {
        availableSizes.push(variant.title);
      }
      if (rawPrice < inStockMinPrice) {
        inStockMinPrice = rawPrice;
        inStockOrigPrice = originalP;
      }
    }

    if (variant.inventory_quantity && variant.inventory_quantity > 0) {
      totalInventory += variant.inventory_quantity;
    }

    if (rawPrice < overallMinPrice) {
      overallMinPrice = rawPrice;
      overallOrigPrice = originalP;
    }
  }

  // Use in-stock pricing if available, else overall
  if (hasInStockVariant && inStockMinPrice !== Infinity) {
    minSalePrice = inStockMinPrice;
    correspondingOriginalPrice = inStockOrigPrice;
  } else {
    minSalePrice = overallMinPrice;
    correspondingOriginalPrice = overallOrigPrice;
  }

  if (minSalePrice === Infinity) return null;

  // If no compare_at_price was provided on variant, check if sale was indicated
  if (correspondingOriginalPrice <= minSalePrice) {
    // Check if title or tags have discount hints or if this is standard full price
    correspondingOriginalPrice = minSalePrice;
  }

  const discountPercentage = correspondingOriginalPrice > minSalePrice
    ? Math.round(((correspondingOriginalPrice - minSalePrice) / correspondingOriginalPrice) * 100)
    : 0;

  const savingsAmount = Math.max(0, correspondingOriginalPrice - minSalePrice);

  // Images
  const rawImages = Array.isArray(raw.images) ? raw.images : [];
  const imageUrls: string[] = rawImages
    .map((img: any) => (typeof img === 'string' ? img : img?.src || ''))
    .filter(Boolean);

  const primaryImageUrl = imageUrls[0] || (raw.image ? raw.image.src : '') || 
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80';

  // Direct Product URL
  const productUrl = raw.url
    ? (raw.url.startsWith('http') ? raw.url : `${brandConfig.websiteUrl}${raw.url.startsWith('/') ? '' : '/'}${raw.url}`)
    : `${brandConfig.websiteUrl}/products/${handle}`;

  // Fabric inference
  const fabric = inferFabric(combinedContext);

  // Hot Deal & Trending flags
  const isHotDeal = discountPercentage >= 50;
  const isTrending = discountPercentage >= 40 || rawTags.some(t => t.toLowerCase().includes('bestseller') || t.toLowerCase().includes('trending'));

  // Slug generation
  const slug = `${brandConfig.slug}-${handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return {
    externalId: String(raw.id || handle || slug),
    title,
    slug,
    handle,
    description,
    category,
    subCategory,
    gender,
    originalPrice: Math.round(correspondingOriginalPrice),
    salePrice: Math.round(minSalePrice),
    discountPercentage,
    savingsAmount: Math.round(savingsAmount),
    currency: 'PKR',
    inStock: hasInStockVariant,
    inventoryQuantity: totalInventory || 10,
    productUrl,
    primaryImageUrl,
    imageGallery: imageUrls.slice(1, 6),
    sizesAvailable: Array.from(new Set(availableSizes)).slice(0, 8),
    fabric,
    tags: rawTags.slice(0, 10),
    isHotDeal,
    isTrending,
  };
}

export function inferGender(context: string, brandConfig: BrandScraperConfig): Gender {
  if (brandConfig.defaultGender) return brandConfig.defaultGender;

  // Kids matching
  if (
    context.includes('kid') ||
    context.includes('child') ||
    context.includes('infant') ||
    context.includes('baby') ||
    context.includes('boy') ||
    context.includes('girl') ||
    context.includes('toddler') ||
    context.includes('junior') ||
    context.includes('bachaa')
  ) {
    return 'KIDS';
  }

  // Men matching
  if (
    context.includes(' men ') ||
    context.includes('men-') ||
    context.includes('mens') ||
    context.includes("men's") ||
    context.includes('man ') ||
    context.includes('waistcoat') ||
    context.includes('kameez shalwar') ||
    context.includes('kurta men') ||
    context.includes('polo shirt')
  ) {
    return 'MEN';
  }

  // Women matching
  if (
    context.includes('women') ||
    context.includes('woman') ||
    context.includes('ladies') ||
    context.includes('unstitched') ||
    context.includes('lawn') ||
    context.includes('kurti') ||
    context.includes('pret') ||
    context.includes('dupatta') ||
    context.includes('shawl') ||
    context.includes('frock') ||
    context.includes('co-ord') ||
    context.includes('kaftan')
  ) {
    return 'WOMEN';
  }

  return 'UNISEX';
}

export function inferCategoryAndSubcategory(
  context: string,
  productType: string,
  title: string
): { category: Category; subCategory: string } {
  // 1. Unstitched
  if (
    context.includes('unstitched') ||
    context.includes('3 piece') ||
    context.includes('3pc') ||
    context.includes('2 piece') ||
    context.includes('2pc') ||
    context.includes('lawn unstitched') ||
    context.includes('embroidered lawn')
  ) {
    let sub = '3-Piece Lawn';
    if (context.includes('2 piece') || context.includes('2pc')) sub = '2-Piece Suit';
    if (context.includes('1 piece') || context.includes('1pc')) sub = '1-Piece Fabric';
    if (context.includes('chiffon') || context.includes('silk')) sub = 'Luxury Unstitched';
    if (context.includes('khaddar') || context.includes('linen')) sub = 'Winter Unstitched';
    return { category: 'Unstitched', subCategory: sub };
  }

  // 2. Kids & Infants
  if (
    context.includes('kid') ||
    context.includes('junior') ||
    context.includes('infant') ||
    context.includes('baby') ||
    context.includes('romper') ||
    context.includes('toddler')
  ) {
    let sub = 'Kids Apparel';
    if (context.includes('romper') || context.includes('infant')) sub = 'Infants & Toddlers';
    if (context.includes('boy')) sub = 'Boys Collection';
    if (context.includes('girl')) sub = 'Girls Collection';
    return { category: 'Kids & Infants', subCategory: sub };
  }

  // 3. Footwear
  if (
    context.includes('shoe') ||
    context.includes('khussa') ||
    context.includes('sandal') ||
    context.includes('sneaker') ||
    context.includes('slippers') ||
    context.includes('heel') ||
    context.includes('flats') ||
    context.includes('footwear')
  ) {
    let sub = 'Footwear';
    if (context.includes('khussa')) sub = 'Handcrafted Khussa';
    if (context.includes('sandal') || context.includes('heel')) sub = 'Women Sandals';
    if (context.includes('sneaker')) sub = 'Sneakers';
    return { category: 'Footwear', subCategory: sub };
  }

  // 4. Fragrances & Accessories
  if (
    context.includes('perfume') ||
    context.includes('fragrance') ||
    context.includes('attar') ||
    context.includes('eau de parfum') ||
    context.includes('body spray') ||
    context.includes('bag') ||
    context.includes('wallet') ||
    context.includes('clutch') ||
    context.includes('jewellery') ||
    context.includes('scarf')
  ) {
    let sub = 'Accessories';
    if (context.includes('perfume') || context.includes('fragrance') || context.includes('attar')) {
      sub = 'Fragrance / Attar';
    } else if (context.includes('bag') || context.includes('clutch')) {
      sub = 'Bags & Clutches';
    }
    return { category: 'Accessories & Fragrances', subCategory: sub };
  }

  // 5. Kurta
  if (
    context.includes('kurta') ||
    context.includes('kurti') ||
    context.includes('tunic') ||
    context.includes('kameez')
  ) {
    let sub = 'Stitched Kurta';
    if (context.includes('embroidered')) sub = 'Embroidered Kurta';
    if (context.includes('printed')) sub = 'Printed Kurta';
    if (context.includes('men')) sub = 'Men Kurta';
    return { category: 'Kurta', subCategory: sub };
  }

  // 6. Western Wear
  if (
    context.includes('tee') ||
    context.includes('t-shirt') ||
    context.includes('shirt') ||
    context.includes('hoodie') ||
    context.includes('sweatshirt') ||
    context.includes('jacket') ||
    context.includes('blazer') ||
    context.includes('polo') ||
    context.includes('top') ||
    context.includes('dress')
  ) {
    let sub = 'Western Tops';
    if (context.includes('t-shirt') || context.includes('tee')) sub = 'T-Shirts & Polos';
    if (context.includes('hoodie') || context.includes('jacket')) sub = 'Jackets & Hoodies';
    if (context.includes('shirt') && !context.includes('t-shirt')) sub = 'Casual Shirts';
    return { category: 'Western', subCategory: sub };
  }

  // 7. Bottoms
  if (
    context.includes('trouser') ||
    context.includes('jeans') ||
    context.includes('denim') ||
    context.includes('pants') ||
    context.includes('shalwar') ||
    context.includes('culotte') ||
    context.includes('tights') ||
    context.includes('shorts')
  ) {
    let sub = 'Trousers & Pants';
    if (context.includes('jeans') || context.includes('denim')) sub = 'Denim Jeans';
    if (context.includes('shalwar')) sub = 'Embroidered Shalwar';
    return { category: 'Bottoms', subCategory: sub };
  }

  // 8. Winter Wear
  if (
    context.includes('shawl') ||
    context.includes('sweater') ||
    context.includes('cardigan') ||
    context.includes('coat') ||
    context.includes('winter') ||
    context.includes('fleece')
  ) {
    return { category: 'Winter Wear', subCategory: 'Winter Collection' };
  }

  // 9. Default to Ready to Wear
  return { category: 'Ready to Wear', subCategory: 'Stitched Suit' };
}

export function inferFabric(context: string): string {
  if (context.includes('lawn')) return 'Lawn';
  if (context.includes('cotton')) return 'Cotton';
  if (context.includes('khaddar')) return 'Khaddar';
  if (context.includes('chiffon')) return 'Chiffon';
  if (context.includes('silk')) return 'Silk';
  if (context.includes('linen')) return 'Linen';
  if (context.includes('denim')) return 'Denim';
  if (context.includes('velvet')) return 'Velvet';
  if (context.includes('jacquard')) return 'Jacquard';
  if (context.includes('organza')) return 'Organza';
  if (context.includes('fleece')) return 'Fleece';
  return 'Premium Fabric';
}
