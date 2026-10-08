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
  ShieldCheck,
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

interface MyFarmScreenProps {
  farmer: Farmer;
  farm: Farm;
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  preferences?: FarmerPreferences;
  onRecordActivityClick: () => void;
}

export const MyFarmScreen: React.FC<MyFarmScreenProps> = ({
  farmer,
  farm,
  plots,
  cropCycles,
  events,
  preferences,
  onRecordActivityClick,
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>(plots[0]?.id || '');
  const [viewHistory, setViewHistory] = useState<boolean>(false);

  const landUnit =
    preferences?.unitLand === 'bigha'
      ? 'Bigha'
      : preferences?.unitLand === 'hectares'
      ? 'Ha'
      : 'Acres';

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];
  const activeCycle = cropCycles.find(
    (c) => c.plotId === selectedPlot?.id && c.status === 'active'
  );
  const previousCycle = cropCycles.find(
    (c) => c.plotId === selectedPlot?.id && c.status === 'completed'
  );

  const plotEvents = events.filter((e) => e.plotId === selectedPlot?.id);

  return (
    <div className="space-y-6">
      {/* Farm Overview Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{farm.village}, {farm.district}, {farm.state}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-800">
                {farm.totalAreaAcres} Total {landUnit}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {farm.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Managed by {farmer.name} · {plots.length} registered plots under active cultivation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 block">Primary Soil Profile</span>
              <span className="text-xs font-semibold text-slate-800">
                {farm.soilPrimary}
              </span>
            </div>
            <div className="text-right border-l border-slate-200 pl-3">
              <span className="text-xs text-slate-500 block">Water Source</span>
              <span className="text-xs font-semibold text-slate-800">
                {farm.primaryWaterSource}
              </span>
            </div>
          </div>
        </div>

        {/* Plot Selector Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Plot to Inspect
            </span>
            <span className="text-xs text-slate-500">
              {plots.length} demarcated parcels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plots.map((plot) => {
              const isSelected = plot.id === selectedPlot.id;
              const cycle = cropCycles.find(
                (c) => c.plotId === plot.id && c.status === 'active'
              );

              return (
                <button
                  key={plot.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlotId(plot.id);
                    setViewHistory(false);
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all min-h-[44px] ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">
                      {plot.name}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 tabular-nums">
                      {plot.areaAcres} {landUnit}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {cycle ? (
                      <span className="text-emerald-900 font-medium">
                        {cycle.cropName} ({cycle.variety})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Preparation / Fallow</span>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{plot.soilType.split(' ')[0]} Soil</span>
                    <TrustIndicator status={plot.soilDataTrust} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Plot Detail Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Plot Hierarchy</span>
              <span aria-hidden="true">→</span>
              <span className="font-semibold text-slate-900">{selectedPlot.name}</span>
              <span aria-hidden="true">→</span>
              <span>{selectedPlot.areaAcres} Acres</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {selectedPlot.name} Field Specifications
            </h2>
          </div>

          <button
            type="button"
            onClick={onRecordActivityClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors shrink-0 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Record on this Plot</span>
          </button>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Soil Classification</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
              {selectedPlot.soilType}
            </span>
            <div className="mt-1">
              <TrustIndicator status={selectedPlot.soilDataTrust} size="sm" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Water & Irrigation</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
              {selectedPlot.irrigationType}
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              Source: {selectedPlot.waterSource}
            </span>
          </div>

          {/* Demonstrating TRUST MODEL: Never convert unknown info into zero! */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Soil Organic Carbon</span>
            {selectedPlot.soilOrganicCarbon !== null && selectedPlot.soilOrganicCarbon !== undefined ? (
              <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 tabular-nums">
                {selectedPlot.soilOrganicCarbon}% (Good)
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 block mt-0.5 italic">
                Unknown (Not tested)
              </span>
            )}
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedPlot.soilOrganicCarbon !== null
                ? 'Lab Report 2026'
                : 'Zero assumption rule active'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Soil pH Reaction</span>
            {selectedPlot.soilPH !== null && selectedPlot.soilPH !== undefined ? (
              <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 tabular-nums">
                {selectedPlot.soilPH} pH (Neutral)
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 block mt-0.5 italic">
                Unknown / Sample pending
              </span>
            )}
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Preserving missing data
            </span>
          </div>
        </div>

        {/* Current Active Crop Cycle vs Previous Cycle */}
        <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-800" />
              <span className="text-sm font-bold text-slate-900">
                {activeCycle ? 'Active Crop Cycle (Rabi 2026–27)' : 'Field Status'}
              </span>
            </div>

            {previousCycle && (
              <button
                type="button"
                onClick={() => setViewHistory(!viewHistory)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 min-h-[32px] flex items-center gap-1"
              >
                <span>{viewHistory ? 'Show Current Cycle' : 'Show Previous Cycle (Kharif Soybean)'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {viewHistory && previousCycle ? (
            /* Previous completed cycle */
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-lg text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    {previousCycle.cropName} ({previousCycle.variety})
                  </span>
                  <span className="text-slate-500 ml-2">Season: {previousCycle.season}</span>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                  Completed & Harvested
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Sowing Date:</span>
                  <span className="font-medium text-slate-800">{previousCycle.sowingDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Harvest Date:</span>
                  <span className="font-medium text-slate-800">{previousCycle.actualHarvestDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Actual Yield:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {previousCycle.actualYieldQuintals} Quintals
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Verification:</span>
                  <TrustIndicator status="confirmed" size="sm" />
                </div>
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                Note: {previousCycle.notes}
              </div>
            </div>
          ) : activeCycle ? (
            /* Current active cycle */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeCycle.cropName}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Variety: <span className="font-medium text-slate-800">{activeCycle.variety}</span> · Season: {activeCycle.season}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Target Yield Estimate</div>
                  <div className="text-sm font-bold text-slate-900 tabular-nums">
                    {activeCycle.targetYieldQuintals} Quintals
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold capitalize text-emerald-900">
                    Current Stage: {activeCycle.stage}
                  </span>
                  <span className="tabular-nums font-semibold text-slate-800">
                    {activeCycle.stageProgressPercent}% completed
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-700 rounded-full"
                    style={{ width: `${activeCycle.stageProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Sown: {activeCycle.sowingDate}</span>
                  <span>Target Harvest: {activeCycle.expectedHarvestDate}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-lg text-xs text-slate-700 border border-emerald-100">
                {activeCycle.notes}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              This plot is currently in land preparation / fallow. No active crop cycle registered.
            </div>
          )}
        </div>

        {/* Plot Activity History Timeline */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Recorded Events for {selectedPlot.name} ({plotEvents.length})
            </h3>
            <span className="text-xs text-slate-500">
              Showing historical field log
            </span>
          </div>

          <FarmTimeline
            events={plotEvents}
            plots={[selectedPlot]}
            onRecordNewClick={onRecordActivityClick}
          />
        </div>
      </div>
    </div>
  );
};
