'use client';

import React from 'react';
import { FilterState, Gender } from '@/lib/types';
import { Sparkles, Flame } from 'lucide-react';

interface AudiencePillBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
}

export const AudiencePillBar: React.FC<AudiencePillBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const isAllSelected =
    filters.gender === 'ALL' && filters.category === 'ALL' && filters.minDiscount === 0;

  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 flex-shrink-0 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Filter:</span>
        </span>

        {/* 1. All Deals */}
        <button
          onClick={() =>
            onFilterChange({
              gender: 'ALL',
              category: 'ALL',
              minDiscount: 0,
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            isAllSelected
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>All Deals</span>
        </button>

        {/* 2. Women */}
        <button
          onClick={() =>
            onFilterChange({
              gender: 'WOMEN',
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            filters.gender === 'WOMEN'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>Women</span>
        </button>

        {/* 3. Men */}
        <button
          onClick={() =>
            onFilterChange({
              gender: 'MEN',
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            filters.gender === 'MEN'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>Men</span>
        </button>

        {/* 4. Kids */}
        <button
          onClick={() =>
            onFilterChange({
              gender: 'KIDS',
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            filters.gender === 'KIDS'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>Kids</span>
        </button>

        {/* 5. Unstitched Lawn */}
        <button
          onClick={() =>
            onFilterChange({
              category: 'Unstitched',
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            filters.category === 'Unstitched'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>Unstitched Lawn</span>
        </button>

        {/* 6. Western Apparel */}
        <button
          onClick={() =>
            onFilterChange({
              category: 'Western',
              page: 1,
            })
          }
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            filters.category === 'Western'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
          }`}
        >
          <span>Western Wear</span>
        </button>

        {/* 7. Flat 50%+ Off Mega Sales */}
        <button
          onClick={() =>
            onFilterChange({
              minDiscount: 50,
              page: 1,
            })
          }
          className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            filters.minDiscount === 50
              ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/30'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Flat 50%+ Off</span>
        </button>
      </div>
    </div>
  );
};
