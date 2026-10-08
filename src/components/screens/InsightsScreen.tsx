import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  Info,
  Calendar,
} from 'lucide-react';
import { FarmInsight, FarmEvent } from '../../types/farm';
import { TrustIndicator } from '../common/TrustIndicator';
import { FarmerProfile, FarmerPreferences } from '../../types/profile';
import { OBJECTIVE_LABELS } from '../../data/mockProfileData';

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

  // Relevant input events causing the cost
  const inputEvents = events.filter(
    (e) => e.plotId === 'plot-01' && e.cost && e.cost > 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              Field Intelligence · "What is happening and why?"
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Farm Insights & Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              We remember. We understand. We help you think. <strong>You decide.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">
              DEMO INSIGHT · PHASE 0
            </span>
          </div>
        </div>

        <div className="pt-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>In Phase 0, all analytical observations are grounded purely in deterministic comparisons between recorded events.</span>
          {profile && preferences && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="font-semibold">Strategy:</span>
              <span className="capitalize">{preferences.recommendationBehavior.replace('_', ' ')}</span>
              <span>·</span>
              <span>{preferences.aiResponseStyle} style</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Sample Demo Insight */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Observation #{insight.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-emerald-900">
                  {insight.plotName}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {insight.title}
              </h2>
            </div>
          </div>

          <TrustIndicator status="estimated" />
        </div>

        {/* Narrative Analysis */}
        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <p className="font-medium text-slate-900 mb-1.5">Context & Finding:</p>
          <p>{insight.detail}</p>
        </div>

        {/* Comparison Metrics Grid */}
        {insight.metricComparison && (
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Cost Comparison Breakdown (At Day 42 Vegetative Stage)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-[11px]">
                  Current Rabi Cycle (Sharbati Wheat)
                </span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {insight.metricComparison.currentCycleValue}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Across 3 confirmed input events
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-[11px]">
                  Previous Rabi Cycle (Day 42 baseline)
                </span>
                <span className="text-base font-semibold text-slate-700 tabular-nums">
                  {insight.metricComparison.previousCycleValue}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Historical normalized record
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-[11px]">Cost Difference</span>
                <span className="text-base font-bold text-amber-700 tabular-nums">
                  {insight.metricComparison.deltaPercentage}
                </span>
                <span className="text-[10px] text-amber-600 block mt-0.5">
                  Higher expenditure rate
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grounding Evidence: Contributing Events */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Audit Trail: Recorded Events Behind This Insight
          </span>
          <div className="space-y-2">
            {inputEvents.map((evt) => (
              <div
                key={evt.eventId}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <div>
                  <span className="font-semibold text-slate-900">{evt.title}</span>
                  <div className="text-slate-500 text-[11px]">
                    {evt.activityDate} · {evt.quantity} {evt.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 tabular-nums">
                    ₹{evt.cost?.toLocaleString('en-IN')}
                  </div>
                  <TrustIndicator status={evt.verificationStatus} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Decision Section: "You Decide" */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Farmer Decision Space (You Decide)
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                {insight.recommendationPrompt}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60">
            <button
              type="button"
              onClick={() => setFarmerDecision('expected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
                farmerDecision === 'expected'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              ✓ Expected: Premium C-306 Seed Investment
            </button>
            <button
              type="button"
              onClick={() => setFarmerDecision('review')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
                farmerDecision === 'review'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Flag for Expense Review
            </button>
            <button
              type="button"
              onClick={onNavigateToRecord}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors min-h-[36px]"
            >
              Log Additional Details
            </button>
          </div>

          {farmerDecision && (
            <div className="mt-2.5 text-xs text-emerald-900 font-medium bg-emerald-100/60 p-2 rounded">
              Saved farmer decision: {farmerDecision === 'expected' ? 'Marked as expected investment. System memory updated.' : 'Flagged for monthly expense reconciliation.'}
            </div>
          )}
        </div>
      </div>

      {/* Future Roadmap / Upcoming Intelligence Categories (Phase 1+) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Future Intelligence Models (Planned Evolutions)
            </h3>
            <p className="text-xs text-slate-500">
              Evolution roadmap: Record → Understand → Analyze → Decide → Anticipate.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
            PHASE 1+ ARCHITECTURE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              Water & Irrigation Optimization
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Calculates crop water stress curves based on soil moisture and days since last canal opening.
            </p>
            <span className="text-[10px] text-slate-400 block mt-2 font-mono">
              STATUS: Pending Phase 1
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              Yield Anticipation Curve
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Progressive yield projection based on tillering density, nutrient timing, and climate intervals.
            </p>
            <span className="text-[10px] text-slate-400 block mt-2 font-mono">
              STATUS: Pending Phase 2
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              Post-Harvest Mandi Timing
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Historical price arrival seasonality compared against holding cost and moisture loss rate.
            </p>
            <span className="text-[10px] text-slate-400 block mt-2 font-mono">
              STATUS: Pending Phase 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
