import React, { useState } from 'react';
import { X, Send, Droplets, Sparkles, Eye, Sprout, Plus } from 'lucide-react';
import { Plot, CropCycle, FarmEvent, FarmEventType, EventSource } from '../../types/farm';

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  plots: Plot[];
  cropCycles: CropCycle[];
  onAddEvent: (event: FarmEvent) => void;
}

export const QuickRecordModal: React.FC<QuickRecordModalProps> = ({
  isOpen,
  onClose,
  plots,
  cropCycles,
  onAddEvent,
}) => {
  const [plotId, setPlotId] = useState<string>(plots[0]?.id || '');
  const [eventType, setEventType] = useState<FarmEventType>('irrigation');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('hours');
  const [cost, setCost] = useState<string>('');

  if (!isOpen) return null;

  const selectedPlot = plots.find((p) => p.id === plotId) || plots[0];
  const activeCycle = cropCycles.find(
    (c) => c.plotId === selectedPlot?.id && c.status === 'active'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvt: FarmEvent = {
      eventId: `evt-${Date.now().toString().slice(-4)}`,
      eventType,
      farmerId: 'farmer-01',
      farmId: 'farm-01',
      plotId: selectedPlot.id,
      plotName: selectedPlot.name,
      cropCycleId: activeCycle?.id || 'cycle-01',
      cropName: activeCycle?.cropName || 'Field',
      activityDate: date,
      recordedDate: new Date().toISOString(),
      title: title.trim() || `${eventType.toUpperCase()} on ${selectedPlot.name}`,
      quantity: quantity ? parseFloat(quantity) : null,
      unit: unit || undefined,
      areaCoveredAcres: selectedPlot.areaAcres,
      cost: cost ? parseFloat(cost) : null,
      currency: 'INR',
      source: 'farmer_reported',
      status: 'farmer_confirmed',
      isDemo: false,
      evidence: { type: 'none' },
      confidence: 1.0,
      verificationStatus: 'confirmed',
      createdBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Record Farm Event</h3>
            <p className="text-xs text-slate-500">Quick field activity log</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plot
            </label>
            <select
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.areaAcres} Acres)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as FarmEventType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              >
                <option value="irrigation">Irrigation</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="pest_scouting">Pest Scouting</option>
                <option value="weeding">Weeding</option>
                <option value="observation">Observation</option>
                <option value="sowing">Sowing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title / Activity Description
            </label>
            <input
              type="text"
              placeholder="e.g. 2nd Light Irrigation or Urea 50kg broadcast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cost in ₹ (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 600"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors min-h-[40px]"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
