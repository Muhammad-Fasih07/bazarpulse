'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductDeal, BrandInfo } from '@/lib/types';
import { Header } from '@/components/Header';
import { DealCard } from '@/components/DealCard';
import { PriceHistoryModal } from '@/components/PriceHistoryModal';
import { SavedDealsDrawer } from '@/components/SavedDealsDrawer';
import { Footer } from '@/components/Footer';
import { ExternalLink, ArrowLeft, Tag, Flame, ShoppingBag } from 'lucide-react';

export default function SingleBrandPage() {
  const params = useParams();
  const brandSlug = params?.slug as string;

  const [products, setProducts] = useState<ProductDeal[]>([]);
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductDeal | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Wishlist
  const [savedDeals, setSavedDeals] = useState<ProductDeal[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bazaarpulse_saved_deals');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedDeals(parsed);
        setSavedIds(new Set(parsed.map((p: any) => p.id)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleSave = (deal: ProductDeal) => {
    setSavedDeals((prev) => {
      let updated: ProductDeal[];
      if (prev.some((p) => p.id === deal.id)) {
        updated = prev.filter((p) => p.id !== deal.id);
      } else {
        updated = [deal, ...prev];
      }
      localStorage.setItem('bazaarpulse_saved_deals', JSON.stringify(updated));
      setSavedIds(new Set(updated.map((p) => p.id)));
      return updated;
    });
  };

  useEffect(() => {
    async function loadBrandDeals() {
      if (!brandSlug) return;
      setLoading(true);
      try {
        const [prodRes, brandsRes] = await Promise.all([
          fetch(`/api/products?brand=${brandSlug}&limit=40`),
          fetch('/api/brands'),
        ]);

        const [prodData, brandsData] = await Promise.all([
          prodRes.json(),
          brandsRes.json(),
        ]);

        if (prodData.success) {
          setProducts(prodData.data);
        }
        if (brandsData.success) {
          const matched = brandsData.data.find((b: BrandInfo) => b.slug === brandSlug);
          if (matched) setBrand(matched);
        }
      } catch (err) {
        console.error('Failed to load brand deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrandDeals();
  }, [brandSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-brand-emerald selection:text-black">
      <Header
        savedCount={savedDeals.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* Brand Hero Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Brands</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              {brand?.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand?.name || brandSlug}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xl text-slate-600">
                  {brandSlug?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {brand?.name || brandSlug} Sales & Discounts
                </h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    {products.length} Active Deals Aggregated
                  </span>
                  <span>•</span>
                  <span className="capitalize">{brand?.platform || 'Shopify'} Platform</span>
                </div>
              </div>
            </div>

            {brand?.websiteUrl && (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition self-start sm:self-auto"
              >
                <span>Visit Official Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white border border-slate-200 skeleton-shimmer" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-900">
              No live discounted items currently found for {brand?.name || brandSlug}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our scraper runs every few hours. Check back soon or visit their official website directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isSaved={savedIds.has(deal.id)}
                onToggleSave={handleToggleSave}
                onOpenPriceHistory={(d) => setSelectedProduct(d)}
              />
            ))}
          </div>
        )}
      </main>

      <PriceHistoryModal
        deal={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <SavedDealsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedDeals={savedDeals}
        onRemoveSave={(id) => {
          const updated = savedDeals.filter((d) => d.id !== id);
          setSavedDeals(updated);
          setSavedIds(new Set(updated.map((p) => p.id)));
          localStorage.setItem('bazaarpulse_saved_deals', JSON.stringify(updated));
        }}
        onClearAll={() => {
          setSavedDeals([]);
          setSavedIds(new Set());
          localStorage.removeItem('bazaarpulse_saved_deals');
        }}
      />

      <Footer />
    </div>
  );
}
