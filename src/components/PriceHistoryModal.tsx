'use client';

import React from 'react';
import { ProductDeal, PriceHistoryItem } from '@/lib/types';
import { formatPKR, formatRelativeTime } from '@/lib/formatters';
import { X, TrendingDown, History, Calendar, Tag, Flame } from 'lucide-react';

interface PriceHistoryModalProps {
  deal: ProductDeal | null;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  deal,
  onClose,
}) => {
  if (!deal) return null;

  const history = deal.priceHistory || [];
  const lowestPrice = history.length > 0 ? Math.min(...history.map((h) => h.price), deal.salePrice) : deal.salePrice;
  const highestPrice = history.length > 0 ? Math.max(...history.map((h) => h.price), deal.originalPrice) : deal.originalPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Price History Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Tracked price drops for {deal.brand.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Item Overview Summary */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={deal.primaryImageUrl}
              alt={deal.title}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                {deal.brand.name}
              </span>
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {deal.title}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-black text-emerald-700">
                  {formatPKR(deal.salePrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPKR(deal.originalPrice)}
                </span>
                <span className="text-xs font-bold text-rose-600">
                  ({deal.discountPercentage}% OFF)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                Current Price
              </span>
              <strong className="text-sm font-black text-emerald-700">
                {formatPKR(deal.salePrice)}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                Lowest Drop
              </span>
              <strong className="text-sm font-black text-rose-600">
                {formatPKR(lowestPrice)}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                Highest Price
              </span>
              <strong className="text-sm font-black text-slate-600">
                {formatPKR(highestPrice)}
              </strong>
            </div>
          </div>

          {/* Price Drops List Timeline */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Recorded Price Changes
            </h5>

            <div className="space-y-2">
              {history.map((record: PriceHistoryItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-medium text-slate-600">
                      {formatRelativeTime(record.recordedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {record.discountPercentage > 0 && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {record.discountPercentage}% OFF
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatPKR(record.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Automated change detection pipeline
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
