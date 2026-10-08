import React from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  Wheat,
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
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                DEMO MARKET DATA — NOT LIVE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                SIMULATION ONLY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
              These commodity rates and mandi prices are strictly fictional illustrative demo data for Phase 0 UI testing. Live market integrations, government eNAM feeds, and spot trade connections are not connected. Do not make commercial selling decisions based on this screen.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Intro */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              Commercial Readiness · "What can I do with my harvest?"
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Harvest Readiness & Market Benchmarks
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Track anticipated harvest volume and compare against regional mandi benchmark ranges.
            </p>
          </div>

          <TrustIndicator status="demo" />
        </div>
      </div>

      {/* Anticipated Harvest Volume from Active Crops */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Anticipated Marketable Volume (Active Rabi Cycles)
          </h2>
          <p className="text-xs text-slate-500">
            Estimated volume based on target yield and registered field acreage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCycles.map((cycle) => {
            const plot = plots.find((p) => p.id === cycle.plotId);

            return (
              <div
                key={cycle.id}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-slate-900 text-sm">
                      {cycle.cropName}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {plot?.name} ({plot?.areaAcres} Ac)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Target Yield Volume</span>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                      {cycle.targetYieldQuintals} Quintals
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Projected Harvest Date</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {cycle.expectedHarvestDate}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Current Stage: <strong className="text-slate-700 capitalize">{cycle.stage}</strong> ({cycle.stageProgressPercent}%)</span>
                  <TrustIndicator status="estimated" size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fictional APMC Mandi Benchmark Rates Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simulated APMC Mandi Benchmark Rates
            </h2>
            <p className="text-xs text-slate-500">
              Fictional price data for Madhya Pradesh central mandis (Phase 0 mock dataset).
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            UPDATED: OCT 2026 (FICTIONAL)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Commodity & Variety</th>
                <th className="py-2.5 px-3 font-semibold">Mandi Center</th>
                <th className="py-2.5 px-3 font-semibold text-right">Modal Rate (₹/Qtl)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Trading Range</th>
                <th className="py-2.5 px-3 font-semibold text-center">Trend</th>
                <th className="py-2.5 px-3 font-semibold text-center">Data Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {benchmarks.map((bm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{bm.cropName}</span>
                    <span className="text-slate-500 text-[11px]">{bm.variety}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {bm.marketName}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                    ₹{bm.modalPricePerQuintal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
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

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
          * Mandi price feeds will connect to real-time e-NAM API gateway in Phase 3. Live prices are subject to daily arrivals, moisture discount testing, and auction quality grades.
        </div>
      </div>
    </div>
  );
};
