'use client';

import React, { useState } from 'react';
import { RefreshCw, X, Play, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';

interface ScraperControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapeCompleted: () => void;
}

export const ScraperControlModal: React.FC<ScraperControlModalProps> = ({
  isOpen,
  onClose,
  onScrapeCompleted,
}) => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleStartScrape = async () => {
    setRunning(true);
    setStatus('idle');
    setLogs(['⚡ Initializing BazaarPulse Ingestion Scraper Pipeline...']);

    try {
      setLogs((prev) => [...prev, '🌐 Connecting to 10 Pakistani brand endpoints (Shopify)...']);
      
      const res = await fetch('/api/scrape', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.data) {
        setLogs((prev) => [
          ...prev,
          `✅ Ingestion complete in ${data.data.durationSeconds ?? 0}s`,
          `📦 Total Deals Found: ${data.data.totalDealsFound ?? 0}`,
          `🔥 New Deals Added: ${data.data.totalNewDeals ?? 0}`,
          `🔄 Updated Deals: ${data.data.totalUpdatedDeals ?? 0}`,
          `📉 Price Changes Tracked: ${data.data.totalPriceChanges ?? 0}`,
        ]);
        setStatus('success');
        onScrapeCompleted();
      } else {
        setLogs((prev) => [...prev, `❌ Error: ${data.error}`]);
        setStatus('error');
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, `❌ Network Error: ${err.message}`]);
      setStatus('error');
    } finally {
      setRunning(false);
    }
  };

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
              <RefreshCw className={`w-5 h-5 ${running ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Live Scraper Engine
              </h3>
              <p className="text-xs text-slate-500">
                Trigger real-time deal ingestion & change detection
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
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            The scraper engine queries 32+ Pakistani retail brands (Sapphire, Outfitters, Khaadi, J., Gul Ahmed, Nishat, Sana Safinaz, Stylo, Maria.B, Asim Jofa, Baroque, etc.), normalizes PKR pricing, checks in-stock sizes, and updates price drop history in MongoDB Atlas.
          </p>

          {/* Trigger Button */}
          <button
            onClick={handleStartScrape}
            disabled={running}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Pipeline Scraping...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Ingestion Scraper Now</span>
              </>
            )}
          </button>

          {/* Console Log Screen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                Console Logs
              </span>
              {status === 'success' && (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>

            <div className="w-full h-48 rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1 shadow-inner">
              {logs.length === 0 ? (
                <span className="text-slate-500 italic">
                  Press 'Run Ingestion Scraper Now' to begin pipeline execution...
                </span>
              ) : (
                logs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
