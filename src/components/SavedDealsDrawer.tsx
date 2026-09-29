'use client';

import React from 'react';
import { ProductDeal } from '@/lib/types';
import { formatPKR, buildProductAffiliateUrl } from '@/lib/formatters';
import { X, Trash2, ExternalLink, Bookmark, ShoppingBag } from 'lucide-react';

interface SavedDealsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDeals: ProductDeal[];
  onRemoveSave: (dealId: string) => void;
  onClearAll: () => void;
}

export const SavedDealsDrawer: React.FC<SavedDealsDrawerProps> = ({
  isOpen,
  onClose,
  savedDeals,
  onRemoveSave,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                <Bookmark className="w-5 h-5 fill-rose-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Saved Wishlist
                </h3>
                <p className="text-xs text-slate-500">
                  {savedDeals.length} Bookmarked Items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedDeals.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Clear Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
            {savedDeals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  No Saved Deals Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Click the bookmark icon on any deal card to save it for later viewing.
                </p>
              </div>
            ) : (
              savedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition group"
                >
                  <img
                    src={deal.primaryImageUrl}
                    alt={deal.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-emerald-700">
                      {deal.brand.name}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {deal.title}
                    </h5>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-black text-emerald-700">
                        {formatPKR(deal.salePrice)}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatPKR(deal.originalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <a
                      href={buildProductAffiliateUrl(deal.productUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
                      title="Buy Deal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onRemoveSave(deal.id)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
