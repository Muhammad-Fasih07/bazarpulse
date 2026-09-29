'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandInfo, SaleEventItem, ProductItem, AggregatorStats } from '@/lib/types';
import { Header } from '@/components/Header';
import { StatsTicker } from '@/components/StatsTicker';
import { SalesBannerCarousel } from '@/components/SalesBannerCarousel';
import { DealCard } from '@/components/DealCard';
import { PriceHistoryModal } from '@/components/PriceHistoryModal';
import { SavedDealsDrawer } from '@/components/SavedDealsDrawer';
import { ScraperControlModal } from '@/components/ScraperControlModal';
import { BrandLogo } from '@/components/BrandLogo';
import { Footer } from '@/components/Footer';
import {
  Sparkles,
  Flame,
  ArrowRight,
  TrendingDown,
  Tag,
  Store,
  Layers,
  Search,
  CheckCircle2,
  Percent,
  SlidersHorizontal,
} from 'lucide-react';

const FEATURED_CATEGORIES = [
  { name: 'Unstitched Lawn', slug: 'WOMEN', query: 'lawn', icon: '🌸', count: '1,800+ Deals' },
  { name: 'Ready To Wear', slug: 'WOMEN', query: 'pret', icon: '👗', count: '1,200+ Deals' },
  { name: 'Men Kurta & Shalwar', slug: 'MEN', query: 'kurta', icon: '👔', count: '650+ Deals' },
  { name: 'Khussa & Footwear', slug: 'FOOTWEAR', query: 'shoes', icon: '🥿', count: '450+ Deals' },
  { name: 'Western & Denim', slug: 'WESTERN', query: 'shirt', icon: '👕', count: '520+ Deals' },
  { name: 'Kids Festive', slug: 'KIDS', query: 'kids', icon: '🧸', count: '280+ Deals' },
];

