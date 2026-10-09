import React, { useState } from 'react';
import {
  Sparkles,
  Info,
} from 'lucide-react';
import { FarmInsight, FarmEvent } from '../../types/farm';
import { TrustIndicator } from '../common/TrustIndicator';
import { FarmerProfile, FarmerPreferences } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

interface InsightsScreenProps {
  insight: FarmInsight;
  events: FarmEvent[];
  profile?: FarmerProfile;
  preferences?: FarmerPreferences;
  onNavigateToRecord: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  insight,
  events,
  profile,
  preferences,
  onNavigateToRecord,
}) => {
  const [farmerDecision, setFarmerDecision] = useState<string | null>(null);
  const t = getTranslations(preferences?.appLanguage);

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

  const displayTitle = insight.isDemo ? (t.insights.sampleInsightTitle || insight.title) : insight.title;
  const displayDetail = insight.isDemo ? (t.insights.sampleInsightDetail || insight.detail) : insight.detail;
  const displayRecommendation = insight.isDemo
    ? (t.insights.sampleInsightRecommendation || insight.recommendationPrompt)
    : insight.recommendationPrompt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t.insights.subtitle}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.insights.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t.insights.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
              {t.insights.demoBadge}
            </span>
          </div>
        </div>

        <div className="pt-3 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>{t.insights.groundedNotice}</span>
          {profile && preferences && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <span className="font-semibold">{t.insights.policyLabel}</span>
              <span>
                {preferences.recommendationMode === 'Important situations'
                  ? t.preferencesModal.recImportant
                  : preferences.recommendationMode === 'All recommendations'
                  ? t.preferencesModal.recAll
                  : t.preferencesModal.recRequested}
              </span>
              <span>·</span>
              <span>
                {preferences.aiResponseStyle === 'Simple'
                  ? t.preferencesModal.styleSimple
                  : preferences.aiResponseStyle === 'Detailed'
                  ? t.preferencesModal.styleDetailed
                  : t.preferencesModal.styleBalanced}{' '}
                {t.insights.styleLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Sample Demo Insight */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.insights.observationLabel} {insight.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-400">
                  {t.insights.farmTitle}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {displayTitle}
              </h2>
            </div>
          </div>

          <TrustIndicator status="demo" language={preferences?.appLanguage || 'Telugu'} />
        </div>

        {/* Narrative Analysis */}
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white mb-1.5">{t.insights.contextTitle}</p>
          <p>{displayDetail}</p>
        </div>

        {/* Objectives alignment */}
        {profile?.primaryObjectives && (
          <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">
              {t.insights.objectivesLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.primaryObjectives.map((obj, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px]"
                >
                  {getObjectiveLabel(obj)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Farmer Decision Section: "You Decide" */}
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {t.insights.decisionTitle}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {displayRecommendation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800">
            <button
              type="button"
              onClick={() => setFarmerDecision('acknowledged')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
                farmerDecision === 'acknowledged'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {t.insights.acknowledgeButton}
            </button>
            <button
              type="button"
              onClick={onNavigateToRecord}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 min-h-[36px]"
            >
              {t.insights.recordFirstButton}
            </button>
          </div>

          {farmerDecision && (
            <div className="mt-2.5 text-xs text-emerald-900 dark:text-emerald-300 font-medium bg-emerald-100/60 dark:bg-emerald-900/40 p-2 rounded">
              {t.insights.savedDecisionNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
