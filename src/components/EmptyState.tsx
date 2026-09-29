'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-display font-bold text-slate-900 text-lg">
          No Deals Match Your Filter
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          We couldn't find any products matching your current search query or filter combination. Try adjusting your discount threshold, category, or clear filters.
        </p>
      </div>

      <button
        onClick={onResetFilters}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs transition shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
};

export default EmptyState;
