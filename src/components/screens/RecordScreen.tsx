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
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Edit2,
  HelpCircle,
} from 'lucide-react';
import {
  FarmEvent,
  FarmEventType,
  Plot,
  CropCycle,
  EventSource,
  RecordStatus,
} from '../../types/farm';
import { FarmerPreferences } from '../../types/profile';
import { FarmTimeline } from '../timeline/FarmTimeline';
import { TrustIndicator } from '../common/TrustIndicator';
import { TRANSLATIONS } from '../../i18n/translations';
import { VoiceExtractorService, ExtractedDraft } from '../../services/voiceExtractor';

interface RecordScreenProps {
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  preferences: FarmerPreferences;
  onAddEvent: (event: FarmEvent) => void;
  onConfirmEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onEditEvent?: (event: FarmEvent) => void;
}

type RecordModality = 'overview' | 'voice' | 'camera' | 'quick' | 'form';

export const RecordScreen: React.FC<RecordScreenProps> = ({
  plots,
  cropCycles,
  events,
  preferences,
  onAddEvent,
  onConfirmEvent,
  onDeleteEvent,
  onEditEvent,
}) => {
  const t = TRANSLATIONS[preferences.appLanguage] || TRANSLATIONS.Telugu;

  const initialModality =
    preferences.interactionMode === 'Quick' ? 'quick' : 'overview';
  const [selectedModality, setSelectedModality] = useState<RecordModality>(initialModality);
  const [activeTab, setActiveTab] = useState<'record' | 'timeline'>('record');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formPlotId, setFormPlotId] = useState<string>(plots[0]?.id || '');
  const [formEventType, setFormEventType] = useState<FarmEventType>('land_prep');
  const [formActivityDate, setFormActivityDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('kg');
  const [formArea, setFormArea] = useState<string>('2.0');

  // Real Web Speech & Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceEngineError, setVoiceEngineError] = useState<string | null>(null);

  // Extracted Draft Review State
  const [extractedDraft, setExtractedDraft] = useState<ExtractedDraft | null>(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Camera prototype state
  const [cameraNote, setCameraNote] = useState<string | null>(null);

  const selectedPlotObj = plots.find((p) => p.id === formPlotId) || plots[0];

  /**
   * Starts real browser voice recording using Web Speech API
   */
  const handleStartVoiceRecording = async () => {
    setVoiceEngineError(null);
    setVoiceTranscript('');

    // Step 2: Request microphone permission
    const perm = await VoiceExtractorService.requestMicrophonePermission();
    if (!perm.granted) {
      setMicPermissionDenied(true);
      setVoiceEngineError(perm.error || 'Microphone access denied. You can still test with test phrases or manual entry.');
      return;
    }

    setMicPermissionDenied(false);

    if (!VoiceExtractorService.isSpeechRecognitionSupported()) {
      setVoiceEngineError(
        'Web Speech Recognition API is not supported in this browser. Please test using the exact Telugu test phrases below or manual text input.'
      );
      return;
    }

    setIsRecording(true);

    VoiceExtractorService.createSpeechRecognition(
      preferences.voiceLanguage,
      (result) => {
        setVoiceTranscript(result.transcript);
        if (result.isFinal) {
          processTranscript(result.transcript);
        }
      },
      (err) => {
        setIsRecording(false);
        setVoiceEngineError(err);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  /**
   * Processes a spoken or selected transcript into an AI Extracted Draft
   */
  const processTranscript = (text: string) => {
    const draft = VoiceExtractorService.extractFromTranscript(text, extractedDraft, events);
    setExtractedDraft(draft);

    if (draft.isDuplicateRequest) {
      setIsDuplicateModalOpen(true);
    }

    if (preferences.readAloud) {
      const spokenSummary =
        preferences.appLanguage === 'Telugu'
          ? `${draft.title} గుర్తించబడింది.`
          : preferences.appLanguage === 'Hindi'
          ? `${draft.title} पहचाना गया।`
          : `Recognized: ${draft.title}.`;
      VoiceExtractorService.speakText(spokenSummary, preferences.voiceLanguage);
    }
  };

  /**
   * Confirms and persists the extracted draft
   */
  const handleSaveExtractedDraft = (explicitlyConfirmed: boolean) => {
    if (!extractedDraft) return;

    const newEvt: FarmEvent = {
      eventId: `REC-${Date.now().toString().slice(-5)}`,
      eventType: extractedDraft.eventType,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: extractedDraft.plotId,
      plotName: extractedDraft.plotName || (extractedDraft.plotId === 'plot-a' ? 'Plot A — Paddy' : extractedDraft.plotId === 'plot-b' ? 'Plot B — Groundnut' : 'Not specified'),
      cropName: extractedDraft.cropName || (extractedDraft.plotId === 'plot-a' ? 'Paddy' : extractedDraft.plotId === 'plot-b' ? 'Groundnut' : 'Not specified'),
      activityDate: extractedDraft.activityDate,
      recordedDate: new Date().toISOString(),
      title: extractedDraft.title,
      description: `Spoken phrase: "${extractedDraft.rawTranscript}"`,
      quantity: extractedDraft.quantity,
      unit: extractedDraft.unit,
      areaCoveredAcres: extractedDraft.areaCoveredAcres,
      cost: null,
      currency: 'INR',
      source: explicitlyConfirmed ? 'farmer_confirmed' : 'ai_extracted',
      status: explicitlyConfirmed ? 'farmer_confirmed' : 'pending_confirmation',
      verificationStatus: explicitlyConfirmed ? 'confirmed' : 'pending',
      isDemo: false,
      evidence: {
        type: 'audio_note',
        label: `Voice dictate (${preferences.voiceLanguage})`,
        notes: extractedDraft.rawTranscript,
      },
      confidence: 0.95,
      createdBy: 'Ravi Kumar (Farmer)',
      confirmedBy: explicitlyConfirmed ? 'Ravi Kumar' : undefined,
      confirmedAt: explicitlyConfirmed ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    setSavedSuccessMsg(
      explicitlyConfirmed
        ? `Farmer confirmed and saved: "${newEvt.title}"!`
        : `Saved as pending confirmation: "${newEvt.title}".`
    );
    if (preferences.readAloud) {
      const msg =
        preferences.appLanguage === 'Telugu'
          ? `రికార్డు విజయవంతంగా సేవ్ చేయబడింది.`
          : preferences.appLanguage === 'Hindi'
          ? `रिकॉर्ड सफलतापूर्वक सहेजा गया।`
          : `Record saved successfully.`;
      VoiceExtractorService.speakText(msg, preferences.voiceLanguage);
    }
    setTimeout(() => setSavedSuccessMsg(null), 4000);

    setExtractedDraft(null);
    setVoiceTranscript('');
    setActiveTab('timeline');
  };

  /**
   * Detailed form submit handler
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      setErrorMessage('Please enter an activity title.');
      return;
    }

    const newEvt: FarmEvent = {
      eventId: `REC-${Date.now().toString().slice(-5)}`,
      eventType: formEventType,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: selectedPlotObj.id,
      plotName: selectedPlotObj.name,
      cropName: selectedPlotObj.cropName,
      activityDate: formActivityDate || null,
      recordedDate: new Date().toISOString(),
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      quantity: formQuantity ? parseFloat(formQuantity) : null,
      unit: formUnit || null,
      areaCoveredAcres: formArea ? parseFloat(formArea) : null,
      cost: null,
      currency: 'INR',
      source: 'farmer_reported',
      status: 'farmer_confirmed',
      verificationStatus: 'confirmed',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      confirmedBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    setSavedSuccessMsg(`Recorded "${newEvt.title}" into farm records!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);

    // Reset
    setFormTitle('');
    setFormDescription('');
    setFormQuantity('');
    setActiveTab('timeline');
  };

  /**
   * 1-Tap Quick Action handler
   */
  const handleQuickAction = (
    type: FarmEventType,
    title: string,
    plotId: string,
    qty: number | null,
    unit: string | null,
    area: number
  ) => {
    const targetPlot = plots.find((p) => p.id === plotId) || plots[0];
    const newEvt: FarmEvent = {
      eventId: `REC-${Date.now().toString().slice(-5)}`,
      eventType: type,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: targetPlot.id,
      plotName: targetPlot.name,
      cropName: targetPlot.cropName,
      activityDate: new Date().toISOString().split('T')[0],
      recordedDate: new Date().toISOString(),
      title,
      description: `Quick 1-tap recorded on ${targetPlot.name}.`,
      quantity: qty,
      unit,
      areaCoveredAcres: area,
      cost: null,
      currency: 'INR',
      source: 'farmer_reported',
      status: 'farmer_confirmed',
      verificationStatus: 'confirmed',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddEvent(newEvt);
    setSavedSuccessMsg(`Quick log saved: "${title}"!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);
    setActiveTab('timeline');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t.phaseBadge} · Ravi Kumar Farm (Rasapūdipalem)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.record.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t.record.subtitle}
            </p>
          </div>

          {/* Sub-tab: Record vs Full Timeline */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[36px] ${
                activeTab === 'record'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Capture New
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[36px] ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Activity Timeline ({events.length})
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {savedSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{savedSuccessMsg}</span>
            </div>
            <span
              className="text-[11px] text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
              onClick={() => setActiveTab('timeline')}
            >
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
                    ? 'border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-2.5">
                  <Mic className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.record.voiceTabTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.record.voiceTabDesc}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">
                  Language: {preferences.voiceLanguage}
                </div>
              </button>

              {/* Modality 2: Camera */}
              <button
                type="button"
                onClick={() => setSelectedModality('camera')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'camera'
                    ? 'border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 flex items-center justify-center mb-2.5">
                  <Camera className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.record.cameraTabTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.record.cameraTabDesc}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase">
                  Photo / Receipt
                </div>
              </button>

              {/* Modality 3: Quick Action */}
              <button
                type="button"
                onClick={() => setSelectedModality('quick')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'quick'
                    ? 'border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-2.5">
                  <Zap className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.record.quickTabTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.record.quickTabDesc}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">
                  1-Tap Ready
                </div>
              </button>

              {/* Modality 4: Form */}
              <button
                type="button"
                onClick={() => setSelectedModality('form')}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  selectedModality === 'form'
                    ? 'border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-2.5">
                  <FileSpreadsheet className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.record.formTabTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.record.formTabDesc}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">
                  Structured Entry
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area based on Tab and Selected Modality */}
      {activeTab === 'timeline' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Complete Farm Activity Records ({events.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Farmer reported, AI extracted, and Demo records with full provenance tracking.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('record');
                setSelectedModality('form');
              }}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Activity</span>
            </button>
          </div>
          <FarmTimeline
            events={events}
            plots={plots}
            onConfirmEvent={onConfirmEvent}
            onDeleteEvent={onDeleteEvent}
            onEditEvent={onEditEvent}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* VOICE MODALITY: REAL SPEECH + TEST PHRASES */}
          {selectedModality === 'voice' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Voice Activity Recording & AI Extraction
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Microphone is requested only on tap. Speech recognition runs in {preferences.voiceLanguage}.
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

              {/* Mic Status & Live Audio Button */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
                <button
                  type="button"
                  onClick={handleStartVoiceRecording}
                  disabled={isRecording}
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all shadow-md focus:outline-hidden ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                  aria-label="Start Voice Recording"
                >
                  <Mic className="w-8 h-8" />
                </button>

                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isRecording ? `Listening in ${preferences.voiceLanguage}...` : `Tap to Record Voice (${preferences.voiceLanguage})`}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Speak your farm activity naturally. Microphones are protected and explicitly requested.
                  </p>
                </div>

                {voiceEngineError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-lg text-xs text-left">
                    <div className="font-semibold mb-0.5">Voice Notice:</div>
                    <div>{voiceEngineError}</div>
                  </div>
                )}

                {voiceTranscript && (
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left text-xs">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                      Transcribed Speech:
                    </span>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      "{voiceTranscript}"
                    </div>
                  </div>
                )}

                {/* Section 6 Test Phrases A, B, C, D, E, F */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Section 6: Required Test Phrases (Telugu & Multilingual)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      1-TAP ACCEPTANCE TEST RUNNERS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Test Phrase A */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = 'ఈరోజు రెండు ఎకరాలకు 40 కిలోల యూరియా వేశాను.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase A (Fertilizer)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "ఈరోజు రెండు ఎకరాలకు 40 కిలోల యూరియా వేశాను."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Fertilizer Urea, 40 kg, 2 acres, Today, Plot: Unknown (not guessed)
                      </div>
                    </button>

                    {/* Test Phrase B */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = 'నిన్న Plot B లో విత్తనాలు వేశాను.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase B (Sowing on Plot B)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "నిన్న Plot B లో విత్తనాలు వేశాను."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Sowing, Yesterday, Plot B, Groundnut (associated), Variety: Unknown
                      </div>
                    </button>

                    {/* Test Phrase C */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = 'ఈరోజు పంటకు నీళ్లు పెట్టాను.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase C (Irrigation)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "ఈరోజు పంటకు నీళ్లు పెట్టాను."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Irrigation, Today, Plot: Unknown until clarified
                      </div>
                    </button>

                    {/* Test Phrase D */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = 'రెండు ఎకరాలకు మందు కొట్టాను.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase D (Crop Treatment)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "రెండు ఎకరాలకు మందు కొట్టాను."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Spray/treatment (tentative), 2 acres, Product: Unknown (do not invent)
                      </div>
                    </button>

                    {/* Test Phrase E */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = '40 కిలోలు కాదు, 20 కిలోలు.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase E (Quantity Correction)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "40 కిలోలు కాదు, 20 కిలోలు."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Corrects quantity from 40 to 20 kg, preserves correction history
                      </div>
                    </button>

                    {/* Test Phrase F */}
                    <button
                      type="button"
                      onClick={() => {
                        const phrase = 'అదే పని మళ్లీ సేవ్ చేయి.';
                        setVoiceTranscript(phrase);
                        processTranscript(phrase);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-emerald-700 transition-colors"
                    >
                      <div className="font-bold text-emerald-900 dark:text-emerald-400 text-[11px]">
                        Test Phrase F (Duplicate Detection)
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
                        "అదే పని మళ్లీ సేవ్ చేయి."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Expected: Detects potential duplicate, asks farmer before duplicating
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 6-8: Extracted Draft Review & Confirmation Screen */}
              {extractedDraft && (
                <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>{t.record.reviewExtractedTitle}</span>
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300">
                        {t.record.reviewExtractedDesc}
                      </p>
                    </div>
                    <TrustIndicator status={extractedDraft.status} source={extractedDraft.source} />
                  </div>

                  {/* Clarification prompt if any field was unknown */}
                  {extractedDraft.needsClarification && extractedDraft.needsClarification.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1.5">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Clarification Needed:</span>
                      </div>
                      {extractedDraft.needsClarification.map((c, i) => (
                        <div key={i} className="text-amber-800 dark:text-amber-300">
                          {c.question}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extracted Fields (Editable by the Farmer) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Activity Headline
                      </label>
                      <input
                        type="text"
                        value={extractedDraft.title}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, title: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Activity Date
                      </label>
                      <input
                        type="date"
                        value={extractedDraft.activityDate || ''}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, activityDate: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Associated Plot *
                      </label>
                      <select
                        value={extractedDraft.plotId || ''}
                        onChange={(e) => {
                          const pId = e.target.value || null;
                          const pObj = plots.find((p) => p.id === pId);
                          setExtractedDraft({
                            ...extractedDraft,
                            plotId: pId,
                            plotName: pObj ? pObj.name : 'Unknown',
                            cropName: pObj ? pObj.cropName : 'Unknown',
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="">Unknown / Not Clarified</option>
                        {plots.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.areaAcres} Acres)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Recorded Quantity
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={extractedDraft.quantity !== null ? extractedDraft.quantity : ''}
                          onChange={(e) =>
                            setExtractedDraft({
                              ...extractedDraft,
                              quantity: e.target.value ? parseFloat(e.target.value) : null,
                            })
                          }
                          placeholder="Unknown"
                          className="w-2/3 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={extractedDraft.unit || ''}
                          onChange={(e) =>
                            setExtractedDraft({ ...extractedDraft, unit: e.target.value })
                          }
                          placeholder="kg"
                          className="w-1/3 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExtractedDraft(null)}
                      className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Discard Draft
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveExtractedDraft(false)}
                        className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        Save as Pending
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveExtractedDraft(true)}
                        className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Farmer Confirm & Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUICK 1-TAP ACTION LOGGERS */}
          {(selectedModality === 'quick' || selectedModality === 'overview') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Quick 1-Tap Loggers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Log common field routines directly on Plot A or Plot B in 1 tap.
                  </p>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                  Zero Form Friction
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {/* 1. Plot A - Paddy Land Prep */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'land_prep',
                      'Land preparation on Plot A',
                      'plot-a',
                      null,
                      null,
                      2.0
                    )
                  }
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Land Prep (Paddy)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot A (2 Acres)</div>
                </button>

                {/* 2. Plot B - Groundnut Land Prep */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'land_prep',
                      'Land preparation on Plot B',
                      'plot-b',
                      null,
                      null,
                      3.0
                    )
                  }
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sprout className="w-5 h-5 text-amber-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Land Prep (Groundnut)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot B (3 Acres)</div>
                </button>

                {/* 3. Irrigation on Plot A */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'irrigation',
                      'Irrigation on Plot A (Paddy)',
                      'plot-a',
                      null,
                      'runtime hours',
                      2.0
                    )
                  }
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Droplets className="w-5 h-5 text-sky-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Irrigation (Paddy)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot A (2 Acres)</div>
                </button>

                {/* 4. Routine Field Scouting */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'observation',
                      'Morning Field Walk Inspection',
                      'plot-b',
                      null,
                      null,
                      3.0
                    )
                  }
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      + Log
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Field Inspection</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">No pest/disease found</div>
                </button>
              </div>
            </div>
          )}

          {/* DETAILED STRUCTURED FORM */}
          {(selectedModality === 'form' || selectedModality === 'overview') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Structured Field Entry Form
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      When precision matters: recorded into persistent local farm memory.
                    </p>
                  </div>
                  <TrustIndicator status="confirmed" size="sm" />
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Plot */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Plot *
                    </label>
                    <select
                      value={formPlotId}
                      onChange={(e) => {
                        setFormPlotId(e.target.value);
                        const p = plots.find((item) => item.id === e.target.value);
                        if (p) setFormArea(String(p.areaAcres));
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                      required
                    >
                      {plots.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.areaAcres} Acres — {p.cropName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Activity Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Activity Type *
                    </label>
                    <select
                      value={formEventType}
                      onChange={(e) => setFormEventType(e.target.value as FarmEventType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                      required
                    >
                      <option value="land_prep">Land Preparation</option>
                      <option value="sowing">Seed Sowing</option>
                      <option value="irrigation">Irrigation</option>
                      <option value="fertilizer">Fertilizer Application</option>
                      <option value="spray">Crop Spray / Treatment</option>
                      <option value="weeding">Weeding</option>
                      <option value="pest_scouting">Pest Scouting</option>
                      <option value="observation">General Observation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Activity Date
                    </label>
                    <input
                      type="date"
                      value={formActivityDate}
                      onChange={(e) => setFormActivityDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Area Covered (Acres)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Activity Title / Description *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deep summer ploughing or Trichoderma treatment"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    required
                  />
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Quantity (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 40"
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Measurement Unit
                    </label>
                    <input
                      type="text"
                      placeholder="kg, bags, hours..."
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Source: Farmer reported · Saved durably to local storage.
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save to Activity Records</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Duplicate Detection Dialog (Test Phrase F) */}
      {isDuplicateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Potential Duplicate Detected</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              You said: "అదే పని మళ్లీ సేవ్ చేయి" (Save the same task again). A matching activity was already saved recently.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Would you like to create another separate record, or keep the existing record as is?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDuplicateModalOpen(false);
                  setExtractedDraft(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Keep Existing Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDuplicateModalOpen(false);
                  handleSaveExtractedDraft(true);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold"
              >
                Create Another Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
