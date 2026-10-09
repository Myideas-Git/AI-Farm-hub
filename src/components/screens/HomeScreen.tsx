import React from 'react';
import {
  Sun,
  Droplets,
  Wind,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Sprout,
} from 'lucide-react';
import {
  Farmer,
  Farm,
  Plot,
  CropCycle,
  FarmEvent,
  FarmInsight,
} from '../../types/farm';
import { FarmerProfile, FarmerPreferences } from '../../types/profile';
import { TrustIndicator } from '../common/TrustIndicator';
import { NavTab } from '../layout/TopBar';
import { TRANSLATIONS } from '../../i18n/translations';

interface HomeScreenProps {
  farmer: Farmer;
  farm: Farm;
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  insight: FarmInsight;
  profile: FarmerProfile;
  preferences: FarmerPreferences;
  onNavigate: (tab: NavTab) => void;
  onQuickRecord: () => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  farmer,
  farm,
  plots,
  cropCycles,
  events,
  insight,
  profile,
  preferences,
  onNavigate,
  onQuickRecord,
  onOpenProfile,
}) => {
  const t = TRANSLATIONS[preferences.appLanguage] || TRANSLATIONS.Telugu;
  const primaryPlot = plots[0]; // Plot A — Paddy (2 acres)
  const secondaryPlot = plots[1]; // Plot B — Groundnut (3 acres)

  const getObjectiveLabel = (obj: string): string => {
    switch (obj) {
      case 'Maximize farm profitability':
        return t.preferencesModal.objProfitability;
      case 'Reduce input costs':
        return t.preferencesModal.objReduceCosts;
      case 'Improve crop yield':
        return t.preferencesModal.objImproveYield;
      case 'Save water':
        return t.preferencesModal.objSaveWater;
      case 'Maintain accurate farm records':
        return t.preferencesModal.objAccurateRecords;
      default:
        return obj;
    }
  };

  const displayAreaText =
    preferences.appLanguage === 'Telugu'
      ? `${farm.totalAreaAcres} ఎకరాలు (ప్లాట్ A: 2 ఎక + ప్లాట్ B: 3 ఎక)`
      : preferences.appLanguage === 'Hindi'
      ? `${farm.totalAreaAcres} एकड़ (प्लॉट A: 2 एकड़ + प्लॉट B: 3 एकड़)`
      : `${farm.totalAreaAcres} Acres (Plot A: 2 Ac + Plot B: 3 Ac)`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Farmer greeting & context */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{farm.name}</span>
              <span aria-hidden="true">·</span>
              <span>{farm.village}, {farm.district}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                {displayAreaText}
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenProfile}
                className="text-emerald-900 dark:text-emerald-300 font-medium hover:underline flex items-center gap-1"
              >
                <span>{profile.role}</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.home.greeting}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t.home.subGreeting}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onQuickRecord}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>{t.actions.recordActivity}</span>
            </button>
          </div>
        </div>

        {/* Primary Objectives Tags */}
        {profile.primaryObjectives.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 font-medium">{t.home.objectivesLabel}</span>
            {profile.primaryObjectives.map((obj, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]"
              >
                {getObjectiveLabel(obj)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Weather (Mock), Field Status, Pending Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Weather Snapshot - Clearly labelled MOCK */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.home.weatherCardTitle}
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {t.home.weatherMockLabel}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300">
                <Sun className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">31°C</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.home.weatherCondition}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.home.humidity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.home.wind}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            {t.home.weatherStation}
          </div>
        </div>

        {/* Card 2: Current Crop & Plot Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.home.fieldStatusTitle}
              </span>
              <TrustIndicator status="demo" size="sm" />
            </div>

            <div className="space-y-2 mb-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{primaryPlot?.name}</span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-semibold">
                    {primaryPlot?.areaAcres} {preferences.appLanguage === 'Telugu' ? 'ఎకరాలు' : preferences.appLanguage === 'Hindi' ? 'एकड़' : 'Acres'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.home.cropPaddyLandPrep}</div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{secondaryPlot?.name}</span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-semibold">
                    {secondaryPlot?.areaAcres} {preferences.appLanguage === 'Telugu' ? 'ఎకరాలు' : preferences.appLanguage === 'Hindi' ? 'एकड़' : 'Acres'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.home.cropGroundnutLandPrep}</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('my-farm')}
            className="flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800 min-h-[32px]"
          >
            <span>{t.home.viewPlotDetails}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Pending Activity & Action Needed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.home.pendingTasksTitle}
              </span>
              <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {t.home.pendingTasksCount}
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t.home.landPrepPending}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                  {t.home.landPrepPendingDesc}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onQuickRecord}
            className="flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800 min-h-[32px]"
          >
            <span>{t.home.logLandPrepAction}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Sample Insight Card */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.home.fieldIntelligenceObs}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold">
                  {t.insights.demoBadge}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {insight.isDemo ? (t.insights.sampleInsightTitle || insight.title) : insight.title}
              </h2>
            </div>
          </div>

          <TrustIndicator status="demo" language={preferences.appLanguage} />
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {insight.isDemo ? (t.insights.sampleInsightDetail || insight.detail) : insight.detail}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800 text-xs">
          <span className="text-slate-600 dark:text-slate-400 italic">
            "{insight.isDemo ? (t.insights.sampleInsightRecommendation || insight.recommendationPrompt) : insight.recommendationPrompt}"
          </span>
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-400 hover:underline min-h-[36px]"
          >
            <span>{t.home.exploreInsights}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Farm Timeline Snapshot */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.home.recentTimelineTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.home.recentTimelineSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('record')}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 min-h-[36px]"
          >
            <span>{t.home.viewAllRecords} ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* First 3 recent events */}
        <div className="space-y-2.5">
          {events.slice(0, 4).map((evt) => (
            <div
              key={evt.eventId}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${evt.isDemo ? 'bg-sky-500' : 'bg-emerald-600'} shrink-0`} />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{evt.title}</span>
                    {evt.isDemo && (
                      <span className="text-[9px] font-mono text-sky-700 dark:text-sky-400 font-bold">
                        [DEMO]
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {evt.plotName} · {evt.activityDate ? evt.activityDate : t.home.unknownDate}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <TrustIndicator status={evt.status} source={evt.source} size="sm" language={preferences.appLanguage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
