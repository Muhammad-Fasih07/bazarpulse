'use client';

import React from 'react';
import { SaleEventItem } from '@/lib/types';
import { BrandLogo } from '@/components/BrandLogo';
import { Sparkles, ArrowUpRight, Flame, Percent } from 'lucide-react';

interface SalesBannerCarouselProps {
  sales: SaleEventItem[];
  onSelectBrand?: (brandSlug: string) => void;
}

export const SalesBannerCarousel: React.FC<SalesBannerCarouselProps> = ({
  sales,
  onSelectBrand,
}) => {
  if (!sales || sales.length === 0) return null;

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-display">
            Featured Brand Sales & Campaigns
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {sales.length} Active Campaigns
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sales.map((sale) => (
          <div
            key={sale.id}
            onClick={() => onSelectBrand && onSelectBrand(sale.brand.slug)}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            {/* Background Image with Light Gradient Overlay */}
            {sale.bannerUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={sale.bannerUrl}
                  alt={sale.title}
                  className="w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/40" />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-full min-h-[140px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BrandLogo
                      name={sale.brand.name}
                      slug={sale.brand.slug}
                      fallbackUrl={sale.brand.logoUrl}
                      size="sm"
                      className="border border-slate-200"
                    />
                    <span className="text-xs font-extrabold text-emerald-700 tracking-wide uppercase">
                      {sale.brand.name}
                    </span>
                  </div>

                  {sale.badgeText && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                      <Flame className="w-3 h-3 fill-rose-600" />
                      {sale.badgeText}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-display line-clamp-1">
                  {sale.title}
                </h3>
                {sale.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {sale.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-amber-600" />
                  Save up to {sale.discountUpTo}% OFF
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                  Explore Deals <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
