import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { Plot, CropCycle, FarmEvent, FarmEventType } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';
import { getLocalDateString } from '../../services/voiceExtractor';
import { StorageResult } from '../../services/activityStorage';
import { getLocalizedStorageError } from '../../utils/farmSummary';

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  plots: Plot[];
  cropCycles: CropCycle[];
  onAddEvent: (event: FarmEvent) => StorageResult<FarmEvent>;
  language?: AppLanguage;
  farmerName?: string;
  farmerId?: string;
  farmId?: string;
}

export const QuickRecordModal: React.FC<QuickRecordModalProps> = ({
  isOpen,
  onClose,
  plots,
  cropCycles,
  onAddEvent,
  language = 'Telugu',
  farmerName = 'Ravi Kumar',
  farmerId = 'farmer-ravi-01',
  farmId = 'farm-ravi-01',
}) => {
  const t = getTranslations(language);

  const [plotId, setPlotId] = useState<string>(plots[0]?.id || 'plot-a');
  const [eventType, setEventType] = useState<FarmEventType>('irrigation');
  const [date, setDate] = useState<string>(() => getLocalDateString());
  const [title, setTitle] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('hours');
  const [cost, setCost] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPlot = plots.find((p) => p.id === plotId) || plots[0];
  const activeCycle = cropCycles.find(
    (c) => c.plotId === selectedPlot?.id && c.status === 'active'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const nowIso = new Date().toISOString();
    const parsedQuantity = quantity ? parseFloat(quantity) : null;
    const parsedCost = cost ? parseFloat(cost) : null;
    const newEvt: FarmEvent = {
      eventId: `EVT-${Date.now().toString().slice(-5)}`,
      eventType,
      farmerId,
      farmId,
      plotId: selectedPlot.id,
      plotName: selectedPlot.name,
      cropCycleId: activeCycle?.id || (selectedPlot.id === 'plot-a' ? 'cycle-paddy-current' : 'cycle-groundnut-01'),
      cropName: activeCycle?.cropName || (selectedPlot.id === 'plot-a' ? 'Paddy' : 'Groundnut'),
      activityDate: date,
      recordedDate: nowIso,
      title: title.trim() || `${t.eventTypes[eventType]} — ${selectedPlot.name}`,
      quantity: parsedQuantity !== null && Number.isFinite(parsedQuantity) ? parsedQuantity : null,
      unit: unit || undefined,
      areaCoveredAcres: selectedPlot.areaAcres,
      cost: parsedCost !== null && Number.isFinite(parsedCost) ? parsedCost : null,
      currency: 'INR',
      costType: parsedCost !== null && Number.isFinite(parsedCost) ? 'actual' : 'unknown',
      // Strict Provenance: manual submission is farmer-reported and pending confirmation, never auto-confirmed or independently verified
      source: 'farmer_reported',
      originalSource: 'farmer_reported',
      activitySource: 'manual_entry',
      evidenceType: 'farmer_statement',
      status: 'pending_confirmation',
      confirmationStatus: 'pending',
      verificationStatus: 'unverified',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: farmerName,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saveResult = onAddEvent(newEvt);

    if (saveResult.success) {
      setIsSubmitting(false);
      onClose();
    } else {
      setIsSubmitting(false);
      // Keep modal open and preserve form data for retry
      setErrorMessage(
        getLocalizedStorageError(saveResult.code, saveResult.error || t.errors.saveActivityFailed, t)
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-record-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h3 id="quick-record-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {t.quickRecordModal.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.quickRecordModal.subtitle} · {farmerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.actions.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                {t.quickRecordModal.dataPreservedNotice}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickRecordModal.plotLabel}
            </label>
            <select
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.areaAcres} {t.units.acres} - {p.cropName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickRecordModal.eventTypeLabel}
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as FarmEventType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              >
                <option value="land_prep">{t.eventTypes.land_prep}</option>
                <option value="irrigation">{t.eventTypes.irrigation}</option>
                <option value="fertilizer">{t.eventTypes.fertilizer}</option>
                <option value="spray">{t.eventTypes.spray}</option>
                <option value="sowing">{t.eventTypes.sowing}</option>
                <option value="weeding">{t.eventTypes.weeding}</option>
                <option value="observation">{t.eventTypes.observation}</option>
                <option value="harvest">{t.eventTypes.harvest}</option>
                <option value="other">{t.eventTypes.other}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickRecordModal.dateLabel}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickRecordModal.titleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.quickRecordModal.titlePlaceholder}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickRecordModal.quantityLabel}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t.record.quantityPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.quickRecordModal.unitLabel}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              >
                <option value="hours">{t.units.hours}</option>
                <option value="kg">{t.units.kg}</option>
                <option value="bags">{t.units.bags}</option>
                <option value="liters">{t.units.liters}</option>
                <option value="ml">{t.units.ml}</option>
                <option value="quintals">{t.units.quintals}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.quickRecordModal.costLabel}
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder={t.record.costPlaceholder}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors min-h-[40px]"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-xs min-h-[40px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? t.quickRecordModal.savingLabel : t.actions.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
