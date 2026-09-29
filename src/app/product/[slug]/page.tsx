'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductDeal } from '@/lib/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { formatPKR, formatRelativeTime } from '@/lib/formatters';
import {
  ExternalLink,
  ArrowLeft,
  Flame,
  TrendingDown,
  Calendar,
  CheckCircle2,
  XCircle,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [deal, setDeal] = useState<ProductDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (json.success && json.data) {
          const item = json.data;
          setDeal(item);
          setSelectedImage(item.primaryImageUrl);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full flex-1">
          <div className="h-96 rounded-3xl bg-white border border-slate-200 skeleton-shimmer" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 flex-1">
          <h2 className="text-2xl font-black">Product Not Found</h2>
          <p className="text-sm text-slate-500">This deal may have ended or been unlisted.</p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deals Catalog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery: string[] = deal.imageGallery ? JSON.parse(deal.imageGallery) : [];
  const allImages = [deal.primaryImageUrl, ...gallery].filter(Boolean);
  const history = deal.priceHistory || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-brand-emerald selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Deals</span>
        </Link>

        {/* 2-Column Product Detail Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              <img
                src={selectedImage || deal.primaryImageUrl}
                alt={deal.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      selectedImage === img ? 'border-emerald-600 shadow-xs' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Pricing */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/brands/${deal.brand.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-800 hover:bg-slate-200 transition mb-3"
              >
                <img
                  src={deal.brand.logoUrl}
                  alt={deal.brand.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{deal.brand.name}</span>
              </Link>
              <h1 className="font-display text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                {deal.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-semibold">
                <span className="uppercase text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {deal.gender}
                </span>
                <span>•</span>
                <span>{deal.category}</span>
                {deal.fabric && (
                  <>
                    <span>•</span>
                    <span>Fabric: {deal.fabric}</span>
                  </>
                )}
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-700 tracking-tight">
                  {formatPKR(deal.salePrice)}
                </span>
                {deal.originalPrice > deal.salePrice && (
                  <span className="text-base text-slate-400 line-through font-semibold">
                    {formatPKR(deal.originalPrice)}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  {deal.discountPercentage}% OFF
                </span>
              </div>
              {deal.savingsAmount > 0 && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  You save {formatPKR(deal.savingsAmount)} on this item
                </p>
              )}
            </div>

            {/* Merchant CTA Button */}
            <div className="space-y-3">
              <a
                href={deal.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
              >
                <span>BUY AT OFFICIAL STORE ({deal.brand.name.toUpperCase()})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Redirects safely to official brand store checkout. No markups.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price History Drops Card */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display text-lg font-black text-slate-900">
                Price Drop History Timeline
              </h3>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-xs text-slate-500 font-medium">
                    {formatRelativeTime(h.recordedAt)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-rose-600">
                      {h.discountPercentage}% OFF
                    </span>
                    <strong className="text-sm font-black text-slate-900">
                      {formatPKR(h.price)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
