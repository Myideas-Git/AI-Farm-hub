import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Sprout,
  Droplets,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  Farmer,
  Farm,
  Plot,
  CropCycle,
  FarmEvent,
} from '../../types/farm';
import { FarmerPreferences } from '../../types/profile';
import { TrustIndicator } from '../common/TrustIndicator';
import { FarmTimeline } from '../timeline/FarmTimeline';
import { TRANSLATIONS } from '../../i18n/translations';

interface MyFarmScreenProps {
  farmer: Farmer;
  farm: Farm;
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  preferences?: FarmerPreferences;
  onRecordActivityClick: () => void;
  onConfirmEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onEditEvent?: (event: FarmEvent) => void;
}

export const MyFarmScreen: React.FC<MyFarmScreenProps> = ({
  farmer,
  farm,
  plots,
  cropCycles,
  events,
  preferences,
  onRecordActivityClick,
  onConfirmEvent,
  onDeleteEvent,
  onEditEvent,
}) => {
  const t = TRANSLATIONS[preferences?.appLanguage || 'Telugu'] || TRANSLATIONS.Telugu;
  const [selectedPlotId, setSelectedPlotId] = useState<string>(plots[0]?.id || 'plot-a');

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];
  const activeCycle = cropCycles.find(
    (c) => c.plotId === selectedPlot?.id && c.status === 'active'
  );

  const plotEvents = events.filter((e) => e.plotId === selectedPlot?.id);

  return (
    <div className="space-y-6">
      {/* Farm Overview Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{farm.village}, {farm.district}, {farm.state}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {t.myFarm.totalAcresFormat}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {farm.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t.myFarm.managedByFormat}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.myFarm.soilTestStatus}</span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                {t.myFarm.soilTestNotAvailable}
              </span>
            </div>
            <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.myFarm.irrigationSource}</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t.myFarm.irrigationUnknown}
              </span>
            </div>
          </div>
        </div>

        {/* Plot Selector Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.myFarm.plotsListTitle}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.myFarm.plotAcresTotal}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plots.map((plot) => {
              const isSelected = plot.id === selectedPlot.id;

              return (
                <button
                  key={plot.id}
                  type="button"
                  onClick={() => setSelectedPlotId(plot.id)}
                  className={`text-left p-4 rounded-xl border transition-all min-h-[44px] ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {plot.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 tabular-nums">
                      {plot.areaAcres} {preferences?.appLanguage === 'Telugu' ? 'ఎకరాలు' : preferences?.appLanguage === 'Hindi' ? 'एकड़' : 'Acres'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {preferences?.appLanguage === 'Telugu' ? 'పంట:' : preferences?.appLanguage === 'Hindi' ? 'फसल:' : 'Crop:'} {plot.cropName}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{t.myFarm.stageLandPrep}</span>
                    <TrustIndicator status="unknown" size="sm" language={preferences?.appLanguage || 'Telugu'} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Plot Detail Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{t.myFarm.farmPlotLabel}</span>
              <span aria-hidden="true">→</span>
              <span className="font-semibold text-slate-900 dark:text-white">{selectedPlot.name}</span>
              <span aria-hidden="true">→</span>
              <span>
                {selectedPlot.areaAcres} {preferences?.appLanguage === 'Telugu' ? 'ఎకరాలు' : preferences?.appLanguage === 'Hindi' ? 'एकड़' : 'Acres'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {selectedPlot.name} {t.myFarm.fieldSpecsTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onRecordActivityClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors shrink-0 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.myFarm.recordOnPlot}</span>
          </button>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{t.myFarm.soilType}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5 italic">
              {t.myFarm.soilTypeUnknown}
            </span>
            <div className="mt-1">
              <TrustIndicator status="unknown" size="sm" language={preferences?.appLanguage || 'Telugu'} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{t.myFarm.waterSource}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5 italic">
              {t.myFarm.irrigationUnknown}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {t.myFarm.zeroAssumption}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{t.myFarm.sowingVariety}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5 italic">
              {t.myFarm.varietyUnknown}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {t.myFarm.sowingDateUnrecorded}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{t.myFarm.yieldTargetActual}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5 italic">
              {t.myFarm.soilTypeUnknown}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {t.myFarm.neverConvertedToZero}
            </span>
          </div>
        </div>

        {/* Plot Activity History Timeline */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.myFarm.recordedEventsFor} {selectedPlot.name} ({plotEvents.length})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.myFarm.showingFieldLog}
            </span>
          </div>

          <FarmTimeline
            events={plotEvents}
            plots={[selectedPlot]}
            onRecordNewClick={onRecordActivityClick}
            onConfirmEvent={onConfirmEvent}
            onDeleteEvent={onDeleteEvent}
            onEditEvent={onEditEvent}
            language={preferences?.appLanguage || 'Telugu'}
          />
        </div>
      </div>
    </div>
  );
};
