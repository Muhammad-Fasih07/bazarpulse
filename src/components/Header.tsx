'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Zap,
  Bookmark,
  RefreshCw,
  X,
  SlidersHorizontal,
  Flame,
  Store,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  ChevronDown,
} from 'lucide-react';
import { AggregatorStats } from '@/lib/types';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  savedCount?: number;
  onOpenSavedDrawer?: () => void;
  onOpenScraperModal?: () => void;
  onOpenMobileFilters?: () => void;
  stats?: AggregatorStats | null;
  activeFilterCount?: number;
  hideSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  savedCount = 0,
  onOpenSavedDrawer,
  onOpenScraperModal,
  onOpenMobileFilters,
  stats,
  activeFilterCount = 0,
  hideSearch = false,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Keyboard shortcut (/) or (Cmd/Ctrl + K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Find Deals', href: '/deals', badge: null },
    { label: 'Sales & Events', href: '/sales', badge: 'LIVE' },
    { label: 'All Brands', href: '/brands', badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
          
          {/* 1. Left: Brand Identity */}
          <div className="flex items-center gap-6 sm:gap-9 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md shadow-emerald-950/20 border border-slate-800">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/30" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                    Bazaar<span className="text-emerald-600">Pulse</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase -mt-0.5">
                  Pakistan Fashion Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80">
              <Link
                href="/"
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  pathname === '/'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Home
              </Link>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white leading-none tracking-wider animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 2. Center: Prominent, Ergonomic Search Bar */}
          {!hideSearch && (
            <div className="flex-1 max-w-lg hidden md:block">
              <div
                className={`relative flex items-center w-full rounded-2xl transition-all duration-300 ${
                  isSearchFocused
                    ? 'bg-white ring-4 ring-emerald-600/10 border-2 border-emerald-600 shadow-lg shadow-emerald-950/5'
                    : 'bg-slate-100/90 border border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="pl-4 pointer-events-none text-slate-400">
                  <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search 32+ Pakistani brands (Lawn, Kurta, Denim, Shoes)..."
                  className="w-full py-2.5 pl-3 pr-16 bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <div className="absolute right-3 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      onClick={() => onSearchChange?.('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Right: Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Drawer Trigger (When on deals page) */}
            {onOpenMobileFilters && (
              <button
                onClick={onOpenMobileFilters}
                className="md:hidden relative flex items-center justify-center p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Find Deals shortcut on small screens */}
            <Link
              href="/deals"
              className="md:hidden flex items-center justify-center p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
              title="Search Deals"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Saved Wishlist Drawer Button */}
            {onOpenSavedDrawer && (
              <button
                onClick={onOpenSavedDrawer}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                  savedCount > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
                title="View Bookmarked Deals"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 transition-transform ${
                    savedCount > 0 ? 'text-rose-600 fill-rose-600 scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="hidden sm:inline">Saved Deals</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white leading-none">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {/* Discrete Admin / Sync Trigger */}
            {onOpenScraperModal && (
              <button
                onClick={onOpenScraperModal}
                className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                title="Sync & Ingestion Console"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 border-t border-slate-100">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              pathname === '/'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`px-1 py-0.2 rounded text-[9px] font-black leading-none ${isActive ? 'bg-white text-emerald-700' : 'bg-rose-500 text-white'}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Search Bar - Visible on Small Screens */}
        {!hideSearch && (
          <div className="pb-3 md:hidden">
            <div className="relative flex items-center w-full rounded-xl bg-slate-100 border border-slate-200">
              <div className="pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search lawn, kurta, denim, shoes..."
                className="w-full py-2.5 pl-2.5 pr-8 bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
