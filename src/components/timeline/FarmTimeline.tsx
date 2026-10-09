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
  Trash2,
  Edit2,
  AlertTriangle,
  History,
} from 'lucide-react';
import { FarmEvent, FarmEventType, Plot } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { TrustIndicator } from '../common/TrustIndicator';
import { getTranslations } from '../../i18n/translations';

interface FarmTimelineProps {
  events: FarmEvent[];
  plots: Plot[];
  onSelectEvent?: (event: FarmEvent) => void;
  onRecordNewClick?: () => void;
  onConfirmEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onEditEvent?: (event: FarmEvent) => void;
  language?: AppLanguage;
}

export const FarmTimeline: React.FC<FarmTimelineProps> = ({
  events,
  plots,
  onRecordNewClick,
  onConfirmEvent,
  onDeleteEvent,
  onEditEvent,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'all' | 'farmer' | 'demo'>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<FarmEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<FarmEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<FarmEvent | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPlotId, setEditPlotId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Filter events
  const filteredEvents = events.filter((evt) => {
    if (selectedFilterCategory === 'farmer' && evt.isDemo) return false;
    if (selectedFilterCategory === 'demo' && !evt.isDemo) return false;

    if (selectedPlotId !== 'all') {
      if (selectedPlotId === 'unassigned' && evt.plotId !== null) return false;
      if (selectedPlotId !== 'unassigned' && evt.plotId !== selectedPlotId) return false;
    }

    if (selectedEventType !== 'all' && evt.eventType !== selectedEventType) {
      return false;
    }
    return true;
  });

  const getEventIcon = (type: FarmEventType) => {
    switch (type) {
      case 'sowing':
        return <Sprout className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-sky-700 dark:text-sky-400" />;
      case 'fertilizer':
        return <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />;
      case 'pest_scouting':
      case 'observation':
        return <Eye className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />;
      case 'harvest':
        return <Wheat className="w-4 h-4 text-amber-800 dark:text-amber-300" />;
      case 'sale':
        return <IndianRupee className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    }
  };

  const getEventBg = (type: FarmEventType) => {
    switch (type) {
      case 'sowing':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'irrigation':
        return 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800';
      case 'fertilizer':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'pest_scouting':
      case 'observation':
        return 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
      case 'harvest':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700';
      case 'sale':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Date: Unknown';
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

  const handleStartEdit = (evt: FarmEvent) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditPlotId(evt.plotId);
    setEditDate(evt.activityDate ? evt.activityDate.split('T')[0] : '');
    setEditQuantity(evt.quantity !== null && evt.quantity !== undefined ? String(evt.quantity) : '');
    setEditUnit(evt.unit || '');
    setEditNotes(evt.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !onEditEvent) return;

    const parsedQty = editQuantity ? parseFloat(editQuantity) : null;
    const targetPlot = plots.find((p) => p.id === editPlotId);

    const updated: FarmEvent = {
      ...editingEvent,
      title: editTitle.trim() || editingEvent.title,
      plotId: editPlotId,
      plotName: targetPlot ? targetPlot.name : (editPlotId ? editingEvent.plotName : 'Not specified'),
      cropName: targetPlot ? targetPlot.cropName : editingEvent.cropName,
      activityDate: editDate ? editDate : editingEvent.activityDate,
      quantity: parsedQty,
      unit: editUnit ? editUnit.trim() : null,
      description: editNotes.trim() || undefined,
    };

    onEditEvent(updated);
    setEditingEvent(null);
    if (activeModalEvent?.eventId === editingEvent.eventId) {
      setActiveModalEvent(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Provenance Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterAll} ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('farmer')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'farmer'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterFarmer} ({events.filter((e) => !e.isDemo).length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('demo')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'demo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterDemo} (5)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Plot select */}
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 focus:outline-hidden"
            aria-label="Filter by Plot"
          >
            <option value="all">{t.timeline.allPlots}</option>
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="unassigned">{t.timeline.unassignedPlot}</option>
          </select>

          {/* Event type select */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 focus:outline-hidden"
            aria-label="Filter by Event Type"
          >
            <option value="all">{t.timeline.allTypes}</option>
            <option value="land_prep">Land Preparation</option>
            <option value="sowing">Seed Sowing</option>
            <option value="irrigation">Irrigation</option>
            <option value="fertilizer">Fertilizer Application</option>
            <option value="spray">Crop Spray / Treatment</option>
            <option value="pest_scouting">Pest Scouting</option>
            <option value="observation">Field Observation</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No activity records match your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedPlotId('all');
              setSelectedEventType('all');
              setSelectedFilterCategory('all');
            }}
            className="text-xs text-emerald-800 dark:text-emerald-400 font-medium hover:underline"
          >
            Reset filter criteria
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-4">
          {filteredEvents.map((evt) => {
            return (
              <div
                key={evt.eventId}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 transition-all hover:shadow-xs"
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 -translate-x-1/2 shadow-xs ${getEventBg(
                    evt.eventType
                  )}`}
                >
                  {getEventIcon(evt.eventType)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    {/* Top Row: Date · Plot · Provenance Banner */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatDate(evt.activityDate)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="font-medium text-emerald-900 dark:text-emerald-400">
                        {evt.plotName || 'Plot: Not specified'}
                      </span>
                      {evt.isDemo && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                          {t.timeline.demoBadge}
                        </span>
                      )}
                      {evt.correctionHistory && evt.correctionHistory.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                          <History className="w-2.5 h-2.5" />
                          <span>{evt.correctionHistory.length} {t.timeline.editsCount}</span>
                        </span>
                      )}
                    </div>

                    <h4
                      onClick={() => setActiveModalEvent(evt)}
                      className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{evt.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </h4>

                    {evt.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="sm:text-right shrink-0 pt-1 sm:pt-0 flex flex-col sm:items-end justify-between">
                    {evt.quantity !== null && evt.quantity !== undefined ? (
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {evt.quantity} {evt.unit || ''}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">{t.timeline.unknownNotRecorded}</div>
                    )}

                    {/* Pending Confirmation Action Button */}
                    {evt.status === 'pending_confirmation' && onConfirmEvent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onConfirmEvent(evt.eventId);
                        }}
                        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md transition-colors min-h-[32px] shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.timeline.farmerConfirmSave}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer metadata & Trust indicator */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <TrustIndicator status={evt.status} source={evt.source} language={language} />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalEvent(evt)}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 text-[11px] font-medium"
                    >
                      {t.timeline.viewDetails}
                    </button>
                    {!evt.isDemo && onEditEvent && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(evt)}
                        className="text-emerald-800 dark:text-emerald-400 hover:underline text-[11px] font-medium flex items-center gap-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{t.timeline.edit}</span>
                      </button>
                    )}
                    {!evt.isDemo && onDeleteEvent && (
                      <button
                        type="button"
                        onClick={() => setEventToDelete(evt)}
                        className="text-rose-700 hover:text-rose-900 text-[11px] font-medium flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t.timeline.delete}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.timeline.editModalTitle}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {t.timeline.saveChangesHistory}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.timeline.activityTitleLabel}
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timeline.plotLabel}
                  </label>
                  <select
                    value={editPlotId || ''}
                    onChange={(e) => setEditPlotId(e.target.value || null)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  >
                    <option value="">{t.timeline.unassignedPlot}</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timeline.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timeline.recordedQuantityLabel}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timeline.unitLabel}
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="kg, bags, hours..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.timeline.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {t.timeline.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  {t.timeline.saveChangesHistory}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Replaces browser window.confirm for iframe safety) */}
      {eventToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={t.timeline.deleteConfirmTitle}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3.5">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t.timeline.deleteConfirmTitle}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.timeline.deleteConfirmText} &ldquo;<strong>{eventToDelete.title}</strong>&rdquo;
            </p>
            <p className="text-[11px] text-slate-400">
              {t.timeline.deleteLocalNotice}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
              >
                {t.timeline.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEvent) onDeleteEvent(eventToDelete.eventId);
                  setEventToDelete(null);
                  if (activeModalEvent?.eventId === eventToDelete.eventId) {
                    setActiveModalEvent(null);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors"
              >
                {t.timeline.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${getEventBg(
                    activeModalEvent.eventType
                  )}`}
                >
                  {getEventIcon(activeModalEvent.eventType)}
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                    {activeModalEvent.isDemo ? t.timeline.demoRecordTitle : t.timeline.farmerRecordTitle}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    ID: {activeModalEvent.eventId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {activeModalEvent.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>{formatDate(activeModalEvent.activityDate)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {activeModalEvent.plotName || t.timeline.unassignedPlot}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeModalEvent.cropName}</span>
            </div>

            {activeModalEvent.description && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 border border-slate-100 dark:border-slate-700">
                {activeModalEvent.description}
              </div>
            )}

            {activeModalEvent.rawTranscript && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-xs mb-4 border border-sky-200 dark:border-sky-800">
                <span className="font-semibold text-sky-900 dark:text-sky-200 block text-[11px] mb-1">
                  {language === 'Telugu'
                    ? 'రికార్డ్ చేసిన వాయిస్ వివరాలు:'
                    : language === 'Hindi'
                    ? 'रिकॉर्ड किया गया वॉइस विवरण:'
                    : 'Captured Voice Transcript:'}
                </span>
                <p className="italic text-slate-700 dark:text-slate-300">"{activeModalEvent.rawTranscript}"</p>
              </div>
            )}

            {activeModalEvent.isDateAssigned && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-xs mb-4 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <span className="font-bold">
                  {language === 'Telugu'
                    ? 'గమనిక: '
                    : language === 'Hindi'
                    ? 'सूचना: '
                    : 'Notice: '}
                </span>
                {language === 'Telugu'
                  ? 'ఈ పనికి తేదీ నిర్దిష్టంగా మాట్లాడబడలేదు. సమీక్ష కోసం ఈరోజు తేదీని కేటాయించాము.'
                  : language === 'Hindi'
                  ? 'इस कार्य के लिए तारीख बोली नहीं गई थी। समीक्षा के लिए आज की तारीख नियत की गई है।'
                  : 'Activity date was not spoken in voice input. Assigned today for your review.'}
              </div>
            )}

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.quantity}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {activeModalEvent.quantity !== null && activeModalEvent.quantity !== undefined
                    ? `${activeModalEvent.quantity} ${activeModalEvent.unit || ''}`
                    : t.timeline.unknownNotRecorded}
                </span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.areaCovered}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {activeModalEvent.areaCoveredAcres !== null && activeModalEvent.areaCoveredAcres !== undefined
                    ? `${activeModalEvent.areaCoveredAcres} ${t.timeline.acresUnit}`
                    : t.timeline.unknownNotRecorded}
                </span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.dataSource}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                  {t.sources[activeModalEvent.source] || activeModalEvent.source.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.confirmationStatus}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {t.statuses[activeModalEvent.status] || activeModalEvent.status.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.verificationStatus}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {activeModalEvent.verificationStatus === 'confirmed'
                    ? t.timeline.independentlyVerified
                    : t.timeline.unverified}
                </span>
              </div>
            </div>

            {/* Correction History Viewer */}
            {activeModalEvent.correctionHistory && activeModalEvent.correctionHistory.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg mb-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 text-xs">
                  <History className="w-3.5 h-3.5" />
                  <span>{t.timeline.correctionHistory} ({activeModalEvent.correctionHistory.length} {t.timeline.editsCount})</span>
                </div>
                <div className="space-y-1.5">
                  {activeModalEvent.correctionHistory.map((item) => (
                    <div key={item.id} className="p-2 bg-white dark:bg-slate-900 rounded border border-amber-100 dark:border-amber-900/60 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">Field: {item.field}</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="text-rose-700 line-through mr-2">{String(item.oldValue)}</span>
                        <span className="text-emerald-700 font-bold">→ {String(item.newValue)}</span>
                      </div>
                      {item.reason && <div className="text-slate-400 text-[10px] mt-0.5">{item.reason}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {activeModalEvent.status === 'pending_confirmation' && onConfirmEvent && (
                <button
                  type="button"
                  onClick={() => {
                    onConfirmEvent(activeModalEvent.eventId);
                    setActiveModalEvent(null);
                  }}
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg text-xs"
                >
                  {t.timeline.farmerConfirmSave}
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalEvent(null)}
                  className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  {t.timeline.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
