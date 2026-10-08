import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  Sprout,
  Sparkles,
  Eye,
  Wheat,
  IndianRupee,
  Receipt,
  Camera,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  FileText,
} from 'lucide-react';
import { FarmEvent, FarmEventType, Plot } from '../../types/farm';
import { TrustIndicator } from '../common/TrustIndicator';

interface FarmTimelineProps {
  events: FarmEvent[];
  plots: Plot[];
  onSelectEvent?: (event: FarmEvent) => void;
  onRecordNewClick?: () => void;
}

export const FarmTimeline: React.FC<FarmTimelineProps> = ({
  events,
  plots,
  onRecordNewClick,
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<FarmEvent | null>(null);

  // Filter events
  const filteredEvents = events.filter((evt) => {
    if (selectedPlotId !== 'all' && evt.plotId !== selectedPlotId) {
      return false;
    }
    if (selectedEventType !== 'all' && evt.eventType !== selectedEventType) {
      return false;
    }
    return true;
  });

  const getEventIcon = (type: FarmEventType) => {
    switch (type) {
      case 'sowing':
        return <Sprout className="w-4 h-4 text-emerald-700" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-sky-700" />;
      case 'fertilizer':
        return <Sparkles className="w-4 h-4 text-amber-700" />;
      case 'pest_scouting':
      case 'observation':
        return <Eye className="w-4 h-4 text-indigo-700" />;
      case 'harvest':
        return <Wheat className="w-4 h-4 text-amber-800" />;
      case 'sale':
        return <IndianRupee className="w-4 h-4 text-emerald-800" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  const getEventBg = (type: FarmEventType) => {
    switch (type) {
      case 'sowing':
        return 'bg-emerald-50 border-emerald-200';
      case 'irrigation':
        return 'bg-sky-50 border-sky-200';
      case 'fertilizer':
        return 'bg-amber-50 border-amber-200';
      case 'pest_scouting':
      case 'observation':
        return 'bg-indigo-50 border-indigo-200';
      case 'harvest':
        return 'bg-amber-50 border-amber-300';
      case 'sale':
        return 'bg-emerald-50 border-emerald-300';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter Timeline:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Plot select */}
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            aria-label="Filter by Plot"
          >
            <option value="all">All Plots ({plots.length})</option>
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Event type select */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            aria-label="Filter by Event Type"
          >
            <option value="all">All Activity Types</option>
            <option value="sowing">Sowing</option>
            <option value="irrigation">Irrigation</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="pest_scouting">Pest Scouting</option>
            <option value="observation">Observation</option>
            <option value="harvest">Harvest</option>
            <option value="sale">Market Sale</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center">
          <p className="text-sm text-slate-500 mb-3">No farm events match the current filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedPlotId('all');
              setSelectedEventType('all');
            }}
            className="text-xs text-emerald-800 font-medium hover:underline"
          >
            Reset filter criteria
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 space-y-4">
          {filteredEvents.map((evt) => {
            const isRevenue = evt.cost && evt.cost < 0;
            const costAbs = evt.cost ? Math.abs(evt.cost) : null;

            return (
              <div
                key={evt.eventId}
                onClick={() => setActiveModalEvent(evt)}
                className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all hover:shadow-xs cursor-pointer focus:outline-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveModalEvent(evt);
                  }
                }}
              >
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 -translate-x-1/2 shadow-xs ${getEventBg(
                    evt.eventType
                  )}`}
                >
                  {getEventIcon(evt.eventType)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {formatDate(evt.activityDate)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-emerald-900">{evt.plotName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{evt.cropName}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-900 transition-colors flex items-center gap-1.5">
                      <span>{evt.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800 transition-transform group-hover:translate-x-0.5" />
                    </h4>

                    {evt.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* Quantity & Cost */}
                  <div className="sm:text-right shrink-0 pt-1 sm:pt-0">
                    {costAbs !== null && costAbs > 0 && (
                      <div
                        className={`text-sm font-semibold tabular-nums ${
                          isRevenue ? 'text-emerald-800' : 'text-slate-900'
                        }`}
                      >
                        {isRevenue ? `+ ₹${costAbs.toLocaleString('en-IN')}` : `₹${costAbs.toLocaleString('en-IN')}`}
                      </div>
                    )}
                    {evt.quantity !== null && evt.quantity !== undefined && (
                      <div className="text-xs text-slate-500 tabular-nums">
                        {evt.quantity} {evt.unit || ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer metadata & Trust indicator */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <TrustIndicator
                    status={evt.verificationStatus}
                    source={evt.source}
                  />

                  {/* Evidence tag */}
                  {evt.evidence.type !== 'none' && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      {evt.evidence.type === 'receipt' && (
                        <Receipt className="w-3 h-3 text-slate-400" />
                      )}
                      {evt.evidence.type === 'photo' && (
                        <Camera className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{evt.evidence.label || 'Attached evidence'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${getEventBg(
                    activeModalEvent.eventType
                  )}`}
                >
                  {getEventIcon(activeModalEvent.eventType)}
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
                    Farm Activity Record
                  </span>
                  <span className="text-xs text-slate-600 font-mono">
                    ID: {activeModalEvent.eventId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeModalEvent.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
              <span>{formatDate(activeModalEvent.activityDate)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-800">{activeModalEvent.plotName}</span>
              <span aria-hidden="true">·</span>
              <span>{activeModalEvent.cropName}</span>
            </div>

            {activeModalEvent.description && (
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed mb-4 border border-slate-100">
                {activeModalEvent.description}
              </div>
            )}

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Recorded Quantity</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {activeModalEvent.quantity !== null && activeModalEvent.quantity !== undefined
                    ? `${activeModalEvent.quantity} ${activeModalEvent.unit || ''}`
                    : 'Not applicable'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Recorded Amount</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {activeModalEvent.cost !== null && activeModalEvent.cost !== undefined
                    ? activeModalEvent.cost < 0
                      ? `+ ₹${Math.abs(activeModalEvent.cost).toLocaleString('en-IN')} (Revenue)`
                      : `₹${activeModalEvent.cost.toLocaleString('en-IN')} (Expense)`
                    : 'No expense recorded'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Area Covered</span>
                <span className="font-semibold text-slate-900">
                  {activeModalEvent.areaCoveredAcres
                    ? `${activeModalEvent.areaCoveredAcres} Acres`
                    : 'Full plot'}
                </span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Recorded By</span>
                <span className="font-semibold text-slate-900">
                  {activeModalEvent.createdBy}
                </span>
              </div>
            </div>

            {/* Evidence & Verification section */}
            <div className="border border-slate-200 rounded-lg p-3 mb-5 space-y-2 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-900 block">
                Verification & Trust State
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Status:</span>
                <TrustIndicator status={activeModalEvent.verificationStatus} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Input Source:</span>
                <span className="font-medium text-slate-700 capitalize">
                  {activeModalEvent.source.replace('_', ' ')}
                </span>
              </div>
              {activeModalEvent.evidence.type !== 'none' && (
                <div className="pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Evidence Record:</span>
                  <div className="text-slate-800 font-medium">
                    {activeModalEvent.evidence.label}
                  </div>
                  {activeModalEvent.evidence.notes && (
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {activeModalEvent.evidence.notes}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[36px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
