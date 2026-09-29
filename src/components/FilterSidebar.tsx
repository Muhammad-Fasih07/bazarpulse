'use client';

import React from 'react';
import { FilterState, BrandInfo, Gender } from '@/lib/types';
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Flame,
  Tag,
  Layers,
  Banknote,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  brands: BrandInfo[];
  categories: { name: string; count: number }[];
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const GENDER_OPTIONS: { id: Gender; label: string; icon: string }[] = [
  { id: 'ALL', label: 'All', icon: '✨' },
  { id: 'WOMEN', label: 'Women', icon: '👗' },
  { id: 'MEN', label: 'Men', icon: '👔' },
  { id: 'KIDS', label: 'Kids', icon: '👶' },
  { id: 'UNISEX', label: 'Unisex', icon: '🌟' },
];

const DISCOUNT_THRESHOLDS = [
  { value: 0, label: 'All Sales' },
  { value: 30, label: '30%+ Off' },
  { value: 40, label: '40%+ Off' },
  { value: 50, label: 'Flat 50%+' },
  { value: 60, label: 'Mega 60%+' },
];

const PRICE_PRESETS = [
  { min: 0, max: 2500, label: 'Under 2.5k' },
  { min: 2500, max: 5000, label: '2.5k - 5k' },
  { min: 5000, max: 8000, label: '5k - 8k' },
  { min: 8000, max: 25000, label: '8k+' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  brands,
  categories,
  isMobileDrawer,
  onCloseMobileDrawer,
}) => {
  const handleGenderSelect = (gender: Gender) => {
    onFilterChange({ gender, page: 1 });
  };

  const handleBrandToggle = (slug: string) => {
    const current = filters.brands;
    let updated: string[];
    if (current.includes(slug)) {
      updated = current.filter((s) => s !== slug);
    } else {
      updated = [...current, slug];
    }
    onFilterChange({ brands: updated, page: 1 });
  };

  const handleCategorySelect = (category: string) => {
    onFilterChange({ category, page: 1 });
  };

  const handleDiscountSelect = (minDiscount: number) => {
    onFilterChange({ minDiscount, page: 1 });
  };

  const handlePricePreset = (min: number, max: number) => {
    onFilterChange({ minPrice: min, maxPrice: max, page: 1 });
  };

  return (
    <aside
      className={`w-full flex flex-col gap-6 ${
        isMobileDrawer ? 'p-5 bg-white' : 'bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm'
      }`}
    >
      {/* Sidebar Header & Clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h3 className="font-display font-bold text-slate-900 text-base tracking-tight">
            Filter Deals
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Gender Tabs */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audience / Gender</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {GENDER_OPTIONS.map((g) => {
            const isSelected = filters.gender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleGenderSelect(g.id)}
                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Minimum Discount Threshold */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Flame className="w-3.5 h-3.5 text-rose-600" />
          <span>Discount Depth</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DISCOUNT_THRESHOLDS.map((thresh) => {
            const isSelected = filters.minDiscount === thresh.value;
            return (
              <button
                key={thresh.value}
                onClick={() => handleDiscountSelect(thresh.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm font-bold border border-rose-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {thresh.value >= 50 && <Flame className="w-3 h-3 fill-current" />}
                {thresh.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brands Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Tag className="w-3.5 h-3.5 text-sky-600" />
            <span>Brands ({brands.length})</span>
          </label>
          {filters.brands.length > 0 && (
            <button
              onClick={() => onFilterChange({ brands: [], page: 1 })}
              className="text-[11px] text-emerald-700 font-medium hover:underline"
            >
              Clear brands
            </button>
          )}
        </div>
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
          {brands.map((b) => {
            const isSelected = filters.brands.includes(b.slug);
            return (
              <button
                key={b.id}
                onClick={() => handleBrandToggle(b.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={b.logoUrl}
                    alt={b.name}
                    className="w-5 h-5 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                  <span className="truncate text-left">{b.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                    {b.activeDealsCount}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Category Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Category</span>
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              filters.category === 'ALL'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => {
            const isSelected = filters.category === c.name;
            return (
              <button
                key={c.name}
                onClick={() => handleCategorySelect(c.name)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-slate-400">({c.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Range (PKR) */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Banknote className="w-3.5 h-3.5 text-amber-600" />
          <span>Price Range (PKR)</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((p) => {
            const isSelected =
              filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={p.label}
                onClick={() => handlePricePreset(p.min, p.max)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Min / Max inputs */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1">
            <span className="text-[10px] text-slate-500 font-medium block mb-1">Min (Rs.)</span>
            <input
              type="number"
              value={filters.minPrice === 0 ? '' : filters.minPrice}
              onChange={(e) =>
                onFilterChange({
                  minPrice: Math.max(0, parseInt(e.target.value) || 0),
                  page: 1,
                })
              }
              placeholder="0"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <span className="text-slate-400 mt-4">-</span>
          <div className="flex-1">
            <span className="text-[10px] text-slate-500 font-medium block mb-1">Max (Rs.)</span>
            <input
              type="number"
              value={filters.maxPrice >= 25000 ? '' : filters.maxPrice}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: Math.max(0, parseInt(e.target.value) || 25000),
                  page: 1,
                })
              }
              placeholder="25,000"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 6. In-Stock Only Toggle */}
      <div className="pt-2 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
              In-Stock Items Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ inStockOnly: e.target.checked, page: 1 })
            }
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Mobile Drawer Close Button */}
      {isMobileDrawer && onCloseMobileDrawer && (
        <button
          onClick={onCloseMobileDrawer}
          className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md mt-4"
        >
          Apply Filters
        </button>
      )}
    </aside>
  );
};
