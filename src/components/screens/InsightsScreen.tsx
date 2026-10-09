import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  Calendar,
  Check,
} from 'lucide-react';
import { FarmInsight, FarmEvent } from '../../types/farm';
import { TrustIndicator } from '../common/TrustIndicator';
import { FarmerProfile, FarmerPreferences } from '../../types/profile';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Field Intelligence · "What is happening and why?"
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Farm Insights & Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              We remember. We understand. We help you think. <strong>You decide.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
              DEMO INSIGHT · PHASE 0.5
            </span>
          </div>
        </div>

        <div className="pt-3 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>All analytical observations are grounded purely in confirmed farmer activity records.</span>
          {profile && preferences && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <span className="font-semibold">Recommendation Policy:</span>
              <span>{preferences.recommendationMode}</span>
              <span>·</span>
              <span>{preferences.aiResponseStyle} style</span>
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
                  Observation #{insight.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-400">
                  Ravi Kumar Farm (5 Acres)
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {insight.title}
              </h2>
            </div>
          </div>

          <TrustIndicator status="demo" language={preferences?.appLanguage || 'Telugu'} />
        </div>

        {/* Narrative Analysis */}
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white mb-1.5">Context & Observation:</p>
          <p>{insight.detail}</p>
        </div>

        {/* Objectives alignment */}
        {profile?.primaryObjectives && (
          <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">
              Farmer Objectives Calibration:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.primaryObjectives.map((obj, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px]"
                >
                  {obj}
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
                Farmer Decision Space (You Decide)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {insight.recommendationPrompt}
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
              ✓ Acknowledged: Initial field preparation baseline
            </button>
            <button
              type="button"
              onClick={onNavigateToRecord}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 min-h-[36px]"
            >
              Record First Farm Activity
            </button>
          </div>

          {farmerDecision && (
            <div className="mt-2.5 text-xs text-emerald-900 dark:text-emerald-300 font-medium bg-emerald-100/60 dark:bg-emerald-900/40 p-2 rounded">
              Saved farmer choice: Baseline acknowledged. Application memory updated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
