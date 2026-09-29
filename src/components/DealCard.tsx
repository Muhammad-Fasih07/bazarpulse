'use client';

import React from 'react';
import { ProductDeal } from '@/lib/types';
import {
  formatPKR,
  getDiscountBadgeClass,
  buildProductAffiliateUrl,
  truncate,
} from '@/lib/formatters';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ExternalLink,
  Flame,
  TrendingDown,
  Bookmark,
  Sparkles,
  History,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface DealCardProps {
  deal: ProductDeal;
  isSaved?: boolean;
  onToggleSave?: (deal: ProductDeal) => void;
  onOpenPriceHistory?: (deal: ProductDeal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  isSaved = false,
  onToggleSave,
  onOpenPriceHistory,
}) => {
  const affiliateUrl = buildProductAffiliateUrl(deal.productUrl);
  const badgeClass = getDiscountBadgeClass(deal.discountPercentage);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-xs hover:shadow-xl overflow-hidden min-h-[390px]">
      {/* Top Image Section */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
        <img
          src={deal.primaryImageUrl}
          alt={deal.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Brand Logo & Name Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs">
          <BrandLogo
            name={deal.brand.name}
            slug={deal.brand.slug}
            fallbackUrl={deal.brand.logoUrl}
            size="sm"
            className="w-4 h-4 !p-0 !rounded-full border-0 shadow-none"
          />
          <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">
            {deal.brand.name}
          </span>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {/* Wishlist Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(deal);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
                isSaved
                  ? 'bg-rose-600 text-white shadow-rose-600/30'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600 border border-slate-200'
              }`}
              title={isSaved ? 'Remove from saved deals' : 'Save deal for later'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Price History Button */}
          {onOpenPriceHistory && deal.priceHistory && deal.priceHistory.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPriceHistory(deal);
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-white transition-all shadow-xs"
              title="View Price History Drop Timeline"
            >
              <History className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-tight ${badgeClass}`}
          >
            {deal.discountPercentage >= 50 && <Flame className="w-3 h-3 fill-current" />}
            <span>{deal.discountPercentage}% OFF</span>
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-md border ${
              deal.inStock
                ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300'
                : 'bg-rose-50/90 text-rose-800 border-rose-300'
            }`}
          >
            {deal.inStock ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>IN STOCK</span>
              </>
            ) : (
              <>
                <XCircle className="w-2.5 h-2.5" />
                <span>SOLD OUT</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1 gap-2 sm:gap-3">
        <div>
          {/* Category & Gender Metadata */}
          <div className="flex items-center gap-1.5 mb-1 text-[10px] sm:text-[11px] text-slate-500 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px]">
              {deal.gender}
            </span>
            <span className="truncate flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
              {deal.category}
            </span>
          </div>

          {/* Product Title (links to deep product page) */}
          <a
            href={`/product/${deal.slug}`}
            className="font-display font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-emerald-700 transition-colors block"
          >
            {deal.title}
          </a>

          {/* Fabric / Extra Attribute */}
          {deal.fabric && (
            <p className="hidden sm:block text-[11px] text-slate-500 mt-1 font-medium">
              Fabric: <span className="text-slate-700 font-semibold">{deal.fabric}</span>
            </p>
          )}
        </div>

        {/* Price & Call-to-Action Footer */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-emerald-700 tracking-tight">
                {formatPKR(deal.salePrice)}
              </span>
              {deal.originalPrice > deal.salePrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                  {formatPKR(deal.originalPrice)}
                </span>
              )}
            </div>

            {deal.savingsAmount > 0 && (
              <span className="hidden sm:flex text-[11px] font-bold text-emerald-700 items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                Save {formatPKR(deal.savingsAmount)}
              </span>
            )}
          </div>

          {/* Direct Merchant Store Button */}
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs tracking-wide transition-all shadow-sm hover:shadow-md"
          >
            <span>GET DEAL</span>
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
