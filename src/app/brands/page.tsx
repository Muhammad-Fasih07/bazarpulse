'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandInfo } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { Store, Search, ExternalLink, ArrowRight, Sparkles, Tag } from 'lucide-react';

export default function BrandsDirectoryPage() {
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (data.success) setBrands(data.data);
      } catch (e) {
        console.error('Failed to load brands:', e);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-brand-emerald selection:text-black">
      <Header />

      {/* Directory Hero Header */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>BazaarPulse</span>
            <span>/</span>
            <span className="text-emerald-700">Brands Directory</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Pakistani Brands Directory
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore real-time sale inventories and discounts across 32+ Pakistani retail brands.
              </p>
            </div>

            {/* In-page Brand Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands (e.g. Sapphire, Stylo)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-600 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-white border border-slate-200 skeleton-shimmer" />
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Store className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-900">
              No brand found matching "{search}"
            </h3>
            <p className="text-xs text-slate-500">
              Try searching for Sapphire, Khaadi, Outfitters, Stylo, or Limelight.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 flex flex-col justify-between items-center text-center transition-all duration-200 shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-full flex justify-end">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {brand.activeDealsCount} Deals
                  </span>
                </div>

                <div className="my-3 flex flex-col items-center">
                  <BrandLogo
                    name={brand.name}
                    slug={brand.slug}
                    fallbackUrl={brand.logoUrl}
                    size="lg"
                    className="mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-display font-black text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    {brand.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    {brand.platform}
                  </span>
                </div>

                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white text-[11px] font-extrabold transition text-center"
                  >
                    View Deals
                  </Link>
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    title={`Visit ${brand.name} official site`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
