import React from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  Sprout,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { MarketBenchmark, CropCycle, Plot } from '../../types/farm';
import { TrustIndicator } from '../common/TrustIndicator';

interface MarketScreenProps {
  benchmarks: MarketBenchmark[];
  cropCycles: CropCycle[];
  plots: Plot[];
}

export const MarketScreen: React.FC<MarketScreenProps> = ({
  benchmarks,
  cropCycles,
  plots,
}) => {
  const activeCycles = cropCycles.filter((c) => c.status === 'active');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-rose-700" />;
      case 'stable':
      default:
        return <Minus className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Mandatory Safety Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-amber-950 dark:text-amber-100 uppercase tracking-wider">
                DEMO MARKET DATA — NOT LIVE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold">
                SIMULATION ONLY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
              These commodity rates and mandi prices are strictly fictional illustrative demo data for Phase 0.5 testing. Live market integrations, government eNAM feeds, and spot trade connections are not connected. Do not make commercial selling decisions based on this screen.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Intro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Commercial Readiness · "What can I do with my harvest?"
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Harvest Readiness & Market Benchmarks
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Simulated regional mandi benchmarks for Andhra Pradesh crops (Paddy & Groundnut).
            </p>
          </div>

          <TrustIndicator status="demo" />
        </div>
      </div>

      {/* Anticipated Harvest Volume from Active Crops */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Registered Crops & Field Status
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plot A (Paddy) and Plot B (Groundnut) on Ravi Kumar Farm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {plot.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {plot.areaAcres} Acres
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Expected Yield</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs italic">
                    Unknown / Unrecorded
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Current Stage</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Land preparation
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Crop: {plot.cropName}</span>
                <TrustIndicator status="unknown" size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fictional APMC Mandi Benchmark Rates Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Simulated APMC Mandi Benchmark Rates
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fictional benchmark price data for Anakapalli AMC Market Yard (Phase 0.5 mock dataset).
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            UPDATED: OCT 2026 (FICTIONAL)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                <th className="py-2.5 px-3 font-semibold">Commodity & Variety</th>
                <th className="py-2.5 px-3 font-semibold">Mandi Center</th>
                <th className="py-2.5 px-3 font-semibold text-right">Modal Rate (₹/Qtl)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Trading Range</th>
                <th className="py-2.5 px-3 font-semibold text-center">Trend</th>
                <th className="py-2.5 px-3 font-semibold text-center">Data Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {benchmarks.map((bm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{bm.cropName}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">{bm.variety}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {bm.marketName}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                    ₹{bm.modalPricePerQuintal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                    ₹{bm.minPricePerQuintal} – ₹{bm.maxPricePerQuintal}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1 font-medium capitalize">
                      {getTrendIcon(bm.trend)}
                      <span className="text-[11px]">{bm.trend}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <TrustIndicator status="demo" size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          * Mandi price feeds are strictly simulated for Phase 0.5. Live prices are subject to moisture test deductions and auction quality gradings.
        </div>
      </div>
    </div>
  );
};