export default function HomePage() {
  const router = useRouter();

  // Data states
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [salesEvents, setSalesEvents] = useState<SaleEventItem[]>([]);
  const [topSteals, setTopSteals] = useState<ProductItem[]>([]);
  const [stats, setStats] = useState<AggregatorStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search input state in Hero
  const [heroSearch, setHeroSearch] = useState('');

  // Modals & Drawers
  const [selectedProductForHistory, setSelectedProductForHistory] =
    useState<ProductItem | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState<boolean>(false);

  // Saved / Bookmarked Deals
  const [savedDeals, setSavedDeals] = useState<ProductItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load Saved Deals from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bazaarpulse_saved_deals');
      if (stored) {
        const parsed: ProductItem[] = JSON.parse(stored);
        setSavedDeals(parsed);
        setSavedIds(new Set(parsed.map((p) => p.id)));
      }
    } catch (e) {
      console.error('Failed to load saved deals:', e);
    }
  }, []);

  const handleToggleSave = (product: ProductItem) => {
    setSavedDeals((prev) => {
      let updated: ProductItem[];
      if (prev.some((p) => p.id === product.id)) {
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        updated = [product, ...prev];
      }
      try {
        localStorage.setItem('bazaarpulse_saved_deals', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist saved deals:', e);
      }
      setSavedIds(new Set(updated.map((p) => p.id)));
      return updated;
    });
  };

  const handleRemoveDeal = (id: string) => {
    const updated = savedDeals.filter((d) => d.id !== id);
    setSavedDeals(updated);
    setSavedIds(new Set(updated.map((p) => p.id)));
    localStorage.setItem('bazaarpulse_saved_deals', JSON.stringify(updated));
  };

  const handleClearAllSaved = () => {
    setSavedDeals([]);
    setSavedIds(new Set());
    localStorage.removeItem('bazaarpulse_saved_deals');
  };

  // Fetch Homepage Data
  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const [brandsRes, salesRes, statsRes, stealsRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/sales'),
          fetch('/api/stats'),
          fetch('/api/products?sort=discount_desc&limit=8&minDiscount=40'),
        ]);

        const [brandsData, salesData, statsData, stealsData] = await Promise.all([
          brandsRes.json(),
          salesRes.json(),
          statsRes.json(),
          stealsRes.json(),
        ]);

        if (brandsData?.success && Array.isArray(brandsData.data)) setBrands(brandsData.data);
        if (salesData?.success && Array.isArray(salesData.data)) setSalesEvents(salesData.data);
        if (statsData?.success) setStats(statsData.data);
        if (stealsData?.success) {
          const list = Array.isArray(stealsData.data) ? stealsData.data : (stealsData.data?.products || []);
          setTopSteals(list);
        }
      } catch (e) {
        console.error('Failed to load homepage data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/deals?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/deals');
    }
  };

  // Filter brands that currently have deals or active sales
  const brandsWithDeals = brands.filter((b) => b.activeDealsCount > 0);
  const otherBrands = brands.filter((b) => b.activeDealsCount === 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-brand-emerald selection:text-black">
      {/* Top Global Stats Ticker */}
      <StatsTicker stats={stats} loading={loading} />

      {/* Main Global Header */}
      <Header
        savedCount={savedDeals.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenScraperModal={() => setIsScraperModalOpen(true)}
      />

      <main className="flex-1 w-full">
        {/* =========================================
            1. HERO SECTION: Brand Discovery Hub
           ========================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-background border-b border-slate-200/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-100/30 via-slate-100/20 to-rose-100/20 blur-3xl pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {stats?.totalActiveDeals ? `${stats.totalActiveDeals.toLocaleString()} Live Deals Tracked` : 'Live Pakistani Retail Deals'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Every Pakistani Brand Sale.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900">
                In One Place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Stop checking dozens of brand websites. BazaarPulse continuously monitors official stores for price drops, clearance galas, and unstitched lawn discounts.
            </p>

            {/* Central Instant Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="max-w-2xl mx-auto relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-slate-200/90 focus-within:border-emerald-600 transition-all p-1.5"
            >
              <div className="pl-3.5 text-slate-400">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search deals across Khaadi, Gul Ahmed, Sapphire, Stylo, Outfitters..."
                className="w-full px-3 py-2.5 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Find Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-400">Trending Now:</span>
              {[
                { label: '3-Piece Lawn', q: '3 piece lawn' },
                { label: 'Flat 50% OFF', q: 'flat 50' },
                { label: 'Kurta', q: 'kurta' },
                { label: 'Footwear & Khussa', q: 'khussa' },
                { label: 'Summer Clearance', q: 'clearance' },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={`/deals?search=${encodeURIComponent(chip.q)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:border-slate-300"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            2. ACTIVE BRAND SALES & CAMPAIGNS
           ========================================= */}
        {salesEvents.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                    Active Brand Sales & Events
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Official limited-time promotions, mid-season sales & clearance galas
                </p>
              </div>

              <Link
                href="/sales"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>View All Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <SalesBannerCarousel
              sales={salesEvents}
              onSelectBrand={(slug) => router.push(`/brands/${slug}`)}
            />
          </section>
        )}

        {/* =========================================
            3. "BRANDS ON SALE RIGHT NOW" (Core Feature)
           ========================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                  Brands On Sale Right Now
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Browse official discounts across your favorite Pakistani brands. Click any brand to see their complete discounted catalog.
              </p>
            </div>

            <Link
              href="/brands"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 shrink-0 w-fit"
            >
              <span>Explore All {brands.length} Brands</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-white border border-slate-200 skeleton-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {brandsWithDeals.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 flex flex-col justify-between items-center text-center transition-all duration-200 shadow-2xs hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Sale Badge */}
                  <div className="w-full flex justify-end">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                      ON SALE
                    </span>
                  </div>

                  {/* Brand Avatar */}
                  <div className="relative my-2">
                    <BrandLogo
                      name={brand.name}
                      slug={brand.slug}
                      fallbackUrl={brand.logoUrl}
                      size="lg"
                      className="group-hover:scale-105 transition-all duration-300"
                    />
                  </div>

                  {/* Brand Name & Deal Count */}
                  <div className="w-full">
                    <h3 className="font-display font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {brand.name}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                      {brand.activeDealsCount.toLocaleString()} Live Deals
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="w-full mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                    <span>Shop Sale</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}

              {/* Brands without active deals, shown gracefully */}
              {otherBrands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative bg-white/70 border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between items-center text-center transition-all duration-200 opacity-80 hover:opacity-100"
                >
                  <div className="w-full flex justify-end">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                      Catalog
                    </span>
                  </div>

                  <div className="my-2">
                    <BrandLogo
                      name={brand.name}
                      slug={brand.slug}
                      fallbackUrl={brand.logoUrl}
                      size="md"
                    />
                  </div>

                  <div className="w-full">
                    <h3 className="font-display font-bold text-xs text-slate-700 truncate">
                      {brand.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Regular Store</p>
                  </div>

                  <div className="w-full mt-2 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                    View Brand
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =========================================
            4. TOP STEALS & HIGHEST DISCOUNTS
           ========================================= */}
        {(topSteals?.length || 0) > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                    Today&apos;s Deepest Steals
                  </h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Hand-picked deals with 40% to 70%+ verified price drops across lawn, pret, and accessories.
                </p>
              </div>

              <Link
                href="/deals?sort=discount_desc"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-emerald-600 px-4 py-2 rounded-xl transition-colors shadow-xs shrink-0 w-fit"
              >
                <span>View All High Discount Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {topSteals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isSaved={savedIds.has(deal.id)}
                  onToggleSave={handleToggleSave}
                  onOpenPriceHistory={(d) => setSelectedProductForHistory(d)}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================================
            5. SHOP BY POPULAR CATEGORY TILES
           ========================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Explore Popular Sales Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find exact sale collections without weeding through thousands of unrelated items.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/deals?search=${encodeURIComponent(cat.query)}`}
                className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================
            6. CALL TO ACTION: The Full Search Engine
           ========================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Granular Search Engine
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Looking for something specific with exact price filters?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Filter by minimum and maximum budget (PKR), discount depth, size availability, in-stock verification, and brand combination in our dedicated Deals Search.
              </p>
              <div className="pt-2">
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-extrabold transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Open Deals Engine & Filters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Decorative Accent */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden lg:flex items-center justify-center">
              <Percent className="w-72 h-72 text-emerald-400" />
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <PriceHistoryModal
        deal={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      <SavedDealsDrawer
        isOpen={isSavedDrawerOpen}
        savedDeals={savedDeals}
        onClose={() => setIsSavedDrawerOpen(false)}
        onRemoveSave={handleRemoveDeal}
        onClearAll={handleClearAllSaved}
      />

      <ScraperControlModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
        onScrapeCompleted={() => {
          // Re-fetch data
          window.location.reload();
        }}
      />
    </div>
  );
}
