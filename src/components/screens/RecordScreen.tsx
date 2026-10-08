import React, { useState } from 'react';
import {
  Mic,
  Camera,
  Zap,
  FileSpreadsheet,
  Droplets,
  Sparkles,
  Eye,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Send,
  Plus,
  Sprout,
} from 'lucide-react';
import {
  FarmEvent,
  FarmEventType,
  Plot,
  CropCycle,
  EventSource,
} from '../../types/farm';
import { FarmerPreferences } from '../../types/profile';
import { FarmTimeline } from '../timeline/FarmTimeline';
import { TrustIndicator } from '../common/TrustIndicator';

interface RecordScreenProps {
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  preferences?: FarmerPreferences;
  onAddEvent: (event: FarmEvent) => void;
  onViewTimeline?: () => void;
}

type RecordModality = 'overview' | 'voice' | 'camera' | 'quick' | 'form';

export const RecordScreen: React.FC<RecordScreenProps> = ({
  plots,
  cropCycles,
  events,
  preferences,
  onAddEvent,
}) => {
  const initialModality =
    preferences?.interactionMode === 'simplified' ? 'quick' : 'overview';
  const [selectedModality, setSelectedModality] = useState<RecordModality>(initialModality);
  const [activeTab, setActiveTab] = useState<'record' | 'timeline'>('record');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formPlotId, setFormPlotId] = useState<string>(plots[0]?.id || '');
  const [formEventType, setFormEventType] = useState<FarmEventType>('irrigation');
  const [formActivityDate, setFormActivityDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('hours runtime');
  const [formCost, setFormCost] = useState<string>('');
  const [formSource, setFormSource] = useState<EventSource>('farmer_reported');

  // Simulated Voice State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSampleText, setVoiceSampleText] = useState('');

  // Simulated Camera State
  const [selectedSamplePhoto, setSelectedSamplePhoto] = useState<string | null>(null);

  const selectedPlotObj = plots.find((p) => p.id === formPlotId) || plots[0];
  const activeCycle = cropCycles.find(
    (c) => c.plotId === selectedPlotObj?.id && c.status === 'active'
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvt: FarmEvent = {
      eventId: `evt-${Date.now().toString().slice(-4)}`,
      eventType: formEventType,
      farmerId: 'farmer-01',
      farmId: 'farm-01',
      plotId: selectedPlotObj.id,
      plotName: selectedPlotObj.name,
      cropCycleId: activeCycle?.id || 'cycle-none',
      cropName: activeCycle?.cropName || 'Field Soil',
      activityDate: formActivityDate,
      recordedDate: new Date().toISOString(),
      title: formTitle.trim() || `${formEventType.toUpperCase()} on ${selectedPlotObj.name}`,
      description: formDescription.trim() || undefined,
      quantity: formQuantity ? parseFloat(formQuantity) : null,
      unit: formUnit || undefined,
      areaCoveredAcres: selectedPlotObj.areaAcres,
      cost: formCost ? parseFloat(formCost) : null,
      currency: 'INR',
      source: formSource,
      evidence: {
        type: 'none',
        label: 'Direct field entry',
      },
      confidence: 1.0,
      verificationStatus: 'confirmed',
      createdBy: 'Ramesh Patel (Farmer)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    setSavedSuccessMsg(`Recorded "${newEvt.title}" successfully into farm timeline!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);

    // Reset fields
    setFormTitle('');
    setFormDescription('');
    setFormQuantity('');
    setFormCost('');
    setSelectedModality('overview');
    setActiveTab('timeline');
  };

  const handleQuickAction = (
    type: FarmEventType,
    title: string,
    unit: string,
    defaultQty: number,
    cost: number
  ) => {
    const newEvt: FarmEvent = {
      eventId: `evt-${Date.now().toString().slice(-4)}`,
      eventType: type,
      farmerId: 'farmer-01',
      farmId: 'farm-01',
      plotId: plots[0].id,
      plotName: plots[0].name,
      cropCycleId: cropCycles[0]?.id || 'cycle-01',
      cropName: cropCycles[0]?.cropName || 'Wheat',
      activityDate: new Date().toISOString().split('T')[0],
      recordedDate: new Date().toISOString(),
      title,
      description: `Quick 1-tap recorded on ${plots[0].name}.`,
      quantity: defaultQty,
      unit,
      areaCoveredAcres: plots[0].areaAcres,
      cost,
      currency: 'INR',
      source: 'farmer_reported',
      evidence: { type: 'none' },
      confidence: 0.95,
      verificationStatus: 'confirmed',
      createdBy: 'Ramesh Patel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    setSavedSuccessMsg(`Quick log saved: "${title}" on ${plots[0].name}!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);
    setActiveTab('timeline');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              Activity & Input Capture · Phase 0 Foundation
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What happened on your farm?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Zero unnecessary friction — voice when busy, camera when seeing is easier, forms when precision matters.
            </p>
          </div>

          {/* Sub-tab: Record vs Full Timeline */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[36px] ${
                activeTab === 'record'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Capture New
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[36px] ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Farm Timeline ({events.length})
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {savedSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{savedSuccessMsg}</span>
            </div>
            <span className="text-[11px] text-emerald-700 underline cursor-pointer" onClick={() => setActiveTab('timeline')}>
              View in timeline
            </span>
          </div>
        )}

        {/* 4 Input Modalities Selector */}
        {activeTab === 'record' && (
          <div className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Modality 1: Voice */}
              <button
                type="button"
                onClick={() => setSelectedModality('voice')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'voice'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-2.5">
                  <Mic className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900">Voice</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When busy in the field
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase">
                  Phase 0 Prototype
                </div>
              </button>

              {/* Modality 2: Camera */}
              <button
                type="button"
                onClick={() => setSelectedModality('camera')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'camera'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-sky-100/70 text-sky-800 flex items-center justify-center mb-2.5">
                  <Camera className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900">Camera</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When seeing is easier
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase">
                  Phase 0 Prototype
                </div>
              </button>

              {/* Modality 3: Quick Action */}
              <button
                type="button"
                onClick={() => setSelectedModality('quick')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'quick'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-2.5">
                  <Zap className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900">Quick Actions</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When repetition matters
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800 uppercase">
                  1-Tap Ready
                </div>
              </button>

              {/* Modality 4: Form */}
              <button
                type="button"
                onClick={() => setSelectedModality('form')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'form'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2.5">
                  <FileSpreadsheet className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900">Detailed Form</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When precision matters
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800 uppercase">
                  Structured Entry
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area based on Tab and Selected Modality */}
      {activeTab === 'timeline' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Complete Farm Timeline
              </h2>
              <p className="text-xs text-slate-500">
                All recorded farm events, verified vouchers, and observations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('record');
                setSelectedModality('form');
              }}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Event</span>
            </button>
          </div>
          <FarmTimeline events={events} plots={plots} />
        </div>
      ) : (
        /* Recording Modalities */
        <div className="space-y-6">
          {/* Modality: VOICE INTERFACE (Prototype preview) */}
          {selectedModality === 'voice' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Voice Event Recording
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                      PHASE 0 PROTOTYPE · AI SIMULATED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Designed for hands-free logging while tractor driving or standing in muddy furrows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModality('overview')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-4">
                <div
                  onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                  className={`w-18 h-18 rounded-full mx-auto flex items-center justify-center cursor-pointer transition-all shadow-md ${
                    isVoiceRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle voice recording prototype"
                >
                  <Mic className="w-8 h-8" />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {isVoiceRecording ? 'Listening in Hindi / English...' : 'Tap to Test Voice Capture'}
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try tapping one of these common field phrases below to see how voice extraction will structure into a FarmEvent:
                  </p>
                </div>

                {/* Sample voice presets */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    'Finished 5 hours tube-well irrigation on North Canal Acre',
                    'Broadcasted 2 bags urea on River Bend field today',
                    'Noticed leaf spots on border rows during morning walk',
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVoiceSampleText(phrase)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg text-slate-700 hover:border-emerald-700 hover:text-emerald-900 transition-colors min-h-[36px]"
                    >
                      "{phrase}"
                    </button>
                  ))}
                </div>

                {voiceSampleText && (
                  <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl text-left text-xs space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Simulated Voice Transcript Preview
                    </span>
                    <div className="p-2.5 bg-slate-50 rounded font-medium text-slate-800">
                      "{voiceSampleText}"
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      AI Speech & NLP extraction will be activated in subsequent phases with farmer confirmation prompts before saving.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modality: CAMERA INTERFACE (Prototype preview) */}
          {selectedModality === 'camera' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Camera Observation & Voucher Capture
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                      PHASE 0 PROTOTYPE · NOT LIVE OCR
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For scanning fertilizer bills, seed tags, or capturing crop symptoms without manual typing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModality('overview')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    title: 'Fertilizer Purchase Receipt',
                    type: 'receipt',
                    desc: 'Scans cash voucher #441 for Urea 100kg',
                  },
                  {
                    title: 'Tillering Canopy Photo',
                    type: 'canopy',
                    desc: 'Photo proof for vegetative vigor index',
                  },
                  {
                    title: 'Pheromone Trap Scouting',
                    type: 'scouting',
                    desc: 'Visual count of pod borer moth capture',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedSamplePhoto(item.title)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
                      selectedSamplePhoto === item.title
                        ? 'border-emerald-700 bg-emerald-50/60'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-2">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>

              {selectedSamplePhoto && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center justify-between">
                  <span>Selected sample: <strong>{selectedSamplePhoto}</strong></span>
                  <span className="text-[11px] text-sky-700 font-medium">
                    Evidence attached to session
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Modality: QUICK ACTIONS (1-tap working loggers) */}
          {(selectedModality === 'quick' || selectedModality === 'overview') && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Quick 1-Tap Loggers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log common field routines directly on {plots[0].name} in 1 tap.
                  </p>
                </div>
                <span className="text-xs text-emerald-800 font-semibold">
                  Zero Form Friction
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {/* 1. Irrigation */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'irrigation',
                      'Canal Irrigation (4 Hours)',
                      'hours runtime',
                      4,
                      500
                    )
                  }
                  className="p-3.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Droplets className="w-5 h-5 text-sky-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log Now
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">4 Hr Irrigation</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">₹500 canal cess</div>
                </button>

                {/* 2. Fertilizer */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'fertilizer',
                      'Urea Top Dressing (50 kg)',
                      'kg',
                      50,
                      300
                    )
                  }
                  className="p-3.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log Now
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">Urea Split (50 kg)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">₹300 input cost</div>
                </button>

                {/* 3. Field Scouting */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'observation',
                      'Routine Morning Field Walk',
                      'observation check',
                      1,
                      0
                    )
                  }
                  className="p-3.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log Now
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">Field Scouting</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">No pest/disease found</div>
                </button>

                {/* 4. Manual Weeding */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'weeding',
                      'Hand Weeding & Hoeing',
                      'labor mandays',
                      2,
                      900
                    )
                  }
                  className="p-3.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log Now
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">Manual Weeding</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">₹900 labor (2 mandays)</div>
                </button>
              </div>
            </div>
          )}

          {/* Modality: DETAILED FORM (Full Precision Structured Logging) */}
          {(selectedModality === 'form' || selectedModality === 'overview') && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="pb-3 border-b border-slate-100 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Structured Field Entry Form
                    </h3>
                    <p className="text-xs text-slate-500">
                      When precision matters: recorded into persistent local farm memory.
                    </p>
                  </div>
                  <TrustIndicator status="confirmed" size="sm" />
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Plot selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Plot *
                    </label>
                    <select
                      value={formPlotId}
                      onChange={(e) => setFormPlotId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                      required
                    >
                      {plots.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.areaAcres} Acres)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Activity Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Activity / Event Type *
                    </label>
                    <select
                      value={formEventType}
                      onChange={(e) => setFormEventType(e.target.value as FarmEventType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                      required
                    >
                      <option value="irrigation">Irrigation</option>
                      <option value="fertilizer">Fertilizer Application</option>
                      <option value="pest_scouting">Pest / Disease Scouting</option>
                      <option value="weeding">Weeding / Intercultural</option>
                      <option value="spray">Foliar Spray</option>
                      <option value="observation">General Field Observation</option>
                      <option value="harvest">Harvest</option>
                      <option value="sale">Market Sale</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Activity Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Activity Date *
                    </label>
                    <input
                      type="date"
                      value={formActivityDate}
                      onChange={(e) => setFormActivityDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                      required
                    />
                  </div>

                  {/* Source / Trust Tag */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data Origin Source *
                    </label>
                    <select
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value as EventSource)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                    >
                      <option value="farmer_reported">Farmer Reported (Self)</option>
                      <option value="farmer_confirmed">Farmer Confirmed</option>
                      <option value="verified_document">Verified Document / Voucher</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Title / Activity Headline *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Irrigation via Canal Lift or NPK 12:32:16 application"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Notes / Field Condition
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes on soil moisture, chemical brand lot, or crop response..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Numeric fields: Quantity & Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantity (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 100"
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Measurement Unit
                    </label>
                    <input
                      type="text"
                      placeholder="kg, liters, hours, bags..."
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recorded Cost (INR)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 1450"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Saves directly to local timeline and memory cache.
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save to Farm Timeline</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
