import React from 'react';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sprout,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
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
import { ROLE_LABELS, OBJECTIVE_LABELS } from '../../data/mockProfileData';
import { TrustIndicator } from '../common/TrustIndicator';
import { NavTab } from '../layout/TopBar';

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
  const activeCycles = cropCycles.filter((c) => c.status === 'active');
  const primaryPlot = plots[0];
  const primaryCycle = activeCycles.find((c) => c.plotId === primaryPlot?.id);

  // Financial snapshot calculations
  const totalInputCost = events
    .filter((e) => e.cost && e.cost > 0)
    .reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const totalHarvestRevenue = events
    .filter((e) => e.cost && e.cost < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.cost || 0), 0);

  const greetingPrefix =
    preferences.language === 'hi'
      ? 'नमस्ते'
      : preferences.language === 'hinglish'
      ? 'Namaste'
      : 'Namaste';

  const landUnitLabel =
    preferences.unitLand === 'bigha'
      ? 'Bigha'
      : preferences.unitLand === 'hectares'
      ? 'Ha'
      : 'Acres';

  const weightUnitLabel =
    preferences.unitWeight === 'bags'
      ? 'Bags'
      : preferences.unitWeight === 'kg'
      ? 'kg'
      : 'Quintals';

  return (
    <div className="space-y-6">
      {/* Top Banner: Farmer greeting & context */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{farm.name}</span>
              <span aria-hidden="true">·</span>
              <span>{farm.village}, {farm.district}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-800">
                {farm.totalAreaAcres} {landUnitLabel}
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenProfile}
                className="text-emerald-900 font-medium hover:underline flex items-center gap-1"
              >
                <span>{ROLE_LABELS[profile.role] || 'Owner Farmer'}</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {greetingPrefix}, {profile.preferredName || profile.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              What you should know for your farm today (Rabi Season 2026–27).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onQuickRecord}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Record Activity</span>
            </button>
          </div>
        </div>

        {/* Personalized Objective Marker */}
        {profile.primaryObjectives.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="text-slate-400 font-medium">Active Focus:</span>
            {profile.primaryObjectives.map((obj) => (
              <span
                key={obj}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]"
              >
                {OBJECTIVE_LABELS[obj] || obj}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Simplified Mode Banner (if user chose simplified interaction mode) */}
      {preferences.interactionMode === 'simplified' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Simplified Field Mode Active
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                EASY TOUCH
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              Large touch targets and minimal clutter are enabled for easy outdoor use.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('record')}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg min-h-[40px] whitespace-nowrap"
          >
            Open Big Voice & Quick Loggers
          </button>
        </div>
      )}

      {/* Grid: Weather (Mock) & Field Attention Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Weather Snapshot - Clearly labelled MOCK */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700">Weather Condition</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                MOCK — NOT LIVE
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Sun className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">28°C</div>
                <div className="text-xs text-slate-500">Sunny · Clear Sky</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Humidity: 48%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                <span>Wind: 11 km/h</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100">
            Pipariya Station · Simulated for Phase 0
          </div>
        </div>

        {/* Card 2: Current Crop & Plot Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Primary Field Status</span>
              <TrustIndicator status="confirmed" size="sm" />
            </div>

            <div className="mb-2">
              <div className="text-sm font-bold text-slate-900">
                {primaryPlot?.name} ({primaryPlot?.areaAcres} Ac)
              </div>
              <div className="text-xs text-emerald-900 font-medium">
                {primaryCycle?.cropName} · {primaryCycle?.variety}
              </div>
            </div>

            {/* Stage progress */}
            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="capitalize">Stage: {primaryCycle?.stage}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  Day 42 ({primaryCycle?.stageProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 rounded-full"
                  style={{ width: `${primaryCycle?.stageProgressPercent || 40}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('my-farm')}
            className="flex items-center justify-between text-xs font-medium text-emerald-800 hover:text-emerald-950 pt-2 border-t border-slate-100 min-h-[32px]"
          >
            <span>View all 3 plots & soil records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Pending Activity & Action Needed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Pending Field Tasks</span>
              <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                1 Attention Item
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Second Irrigation Window Due</span>
                </div>
                <div className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  North Canal Acre is due for 2nd irrigation between Day 42–45. Canal slot scheduled for Saturday.
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onQuickRecord}
            className="flex items-center justify-between text-xs font-medium text-emerald-800 hover:text-emerald-950 pt-2 border-t border-slate-100 min-h-[32px]"
          >
            <span>Log irrigation when completed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Sample Insight Card (Requirement 6 / 3) */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Field Intelligence Observation
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                  DEMO INSIGHT
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {insight.title}
              </h2>
            </div>
          </div>

          <TrustIndicator status="estimated" />
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {insight.detail}
        </p>

        {insight.metricComparison && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/90 rounded-xl border border-emerald-200/80 mb-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Current Cycle (Day 42)</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {insight.metricComparison.currentCycleValue}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Previous Cycle (Day 42)</span>
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                {insight.metricComparison.previousCycleValue}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Cost Variance</span>
              <span className="text-sm font-bold text-amber-700 tabular-nums">
                {insight.metricComparison.deltaPercentage}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/60 text-xs">
          <span className="text-slate-600 italic">
            "{insight.recommendationPrompt}"
          </span>
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 hover:text-emerald-950 transition-colors whitespace-nowrap min-h-[36px]"
          >
            <span>Explore full insight & breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Financial Snapshot Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Season Financial Snapshot (Rabi 2026–27)
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic calculations from confirmed farmer activity records.
            </p>
          </div>
          <TrustIndicator status="confirmed" size="sm" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Recorded Inputs Cost</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{totalInputCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Seeds, fertilizer, fuel</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Previous Kharif Revenue</span>
            <span className="text-lg font-bold text-emerald-800 tabular-nums">
              ₹{totalHarvestRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Soybean Mandi sale (Vouched)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Projected Wheat Yield</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              22.5 Qtl
            </span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Estimated target</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Soil Test Verification</span>
            <span className="text-sm font-semibold text-slate-900 block mt-1">
              Plot 1: Certified
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Plot 2: Pending sample</span>
          </div>
        </div>
      </div>

      {/* Recent Farm Timeline Snapshot */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Farm Timeline</h3>
            <p className="text-xs text-slate-500">
              Chronological log of activities, inputs, and field observations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('record')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 min-h-[36px]"
          >
            <span>View all {events.length} events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* First 3 recent events */}
        <div className="space-y-2.5">
          {events.slice(0, 3).map((evt) => (
            <div
              key={evt.eventId}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/70 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">{evt.title}</div>
                  <div className="text-slate-500 text-[11px]">
                    {evt.plotName} · {evt.activityDate}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {evt.cost && (
                  <div className="font-semibold text-slate-900 tabular-nums">
                    {evt.cost < 0 ? `+ ₹${Math.abs(evt.cost).toLocaleString('en-IN')}` : `₹${evt.cost.toLocaleString('en-IN')}`}
                  </div>
                )}
                <TrustIndicator status={evt.verificationStatus} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
