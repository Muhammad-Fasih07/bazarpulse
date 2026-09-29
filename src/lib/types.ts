export type Gender = 'ALL' | 'WOMEN' | 'MEN' | 'KIDS' | 'UNISEX';

export type Category = 
  | 'ALL'
  | 'Unstitched'
  | 'Ready to Wear'
  | 'Kurta'
  | 'Western'
  | 'Bottoms'
  | 'Footwear'
  | 'Kids & Infants'
  | 'Accessories & Fragrances'
  | 'Winter Wear';

export type SortOption = 
  | 'discount_desc'
  | 'price_asc'
  | 'price_desc'
  | 'savings_desc'
  | 'newest';

export interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  websiteUrl: string;
  platform: string;
  productsEndpoint?: string | null;
  saleEndpoint?: string | null;
  isFeatured: boolean;
  activeDealsCount: number;
}

export interface ProductItem {
  id: string;
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    websiteUrl: string;
  };
  externalId?: string | null;
  title: string;
  slug: string;
  handle?: string | null;
  description?: string | null;
  category: string;
  subCategory?: string | null;
  gender: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  savingsAmount: number;
  currency: string;
  inStock: boolean;
  inventoryQuantity?: number | null;
  productUrl: string;
  primaryImageUrl: string;
  imageGallery?: string | null;
  sizesAvailable?: string | null;
  fabric?: string | null;
  tags?: string | null;
  isHotDeal: boolean;
  isTrending: boolean;
  scrapedAt: string | Date;
  priceHistory?: PriceHistoryItem[];
}

export interface PriceHistoryItem {
  id: string;
  productId: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  recordedAt: string | Date;
}

export interface SaleEventItem {
  id: string;
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    websiteUrl?: string;
  };
  title: string;
  description?: string | null;
  discountUpTo: number;
  badgeText?: string | null;
  bannerUrl?: string | null;
  saleUrl?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isActive: boolean;
}

export interface ScrapeLogItem {
  id: string;
  brandId?: string | null;
  brandName?: string | null;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  itemsScraped: number;
  itemsDiscounted: number;
  durationMs: number;
  error?: string | null;
  startedAt: string | Date;
  completedAt?: string | Date | null;
}

export interface FilterState {
  search: string;
  gender: Gender;
  brands: string[];
  category: string;
  minDiscount: number;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sort: SortOption;
  page: number;
  limit: number;
}

export type ProductDeal = ProductItem;
export type PaginationMeta = ProductsResponse['pagination'];

export interface ProductsResponse {
  success: boolean;
  data: ProductItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    categories: { name: string; count: number }[];
    genders: { name: string; count: number }[];
    minPrice: number;
    maxPrice: number;
  };
}

export interface AggregatorStats {
  totalActiveDeals: number;
  averageDiscount: number;
  maxDiscount: number;
  totalSavingsPkr: number;
  brandsMonitoredCount: number;
  lastScrapedAt: string | null;
  topBrandDiscount: {
    brandName: string;
    discountPercentage: number;
  } | null;
}
