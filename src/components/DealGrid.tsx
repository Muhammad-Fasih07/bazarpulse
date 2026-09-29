'use client';

import React from 'react';
import { ProductDeal, FilterState, PaginationMeta } from '@/lib/types';
import { DealCard } from './DealCard';
import { EmptyState } from './EmptyState';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Grid,
  Tag,
  X,
} from 'lucide-react';

interface DealGridProps {
  deals: ProductDeal[];
  pagination: PaginationMeta | null;
  loading: boolean;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  savedIds: string[];
  onToggleSave: (deal: ProductDeal) => void;
  onOpenPriceHistory: (deal: ProductDeal) => void;
  onResetFilters: () => void;
}

export const DealGrid: React.FC<DealGridProps> = ({
  deals,
  pagination,
  loading,
  filters,
  onFilterChange,
  savedIds,
  onToggleSave,
  onOpenPriceHistory,
  onResetFilters,
}) => {
  return (
    <div className="w-full space-y-5">
      {/* Grid Controls Header (Sort, Active Pills, Counter) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-600" />
            <h2 className="font-display font-bold text-slate-900 text-base">
              Catalog Deals
            </h2>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            {pagination ? `${pagination.total} Products` : '...'}
          </span>

          {/* Active Filter Badges */}
          {filters.brands.map((bSlug) => (
            <span
              key={bSlug}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300"
            >
              <span>{bSlug}</span>
              <button
                onClick={() =>
                  onFilterChange({
                    brands: filters.brands.filter((s) => s !== bSlug),
                    page: 1,
                  })
                }
                className="hover:text-emerald-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.category !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300">
              <span>{filters.category}</span>
              <button
                onClick={() => onFilterChange({ category: 'ALL', page: 1 })}
                className="hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minDiscount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Flame className="w-3 h-3 fill-rose-600" />
              <span>{filters.minDiscount}%+ OFF</span>
              <button
                onClick={() => onFilterChange({ minDiscount: 0, page: 1 })}
                className="hover:text-rose-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort By:
          </label>
          <select
            value={filters.sort}
            onChange={(e) =>
              onFilterChange({
                sort: e.target.value as FilterState['sort'],
                page: 1,
              })
            }
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 shadow-2xs cursor-pointer"
          >
            <option value="discount_desc">Highest Discount %</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="savings_desc">Biggest Savings (PKR)</option>
            <option value="newest">Newest Added</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200 h-96 p-4 flex flex-col justify-between"
            >
              <div className="w-full aspect-[4/3] rounded-xl skeleton-shimmer" />
              <div className="space-y-2 py-4">
                <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                <div className="h-3 w-1/2 rounded skeleton-shimmer" />
              </div>
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        /* Empty State */
        <EmptyState onResetFilters={onResetFilters} />
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isSaved={savedIds.includes(deal.id)}
              onToggleSave={onToggleSave}
              onOpenPriceHistory={onOpenPriceHistory}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <span className="text-xs font-semibold text-slate-500">
            Page <strong className="text-slate-900">{pagination.page}</strong> of{' '}
            <strong className="text-slate-900">{pagination.totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onFilterChange({ page: pagination.page - 1 })}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={!pagination.hasMore}
              onClick={() => onFilterChange({ page: pagination.page + 1 })}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
