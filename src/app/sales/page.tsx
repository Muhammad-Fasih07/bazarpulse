'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SaleEventItem, BrandInfo } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Flame,
  Calendar,
  ExternalLink,
  Tag,
  ArrowRight,
  Sparkles,
  Percent,
  CheckCircle2,
  Store,
} from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<SaleEventItem[]>([]);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [salesRes, brandsRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/brands'),
        ]);
        const [salesData, brandsData] = await Promise.all([
          salesRes.json(),
          brandsRes.json(),
        ]);
        if (salesData.success) setSales(salesData.data);
        if (brandsData.success) setBrands(brandsData.data);
      } catch (err) {
        console.error('Failed to load sales data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-brand-emerald selection:text-black">
      <Header />

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-b from-rose-50/60 via-white to-background border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200 shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-rose-600" />
            <span>Active Brand Promotions & Clearance Galas</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Pakistan Retail Sales & Mega Events
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover all live seasonal clearance events, mid-season galas, flat 50% discount drives, and festive drops across top Pakistani retailers.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-12">
        {/* Sales Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                Current Active Sales ({sales.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-white border border-slate-200 skeleton-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="group relative rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-xs hover:shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Brand Logo Presentation Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    {/* Brand Tag Top-Left */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs text-white">
                      <Store className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold tracking-tight">
                        {sale.brand.name}
                      </span>
                    </div>

                    {/* Discount Badge Top-Right */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>Up to {sale.discountUpTo}% OFF</span>
                      </span>
                    </div>

                    {/* Prominent Official Brand Logo Display */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                      <BrandLogo
                        name={sale.brand.name}
                        slug={sale.brand.slug}
                        fallbackUrl={sale.brand.logoUrl}
                        size="xl"
                        className="bg-white/95 p-3 rounded-2xl shadow-lg border border-white/40"
                      />
                      <span className="text-white font-display font-black text-lg sm:text-xl tracking-tight mt-1 drop-shadow-sm">
                        {sale.brand.name}
                      </span>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-emerald-500/20 blur-2xl pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      {sale.badgeText && (
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-2">
                          {sale.badgeText}
                        </span>
                      )}
                      <h3 className="font-display font-black text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {sale.title}
                      </h3>
                      {sale.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {sale.description}
                        </p>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/deals?brand=${sale.brand.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                      >
                        <span>View Aggregated Deals</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={sale.saleUrl || sale.brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition"
                      >
                        <span>Visit Sale</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Brands Grid Strip */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-black text-slate-900">
                Browse Brand Specific Sales
              </h3>
              <p className="text-xs text-slate-500">
                Jump directly to curated discount feeds for your favorite Pakistani label.
              </p>
            </div>
            <Link
              href="/brands"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View all brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {brands.slice(0, 18).map((b) => (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition group"
              >
                <BrandLogo
                  name={b.name}
                  slug={b.slug}
                  fallbackUrl={b.logoUrl}
                  size="sm"
                  className="rounded-xl border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                    {b.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 block font-medium">
                    {b.activeDealsCount} deals
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
