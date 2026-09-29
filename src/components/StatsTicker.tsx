'use client';

import React from 'react';
import { AggregatorStats } from '@/lib/types';
import { formatRelativeTime } from '@/lib/formatters';
import { Flame, Clock } from 'lucide-react';

interface StatsTickerProps {
  stats: AggregatorStats | null;
  loading: boolean;
}

export const StatsTicker: React.FC<StatsTickerProps> = ({ stats, loading }) => {
  return (
    <div className="w-full bg-slate-900 text-slate-300 py-1.5 px-4 sm:px-6 text-[11px] font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Subtle Live Drops Banner */}
        <div className="flex items-center gap-2 truncate">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE SALE DROPS:
          </span>
          <span className="text-slate-300 truncate">
            Sapphire Flat 50% • Outfitters 60% Clearance • Gul Ahmed Lawn Gala • Limelight Flat 40%
          </span>
        </div>

        {/* Right: Quick Stats Counter */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-slate-400">
          <span>
            <strong className="text-white font-semibold">
              {loading ? '...' : stats?.totalActiveDeals ?? 0}
            </strong>{' '}
            Verified Deals
          </span>
          <span>•</span>
          <span>
            Avg{' '}
            <strong className="text-emerald-400 font-semibold">
              {loading ? '...' : `${stats?.averageDiscount ?? 0}%`}
            </strong>{' '}
            OFF
          </span>
          {stats?.lastScrapedAt && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                Updated {formatRelativeTime(stats.lastScrapedAt)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
