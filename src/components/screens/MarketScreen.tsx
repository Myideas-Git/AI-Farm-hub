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
import { AppLanguage } from '../../types/profile';
import { TrustIndicator } from '../common/TrustIndicator';
import { getTranslations } from '../../i18n/translations';

interface MarketScreenProps {
  benchmarks: MarketBenchmark[];
  cropCycles: CropCycle[];
  plots: Plot[];
  language?: AppLanguage;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({
  benchmarks,
  cropCycles,
  plots,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />;
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
                {t.market.commercialBannerTitle}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold">
                {t.market.commercialBannerBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 mt-1 leading-relaxed">
              {t.market.commercialBannerDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Screen Intro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t.phaseBadge} · {t.market.readinessLabel}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.market.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t.market.subtitle}
            </p>
          </div>

          <TrustIndicator status="demo" language={language} />
        </div>
      </div>

      {/* Registered Crops & Field Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t.market.registeredCropsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.market.registeredCropsSubtitle}
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
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    {plot.name.includes('A') ? 'A' : 'B'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{plot.name}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {plot.areaAcres} {language === 'Telugu' ? 'ఎకరాలు' : language === 'Hindi' ? 'एकड़' : 'Acres'} · {plot.cropName}
                    </span>
                  </div>
                </div>
                <TrustIndicator status="demo" language={language} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.myFarm.cropStage}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {t.market.cropStageVegetativeSimulated}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.myFarm.yieldTargetActual}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {t.market.estimatedHarvestUnrecorded}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Mandi Benchmark Prices */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.market.mandiPricesTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.market.mandiPricesSubtitle}
            </p>
          </div>
          <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
            {t.market.simulationBadge}
          </span>
        </div>

        <div className="space-y-3">
          {benchmarks.map((bm) => (
            <div
              key={bm.cropId}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {bm.cropName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({bm.variety})
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-300">
                      {getTrendIcon(bm.trend)}
                      <span>
                        {bm.trend === 'up'
                          ? (language === 'Telugu' ? 'పెరుగుతోంది' : language === 'Hindi' ? 'बढ़ रहा है' : 'Rising')
                          : bm.trend === 'down'
                          ? (language === 'Telugu' ? 'తగ్గుతోంది' : language === 'Hindi' ? 'घट रहा है' : 'Falling')
                          : (language === 'Telugu' ? 'స్థిరంగా ఉంది' : language === 'Hindi' ? 'स्थिर' : 'Stable')}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bm.marketName}</span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.market.simulatedBenchmark} ({bm.lastUpdatedDate})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t.market.minPrice}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      ₹{bm.minPricePerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right">
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block">
                      {t.market.modalPrice}
                    </span>
                    <span className="text-base font-extrabold text-emerald-950 dark:text-emerald-200 tabular-nums">
                      ₹{bm.modalPricePerQuintal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                      {t.market.perQuintal}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t.market.maxPrice}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      ₹{bm.maxPricePerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
