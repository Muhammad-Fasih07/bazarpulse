'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Layers,
  Heart,
  Store,
  Clock,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

const TOP_RETAILERS = [
  { name: 'Sapphire', slug: 'sapphire' },
  { name: 'Outfitters', slug: 'outfitters' },
  { name: 'Khaadi', slug: 'khaadi' },
  { name: 'J. Junaid Jamshed', slug: 'j-dot' },
  { name: 'Ideas Gul Ahmed', slug: 'gul-ahmed' },
  { name: 'Limelight', slug: 'limelight' },
  { name: 'Alkaram Studio', slug: 'alkaram' },
  { name: 'Stylo', slug: 'stylo' },
  { name: 'Sana Safinaz', slug: 'sana-safinaz' },
  { name: 'Edenrobe', slug: 'edenrobe' },
  { name: 'Borjan', slug: 'borjan' },
  { name: 'Breakout', slug: 'breakout' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/90 bg-slate-950 text-slate-300 mt-20">
      {/* Top Value Proposition Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Retail Crawlers</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated continuous sync with official Pakistani Shopify catalogs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Price Drops</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic PKR variant pricing tracking actual in-stock discounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Brand Store Checkout</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero markups. Complete purchase directly on the merchant's portal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1 & 2: Brand Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition">
                  Bazaar<span className="text-emerald-500">Pulse</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  The Pulse of Pakistani Fashion Sales
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              BazaarPulse is Pakistan's premier intelligent fashion sales aggregator. We eliminate the frustration of checking dozens of separate retail stores by consolidating live clearance sales, mid-season galas, and unstitched lawn drops in real time.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingestion Active
              </span>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-display">
              Explore Bazaar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-slate-400 hover:text-emerald-400 transition">
                  Deals Search Engine
                </Link>
              </li>
              <li>
                <Link href="/sales" className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Sales & Megadrops</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500 text-white">LIVE</span>
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-slate-400 hover:text-emerald-400 transition">
                  All 32+ Pakistani Brands
                </Link>
              </li>
              <li>
                <Link href="/deals?sort=discount_desc" className="text-slate-400 hover:text-emerald-400 transition">
                  Deep Steals (50%+ OFF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Top Retailers Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-display">
              Popular Retailers
            </h4>
            <ul className="space-y-2 text-xs">
              {TOP_RETAILERS.slice(0, 5).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-slate-400 hover:text-emerald-400 transition flex items-center justify-between"
                  >
                    <span>{brand.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-600" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brands" className="text-emerald-400 font-bold hover:underline">
                  + View 27 More Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-display">
              Sales by Category
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/deals?category=Unstitched" className="text-slate-400 hover:text-emerald-400 transition">
                  Unstitched 3-Piece Lawn
                </Link>
              </li>
              <li>
                <Link href="/deals?category=Ready+to+Wear" className="text-slate-400 hover:text-emerald-400 transition">
                  Pret & Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link href="/deals?category=Kurta" className="text-slate-400 hover:text-emerald-400 transition">
                  Men Kurta & Shalwar
                </Link>
              </li>
              <li>
                <Link href="/deals?category=Footwear" className="text-slate-400 hover:text-emerald-400 transition">
                  Khussa & Footwear
                </Link>
              </li>
              <li>
                <Link href="/deals?category=Western" className="text-slate-400 hover:text-emerald-400 transition">
                  Western Denim & Tops
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand Badges Showcase Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
            <span className="text-slate-500 font-bold">Monitored Labels:</span>
            {TOP_RETAILERS.map((b, i) => (
              <React.Fragment key={b.slug}>
                <Link
                  href={`/brands/${b.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {b.name}
                </Link>
                {i < TOP_RETAILERS.length - 1 && <span className="text-slate-700">•</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right shrink-0">
            Built for Pakistani Fashion Shoppers
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} BazaarPulse. All trademarks, brand names, and logos belong to their respective Pakistani retail owners.
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            Real-Time Shopify Crawlers • Zero Markups
          </p>
        </div>
      </div>
    </footer>
  );
};
