import React, { useState, useMemo, useEffect } from 'react';
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
  Layers,
  MapPin,
  ShieldAlert,
  Search,
  Check,
} from 'lucide-react';
import { FarmEvent, FarmEventType, Plot } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { TrustIndicator } from '../common/TrustIndicator';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { getTranslations } from '../../i18n/translations';
import {
  calculateFarmSummary,
  filterFarmEvents,
  formatUnitLabel,
  formatYieldDisplay,
  isEstimatedEvent,
  sanitizeEventConfidence,
} from '../../utils/farmSummary';

interface FarmTimelineProps {
  events: FarmEvent[];
  plots: Plot[];
  onSelectEvent?: (event: FarmEvent) => void;
  onRecordNewClick?: () => void;
  onConfirmEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onEditEvent?: (event: FarmEvent) => void;
  language?: AppLanguage;
  defaultPlotId?: string;
}

export const FarmTimeline: React.FC<FarmTimelineProps> = ({
  events,
  plots,
  onRecordNewClick,
  onConfirmEvent,
  onDeleteEvent,
  onEditEvent,
  language = 'Telugu',
  defaultPlotId = 'all',
}) => {
  const t = getTranslations(language);
  const [selectedPlotId, setSelectedPlotId] = useState<string>(defaultPlotId);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'all' | 'farmer' | 'demo'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCropMemorySummary, setShowCropMemorySummary] = useState<boolean>(true);

  const [activeModalEventId, setActiveModalEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<FarmEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<FarmEvent | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPlotId, setEditPlotId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Keep selectedPlotId aligned whenever parent changes defaultPlotId (e.g. switching plots in MyFarmScreen)
  useEffect(() => {
    setSelectedPlotId(defaultPlotId);
  }, [defaultPlotId]);

  const activeModalEvent = useMemo(
    () => (activeModalEventId ? events.find((e) => e.eventId === activeModalEventId) || null : null),
    [events, activeModalEventId]
  );

  // Events matching plot, event type, source, and search before category split so category tab counts always agree
  const categoryScopedEvents = useMemo(() => {
    return filterFarmEvents(events, {
      category: 'all',
      plotId: selectedPlotId,
      eventType: selectedEventType,
      source: selectedSourceFilter,
      searchQuery,
    });
  }, [events, selectedPlotId, selectedEventType, selectedSourceFilter, searchQuery]);

  // Filter and sort events via reusable pure production helper (never mutates input)
  const filteredEvents = useMemo(() => {
    return filterFarmEvents(events, {
      category: selectedFilterCategory,
      plotId: selectedPlotId,
      eventType: selectedEventType,
      source: selectedSourceFilter,
      searchQuery,
    });
  }, [events, selectedFilterCategory, selectedPlotId, selectedEventType, selectedSourceFilter, searchQuery]);

  // Determine if specific search or provenance filters are active
  const isFilterActive =
    selectedFilterCategory !== 'all' ||
    selectedEventType !== 'all' ||
    selectedSourceFilter !== 'all' ||
    Boolean(searchQuery.trim());

  // Farm summary always calculated directly from filteredEvents so summary, filters, search, and selected plot strictly agree
  // Strict rule: Demo data never contaminates real expenditure, real confirmed counts, real evidence, or real estimates
  const farmSummary = useMemo(() => {
    return calculateFarmSummary(filteredEvents);
  }, [filteredEvents]);

  const showingDemoSummary =
    selectedFilterCategory === 'demo' || (!farmSummary.hasRealData && farmSummary.hasDemoData);
  const activeEvidenceTally = showingDemoSummary
    ? farmSummary.demoEvidenceTally
    : farmSummary.realEvidenceTally;
  const activeEstimatedCount = showingDemoSummary
    ? farmSummary.demoEstimatedEventsCount
    : farmSummary.realEstimatedEventsCount;
  const activeEstimatedCost = showingDemoSummary
    ? farmSummary.demoEstimatedCostTotal
    : farmSummary.realEstimatedCostTotal;

  const getActivityIcon = (type: FarmEventType) => {
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
      case 'spray':
        return <Droplets className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
      case 'harvest':
        return <Wheat className="w-4 h-4 text-amber-800 dark:text-amber-300" />;
      case 'sale':
        return <IndianRupee className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    }
  };

  const getActivityBadgeLabel = (type: FarmEventType) => {
    switch (type) {
      case 'sowing':
        return t.timeline.activitySowing;
      case 'irrigation':
        return t.timeline.activityIrrigation;
      case 'fertilizer':
        return t.timeline.activityFertilizer;
      case 'pest_scouting':
      case 'observation':
        return t.timeline.activityPest;
      case 'spray':
        return t.timeline.activityPesticide;
      case 'harvest':
        return t.timeline.activityHarvest;
      default:
        return t.eventTypes[type] || type.replace(/_/g, ' ');
    }
  };

  const formatEventQuantity = (evt: FarmEvent): string => {
    if (evt.quantity === null || evt.quantity === undefined) {
      return t.timeline.unknownNotRecorded;
    }
    const prefix = evt.isEstimate || evt.source === 'ai_estimated' || evt.status === 'estimated' ? '~' : '';
    const normUnit = (evt.unit || '').trim().toLowerCase();
    if (evt.eventType === 'harvest' && (normUnit === 'quintal' || normUnit === 'quintals' || normUnit === 'qtl')) {
      return `${prefix}${formatYieldDisplay(evt.quantity, t)}`;
    }
    const unitLabel = formatUnitLabel(evt.unit, t);
    return `${prefix}${evt.quantity}${unitLabel ? ` ${unitLabel}` : ''}`;
  };

  const getEventBg = (type: FarmEventType, isEstimate?: boolean) => {
    if (isEstimate) {
      return 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 border-dashed';
    }
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
      case 'spray':
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
      case 'harvest':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700';
      case 'sale':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return t.home.unknownDate;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-IN', {
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

    const trimmedQty = editQuantity.trim();
    const numericQty = trimmedQty !== '' ? Number(trimmedQty) : null;
    const parsedQty = numericQty !== null && Number.isFinite(numericQty) ? numericQty : null;
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
  };

  return (
    <div className="space-y-4">
      {/* 1. Digital Farm Memory: Crop Cycle Executive Summary Card */}
      {showCropMemorySummary && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-200/70 dark:border-emerald-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {isFilterActive ? t.timeline.filteredActivitiesCount : t.timeline.cropMemoryTitle}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedPlotId === 'all'
                    ? t.timeline.allPlots
                    : plots.find((p) => p.id === selectedPlotId)?.name || t.timeline.selectedPlotLabel}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {t.timeline.whatHaveIDone}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-300 tabular-nums">
                {showingDemoSummary
                  ? `${farmSummary.demoTotalEvents} ${t.timeline.demoBadge}`
                  : `${farmSummary.realTotalEvents} ${t.timeline.activitiesSoFar}`}
              </span>
              <button
                type="button"
                onClick={() => setShowCropMemorySummary(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 p-1"
                title={t.timeline.hideSummaryTooltip}
                aria-label={t.timeline.hideSummaryTooltip}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explicit Demo Data Notice when in demo demonstration mode */}
          {showingDemoSummary && farmSummary.hasDemoData && (
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300 flex items-center justify-between">
              <span className="font-semibold">{t.timeline.demoSyntheticNotice}</span>
              <span className="font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-900 dark:text-sky-200 uppercase text-[10px]">
                {t.timeline.demoBadge}
              </span>
            </div>
          )}

          {/* Explicit boundary disclosure when both real farmer records and demo records are present */}
          {!showingDemoSummary && farmSummary.hasRealData && farmSummary.hasDemoData && (
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <span className="font-medium">
                {t.timeline.realFarmerSpend} — {farmSummary.demoTotalEvents} {t.timeline.demoBadge} ({t.timeline.excludedFromRealTotals})
              </span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-xs">
            {/* Total Invested / Expenditure */}
            <div className="p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">
                {showingDemoSummary ? t.timeline.demoSyntheticSpend : t.timeline.realFarmerSpend}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums block">
                ₹{showingDemoSummary ? farmSummary.demoExpenditure.toLocaleString('en-IN') : farmSummary.realExpenditure.toLocaleString('en-IN')}
              </span>
              {!showingDemoSummary && farmSummary.hasDemoData && (
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {t.timeline.demoRefLabel} ₹{farmSummary.demoExpenditure.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Confirmed Operations */}
            <div className="p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">
                {t.timeline.confirmationStatus}
              </span>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 tabular-nums block">
                {showingDemoSummary
                  ? `${farmSummary.demoConfirmedCount} ${t.timeline.demoConfirmedCountLabel}`
                  : `${farmSummary.realConfirmedCount} ${t.timeline.farmerConfirmedCountLabel}`}
              </span>
              {!showingDemoSummary && (
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {farmSummary.realPendingCount} {t.timeline.pendingReviewCountLabel}
                </span>
              )}
            </div>

            {/* Evidence Tally */}
            <div className="p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">
                {t.timeline.evidenceAttached}{showingDemoSummary ? ` (${t.timeline.demoBadge})` : ''}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-700 dark:text-slate-300 font-semibold">
                <span title={t.timeline.receiptsTooltip}><Receipt className="w-3.5 h-3.5 text-emerald-600" /></span>
                <span>{activeEvidenceTally.receipts}</span>
                <span className="text-slate-300">·</span>
                <span title={t.timeline.photosTooltip}><Camera className="w-3.5 h-3.5 text-sky-600" /></span>
                <span>{activeEvidenceTally.photos}</span>
                <span className="text-slate-300">·</span>
                <span title={t.timeline.gpsTooltip}><MapPin className="w-3.5 h-3.5 text-teal-600" /></span>
                <span>{activeEvidenceTally.gps}</span>
              </div>
            </div>

            {/* Estimates Safeguard */}
            <div className="p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">
                {t.timeline.aiEstimatesFlagged}{showingDemoSummary ? ` (${t.timeline.demoBadge})` : ''}
              </span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 tabular-nums block">
                {activeEstimatedCount} {activeEstimatedCount > 0 ? t.timeline.notFactsTag : ''}
              </span>
              {activeEstimatedCost > 0 && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                  ₹{activeEstimatedCost.toLocaleString('en-IN')} {t.timeline.projectedLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Controls & Search & Filter Bar */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Provenance Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterAll} ({categoryScopedEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('farmer')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'farmer'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterFarmer} ({categoryScopedEvents.filter((e) => !e.isDemo).length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('demo')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilterCategory === 'demo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.timeline.filterDemo} ({categoryScopedEvents.filter((e) => e.isDemo).length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.timeline.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={t.actions.close}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Plot select */}
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 focus:outline-hidden"
            aria-label={t.timeline.filterByPlotAria}
          >
            <option value="all">{t.timeline.allPlots}</option>
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cropName})
              </option>
            ))}
            <option value="unassigned">{t.timeline.unassignedPlot}</option>
          </select>

          {/* Activity type select */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 focus:outline-hidden"
            aria-label={t.timeline.filterByTypeAria}
          >
            <option value="all">{t.timeline.allTypes}</option>
            <option value="sowing">{t.timeline.activitySowing}</option>
            <option value="irrigation">{t.timeline.activityIrrigation}</option>
            <option value="fertilizer">{t.timeline.activityFertilizer}</option>
            <option value="pest_scouting">{t.timeline.activityPest}</option>
            <option value="spray">{t.timeline.activityPesticide}</option>
            <option value="harvest">{t.timeline.activityHarvest}</option>
            <option value="land_prep">{t.eventTypes.land_prep}</option>
            <option value="weeding">{t.eventTypes.weeding}</option>
          </select>

          {/* Evidence Model Filter */}
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 focus:outline-hidden"
            aria-label={t.timeline.filterByEvidenceAria}
          >
            <option value="all">{t.timeline.allEvidenceSources}</option>
            <option value="farmer_reported">{t.sources.farmer_reported}</option>
            <option value="farmer_confirmed">{t.sources.farmer_confirmed}</option>
            <option value="ai_extracted">{t.sources.ai_extracted}</option>
            <option value="ai_estimated">{t.sources.ai_estimated} {t.timeline.estimatesTag}</option>
            <option value="receipt_verified">{t.sources.receipt_verified}</option>
            <option value="gps_captured">{t.sources.gps_captured}</option>
            <option value="weather_data">{t.sources.weather_data}</option>
            <option value="soil_report">{t.sources.soil_report}</option>
          </select>

          {!showCropMemorySummary && (
            <button
              type="button"
              onClick={() => setShowCropMemorySummary(true)}
              className="ml-auto text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
            >
              {t.timeline.showMemorySummary}
            </button>
          )}
        </div>
      </div>

      {/* 3. Chronological Activity Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            {t.timeline.noMatchingRecords}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedPlotId(defaultPlotId);
              setSelectedEventType('all');
              setSelectedSourceFilter('all');
              setSelectedFilterCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
          >
            {t.timeline.resetFilterCriteria}
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-4">
          {filteredEvents.map((evt) => {
            const isEstimate = evt.isEstimate || evt.source === 'ai_estimated' || evt.status === 'estimated';
            const displayInput = evt.inputName || evt.fertilizerName || evt.productName;

            return (
              <div
                key={evt.eventId}
                className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all hover:shadow-xs ${
                  isEstimate
                    ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 -translate-x-1/2 shadow-xs ${getEventBg(
                    evt.eventType,
                    isEstimate
                  )}`}
                >
                  {getActivityIcon(evt.eventType)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1.5 flex-1">
                    {/* Top Row: Date · Activity Label · Plot & Crop */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Date Badge */}
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateDisplay(evt.activityDate)}</span>
                      </span>

                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

                      {/* Activity Type Badge */}
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]">
                        {getActivityBadgeLabel(evt.eventType)}
                      </span>

                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

                      {/* Plot & Crop */}
                      <span className="font-medium text-emerald-900 dark:text-emerald-400">
                        {evt.plotName || t.timeline.unassignedPlot} {evt.cropName ? `(${evt.cropName})` : ''}
                      </span>

                      {/* Demo Badge if applicable */}
                      {evt.isDemo && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                          {t.timeline.demoBadge}
                        </span>
                      )}

                      {/* History count badge */}
                      {evt.correctionHistory && evt.correctionHistory.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                          <History className="w-2.5 h-2.5" />
                          <span>{evt.correctionHistory.length} {t.timeline.editsCount}</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Clickable details */}
                    <h4
                      onClick={() => setActiveModalEventId(evt.eventId)}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{evt.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </h4>

                    {/* Primary Input Callout */}
                    {displayInput && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {t.timeline.inputLabel} <span className="text-emerald-800 dark:text-emerald-400 font-bold">{displayInput}</span>
                        </span>
                        {evt.quantity !== null && evt.quantity !== undefined && (
                          <span className="text-slate-500 dark:text-slate-400">
                            — {formatEventQuantity(evt)}
                          </span>
                        )}
                        {evt.areaCoveredAcres !== null && evt.areaCoveredAcres !== undefined && (
                          <span className="text-slate-400">
                            ({evt.areaCoveredAcres} {t.timeline.acresUnit})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description narrative */}
                    {evt.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    {/* Estimate Disclaimer Banner (Strict Rule: Avoid presenting estimates as facts) */}
                    {isEstimate && (
                      <div className="p-2 rounded-lg bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {t.timeline.estimateNotice} {evt.estimateRationale ? `(${evt.estimateRationale})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quantity / Cost & Action */}
                  <div className="sm:text-right shrink-0 pt-1 sm:pt-0 flex flex-col sm:items-end justify-between">
                    <div className="space-y-0.5">
                      {/* Quantity display */}
                      {evt.quantity !== null && evt.quantity !== undefined ? (
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatEventQuantity(evt)}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">{t.timeline.unknownNotRecorded}</div>
                      )}

                      {/* Cost display */}
                      {evt.cost !== null && evt.cost !== undefined ? (
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                          ₹{evt.cost.toLocaleString('en-IN')}
                        </div>
                      ) : null}
                    </div>

                    {/* Pending Confirmation Action Button (real, non-estimated records only) */}
                    {!evt.isDemo && !isEstimate && evt.status === 'pending_confirmation' && onConfirmEvent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onConfirmEvent(evt.eventId);
                        }}
                        className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md transition-colors min-h-[32px] shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.timeline.farmerConfirmSave}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Row: 8 Evidence Model Labels & Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Evidence Model Label */}
                    <EvidenceBadge
                      source={evt.source}
                      status={evt.status}
                      isEstimate={isEstimate}
                      language={language}
                      size="xs"
                      showDetails
                    />

                    {/* Confirmation Status */}
                    <TrustIndicator status={evt.status} size="sm" language={language} />

                    {/* Confidence Score only when backed by a documented source */}
                    {(() => {
                      const validConf = sanitizeEventConfidence(evt);
                      if (validConf.confidence === undefined || !validConf.confidenceSource) {
                        return null;
                      }
                      const sourceLabel =
                        validConf.confidenceSource === 'web_speech_api_asr'
                          ? t.timeline.asrConfidenceLabel
                          : validConf.confidenceSource === 'sensor_calibration'
                          ? t.timeline.sensorConfidenceLabel
                          : t.timeline.syntheticDemoConfidenceLabel;
                      return (
                        <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {Math.round(validConf.confidence * 100)}% · {sourceLabel}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalEventId(evt.eventId)}
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-[11px] font-medium"
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

      {/* 4. Edit Event Modal */}
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
                    placeholder={t.timeline.quantityPlaceholder}
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
                    placeholder={t.timeline.unitPlaceholder}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.timeline.notesLabel}
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  {t.timeline.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg"
                >
                  {t.timeline.saveChangesHistory}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {eventToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.timeline.deleteConfirmTitle}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.timeline.deleteConfirmText}: <strong>"{eventToDelete.title}"</strong>
            </p>
            <p className="text-slate-500 text-[11px]">
              {t.timeline.deleteLocalNotice}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.timeline.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEvent) onDeleteEvent(eventToDelete.eventId);
                  setEventToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-700 text-white font-bold"
              >
                {t.timeline.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Comprehensive Event Detail Modal (12 Supported Fields) */}
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
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${getEventBg(
                    activeModalEvent.eventType,
                    activeModalEvent.isEstimate
                  )}`}
                >
                  {getActivityIcon(activeModalEvent.eventType)}
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
                onClick={() => setActiveModalEventId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={t.actions.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {activeModalEvent.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>{formatDateDisplay(activeModalEvent.activityDate)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {activeModalEvent.plotName || t.timeline.unassignedPlot}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeModalEvent.cropName}</span>
            </div>

            {/* Strict Estimate Safeguard Banner */}
            {(activeModalEvent.isEstimate || activeModalEvent.source === 'ai_estimated') && (
              <div className="p-3 bg-amber-100/80 dark:bg-amber-950/60 rounded-xl text-xs mb-4 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>{t.timeline.notFactDisclaimer}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t.timeline.estimateNotice} {activeModalEvent.estimateRationale || ''}
                </p>
              </div>
            )}

            {/* Description */}
            {activeModalEvent.description && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 border border-slate-100 dark:border-slate-700">
                {activeModalEvent.description}
              </div>
            )}

            {/* Voice Transcript note if captured */}
            {activeModalEvent.rawTranscript && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-xs mb-4 border border-sky-200 dark:border-sky-800">
                <span className="font-semibold text-sky-900 dark:text-sky-200 block text-[11px] mb-1">
                  {t.timeline.capturedVoiceTranscript}
                </span>
                <p className="italic text-slate-700 dark:text-slate-300">"{activeModalEvent.rawTranscript}"</p>
              </div>
            )}

            {/* 12 Supported Fields Structured Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
              {/* Field 1: Activity */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.activityFieldLabel}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                  {getActivityIcon(activeModalEvent.eventType)}
                  <span>{getActivityBadgeLabel(activeModalEvent.eventType)}</span>
                </span>
              </div>

              {/* Field 2: Input */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.inputAppliedLabel}</span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-400 block mt-0.5">
                  {activeModalEvent.inputName || activeModalEvent.fertilizerName || activeModalEvent.productName || t.timeline.noneRecorded}
                </span>
              </div>

              {/* Field 3: Quantity */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.quantity}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums block mt-0.5">
                  {formatEventQuantity(activeModalEvent)}
                </span>
              </div>

              {/* Field 4: Area */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.areaCovered}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5">
                  {activeModalEvent.areaCoveredAcres !== null && activeModalEvent.areaCoveredAcres !== undefined
                    ? `${activeModalEvent.areaCoveredAcres} ${t.timeline.acresUnit}`
                    : t.timeline.unknownNotRecorded}
                </span>
              </div>

              {/* Field 5: Cost */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.totalInvestedCost}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums block mt-0.5">
                  {activeModalEvent.cost !== null && activeModalEvent.cost !== undefined
                    ? `₹${activeModalEvent.cost.toLocaleString('en-IN')}`
                    : t.timeline.unknownNotRecorded}
                </span>
              </div>

              {/* Field 6: Confidence */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.confidenceLabel}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5">
                  {(() => {
                    const validConf = sanitizeEventConfidence(activeModalEvent);
                    if (validConf.confidence === undefined || !validConf.confidenceSource) {
                      return t.timeline.notApplicableConfidence;
                    }
                    const sourceLabel =
                      validConf.confidenceSource === 'web_speech_api_asr'
                        ? t.timeline.asrConfidenceLabel
                        : validConf.confidenceSource === 'sensor_calibration'
                        ? t.timeline.sensorConfidenceLabel
                        : t.timeline.syntheticDemoConfidenceLabel;
                    return `${Math.round(validConf.confidence * 100)}% (${sourceLabel})`;
                  })()}
                </span>
              </div>

              {/* Field 7 & 8: Data Source & Confirmation */}
              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.dataSource}</span>
                <div className="mt-0.5">
                  <EvidenceBadge
                    source={activeModalEvent.source}
                    status={activeModalEvent.status}
                    isEstimate={activeModalEvent.isEstimate}
                    language={language}
                    size="xs"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.confirmationStatus}</span>
                <div className="mt-0.5">
                  <TrustIndicator status={activeModalEvent.status} size="sm" language={language} />
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.timeline.verificationStatus}</span>
                <div className="mt-0.5">
                  <TrustIndicator status={activeModalEvent.verificationStatus} size="sm" language={language} />
                </div>
              </div>
            </div>

            {/* Evidence Attachments Panel */}
            {activeModalEvent.evidence && activeModalEvent.evidence.type !== 'none' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    {activeModalEvent.evidence.type === 'receipt' ? (
                      <Receipt className="w-4 h-4 text-emerald-600" />
                    ) : activeModalEvent.evidence.type === 'photo' ? (
                      <Camera className="w-4 h-4 text-sky-600" />
                    ) : activeModalEvent.evidence.type === 'gps' ? (
                      <MapPin className="w-4 h-4 text-teal-600" />
                    ) : activeModalEvent.evidence.type === 'weather' ? (
                      <Droplets className="w-4 h-4 text-sky-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{t.timeline.attachedEvidenceLabel} {activeModalEvent.evidence.label || activeModalEvent.evidence.type}</span>
                  </div>
                  {activeModalEvent.evidence.isDocumentVerified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      {t.timeline.documentVerifiedBadge}
                    </span>
                  )}
                </div>

                {/* Receipt Details */}
                {activeModalEvent.evidence.receiptDetails && (
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">{t.timeline.vendorStationLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.receiptDetails.seller || t.timeline.unknownNotRecorded}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.invoiceDateLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.receiptDetails.date || t.timeline.unknownNotRecorded}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.itemQuantityLabel}</span>
                      <span className="font-semibold">
                        {activeModalEvent.evidence.receiptDetails.product} ({activeModalEvent.evidence.receiptDetails.quantity} {formatUnitLabel(activeModalEvent.evidence.receiptDetails.unit, t)})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.billedTotalLabel}</span>
                      <span className="font-bold text-emerald-700">₹{activeModalEvent.evidence.receiptDetails.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* GPS Details */}
                {activeModalEvent.evidence.gpsCoords && (
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                    <div className="font-semibold text-teal-800 dark:text-teal-300">
                      {t.timeline.coordinatesLabel} {activeModalEvent.evidence.gpsCoords.latitude}° N, {activeModalEvent.evidence.gpsCoords.longitude}° E
                    </div>
                    <div className="text-slate-500">
                      {t.timeline.accuracyLabel} ±{activeModalEvent.evidence.gpsCoords.accuracyMeters}m · {t.timeline.locationLabel} {activeModalEvent.evidence.gpsCoords.locationName}
                    </div>
                  </div>
                )}

                {/* Weather Details */}
                {activeModalEvent.evidence.weatherData && (
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                    <div className="font-semibold text-sky-800 dark:text-sky-300">
                      {t.timeline.stationLabel} {activeModalEvent.evidence.weatherData.sourceStation} · {t.timeline.conditionLabel} {activeModalEvent.evidence.weatherData.condition}
                    </div>
                    <div className="text-slate-500">
                      {t.timeline.tempLabel} {activeModalEvent.evidence.weatherData.temperatureC}°C · {t.timeline.rainfallLabel} {activeModalEvent.evidence.weatherData.rainfallMm} mm · {t.timeline.humidityLabel} {activeModalEvent.evidence.weatherData.humidityPercent}%
                    </div>
                  </div>
                )}

                {/* Product Package Details */}
                {activeModalEvent.evidence.productDetails && (
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">{t.timeline.productLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.productDetails.productName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.manufacturerLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.productDetails.manufacturer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.activeIngredientLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.productDetails.activeIngredient}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.timeline.batchExpiryLabel}</span>
                      <span className="font-semibold">{activeModalEvent.evidence.productDetails.batchNumber} / {activeModalEvent.evidence.productDetails.expiryDate}</span>
                    </div>
                  </div>
                )}

                {activeModalEvent.evidence.notes && (
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] italic">
                    "{activeModalEvent.evidence.notes}"
                  </p>
                )}
              </div>
            )}

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
                        <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{t.timeline.fieldLabel} {item.field}</span>
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

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              {!activeModalEvent.isDemo &&
                !isEstimatedEvent(activeModalEvent) &&
                activeModalEvent.status === 'pending_confirmation' &&
                onConfirmEvent && (
                <button
                  type="button"
                  onClick={() => {
                    onConfirmEvent(activeModalEvent.eventId);
                    setActiveModalEventId(null);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs"
                >
                  {t.timeline.farmerConfirmSave}
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalEventId(null)}
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
