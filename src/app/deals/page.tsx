'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import {
  FilterState,
  ProductItem,
  BrandInfo,
  AggregatorStats,
} from '@/lib/types';
import { Header } from '@/components/Header';
import { AudiencePillBar } from '@/components/AudiencePillBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { DealGrid } from '@/components/DealGrid';
import { PriceHistoryModal } from '@/components/PriceHistoryModal';
import { SavedDealsDrawer } from '@/components/SavedDealsDrawer';
import { ScraperControlModal } from '@/components/ScraperControlModal';
import { Footer } from '@/components/Footer';
import { X, SlidersHorizontal, Sparkles } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  gender: 'ALL',
  brands: [],
  category: 'ALL',
  minDiscount: 0,
  minPrice: 0,
  maxPrice: 25000,
  inStockOnly: true,
  sort: 'discount_desc',
  page: 1,
  limit: 16,
};

export default function DealsPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [stats, setStats] = useState<AggregatorStats | null>(null);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductForHistory, setSelectedProductForHistory] =
    useState<ProductItem | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Saved / Bookmarked Deals
  const [savedDeals, setSavedDeals] = useState<ProductItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

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

  const handleToggleSave = useCallback((product: ProductItem) => {
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
  }, []);

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

  const fetchMetadata = useCallback(async () => {
    try {
      const [brandsRes, statsRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/stats'),
      ]);
      const [brandsData, statsData] = await Promise.all([
        brandsRes.json(),
        statsRes.json(),
      ]);

      if (brandsData.success) setBrands(brandsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Failed to fetch initial metadata:', err);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.gender && filters.gender !== 'ALL') params.set('gender', filters.gender);
      if (filters.category && filters.category !== 'ALL') params.set('category', filters.category);
      if (filters.brands.length > 0) params.set('brand', filters.brands.join(','));
      if (filters.minDiscount > 0) params.set('minDiscount', String(filters.minDiscount));
      if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice < 25000) params.set('maxPrice', String(filters.maxPrice));
      if (!filters.inStockOnly) params.set('inStock', 'false');
      params.set('sort', filters.sort);
      params.set('page', String(filters.page));
      params.set('limit', String(filters.limit));

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setProducts(json.data);
        setPagination(json.pagination);
        if (json.filters?.categories) {
          setCategories(json.filters.categories);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (q: string) => {
    setFilters((prev) => ({ ...prev, search: q, page: 1 }));
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.gender !== 'ALL' ? 1 : 0) +
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.minDiscount > 0 ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice > 0 || filters.maxPrice < 25000 ? 1 : 0) +
    (!filters.inStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-brand-emerald selection:text-black">
      <Header
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        savedCount={savedDeals.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenScraperModal={() => setIsScraperModalOpen(true)}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        stats={stats}
        activeFilterCount={activeFilterCount}
      />

      {/* Target Audience Quick Bar */}
      <AudiencePillBar filters={filters} onFilterChange={handleFilterUpdate} />

      {/* Page Title & Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>BazaarPulse</span>
              <span>/</span>
              <span className="text-emerald-700">Deals Finder</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Faceted Deals Search Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find live discounted clothing across 32+ Pakistani retail brands.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              {pagination.total} Live Deals Found
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onResetFilters={handleResetFilters}
              brands={brands}
              categories={categories}
            />
          </div>

          {/* Deals Grid View */}
          <div className="lg:col-span-3">
            <DealGrid
              deals={products}
              loading={loading}
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onResetFilters={handleResetFilters}
              pagination={pagination}
              onOpenPriceHistory={(deal) => setSelectedProductForHistory(deal)}
              savedIds={Array.from(savedIds)}
              onToggleSave={handleToggleSave}
            />
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <PriceHistoryModal
        deal={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      <SavedDealsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedDeals={savedDeals}
        onRemoveSave={handleRemoveDeal}
        onClearAll={handleClearAllSaved}
      />

      <ScraperControlModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
        onScrapeCompleted={() => {
          fetchMetadata();
          fetchProducts();
        }}
      />

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm font-display">
                  Filters & Sorting
                </span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterUpdate}
                onResetFilters={handleResetFilters}
                brands={brands}
                categories={categories}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
