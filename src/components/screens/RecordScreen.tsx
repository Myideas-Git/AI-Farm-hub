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
  Receipt,
  Image,
  Upload,
  ChevronRight,
  X,
  ShieldCheck,
  Radio,
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
import { getTranslations } from '../../i18n/translations';
import { VoiceExtractorService, ExtractedDraft, getLocalDateString } from '../../services/voiceExtractor';
import { StorageResult } from '../../services/activityStorage';
import { getLocalizedStorageError } from '../../utils/farmSummary';

interface RecordScreenProps {
  plots: Plot[];
  cropCycles: CropCycle[];
  events: FarmEvent[];
  preferences: FarmerPreferences;
  onAddEvent: (event: FarmEvent) => StorageResult<FarmEvent>;
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
  const t = getTranslations(preferences.appLanguage);

  const initialModality =
    preferences.interactionMode === 'Quick' ? 'quick' : 'overview';
  const [selectedModality, setSelectedModality] = useState<RecordModality>(initialModality);
  const [activeTab, setActiveTab] = useState<'record' | 'timeline'>('record');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formPlotId, setFormPlotId] = useState<string>(plots[0]?.id || 'plot-a');
  const [formEventType, setFormEventType] = useState<FarmEventType>('land_prep');
  const [formActivityDate, setFormActivityDate] = useState<string>(() =>
    getLocalDateString()
  );
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formInputName, setFormInputName] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('kg');
  const [formArea, setFormArea] = useState<string>('2.0');
  const [formCost, setFormCost] = useState<string>('');

  // Real Web Speech & Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceEngineError, setVoiceEngineError] = useState<string | null>(null);

  // Extracted Draft Review State
  const [extractedDraft, setExtractedDraft] = useState<ExtractedDraft | null>(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Camera & Multimodal workflow state
  const [cameraSubject, setCameraSubject] = useState<'fertilizer' | 'receipt' | 'crop'>('fertilizer');
  const [cameraCapturedImage, setCameraCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState<boolean>(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [cameraAnalysisError, setCameraAnalysisError] = useState<string | null>(null);
  const [combinedVoiceContext, setCombinedVoiceContext] = useState<string>('');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

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
    const draft = VoiceExtractorService.extractFromTranscript(text, extractedDraft, events, plots);
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

    const finalStatus: RecordStatus = isSimulatedOffline
      ? 'pending_ai_processing'
      : (explicitlyConfirmed ? 'farmer_confirmed' : 'pending_confirmation');

    const extractedCost = extractedDraft.receiptInspection?.amount ?? null;
    const hasReceipt = Boolean(extractedDraft.receiptInspection);
    const activitySource = cameraCapturedImage ? 'camera_assisted' : 'voice_input';
    const evidenceType = hasReceipt
      ? 'receipt'
      : cameraCapturedImage
      ? 'photograph'
      : 'farmer_statement';

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
      inputName: extractedDraft.fertilizerName || extractedDraft.productName || (extractedDraft.receiptInspection ? extractedDraft.receiptInspection.product || undefined : undefined),
      quantity: extractedDraft.quantity,
      unit: extractedDraft.unit,
      areaCoveredAcres: extractedDraft.areaCoveredAcres,
      cost: extractedCost,
      currency: 'INR',
      costType: extractedCost !== null ? 'actual' : 'unknown',
      source: extractedDraft.source || 'farmer_voice',
      originalSource: extractedDraft.source || 'farmer_voice',
      activitySource,
      evidenceType,
      status: finalStatus,
      confirmationStatus: explicitlyConfirmed && !isSimulatedOffline ? 'confirmed' : 'pending',
      verificationStatus: 'unverified', // Farmer confirmation or voice/camera capture is never independent third-party verification
      isDemo: false,
      isDateAssigned: extractedDraft.isDateAssigned,
      rawTranscript: extractedDraft.rawTranscript,
      evidence: {
        type: hasReceipt ? 'receipt' : cameraCapturedImage ? 'photo' : 'audio_note',
        label: cameraCapturedImage ? 'Product/Receipt Photo Capture' : `Voice dictate (${preferences.voiceLanguage})`,
        notes: cameraCapturedImage ? `Combined with image: "${cameraSubject}"` : extractedDraft.rawTranscript,
        uri: cameraCapturedImage || undefined,
        isSimulatedAi: true,
      },
      createdBy: 'Ravi Kumar (Farmer)',
      confirmedBy: explicitlyConfirmed && !isSimulatedOffline ? 'Ravi Kumar' : undefined,
      confirmedAt: explicitlyConfirmed && !isSimulatedOffline ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saveRes = onAddEvent(newEvt);
    if (!saveRes.success) {
      setErrorMessage(
        getLocalizedStorageError(saveRes.code, saveRes.error || t.errors.saveActivityFailed, t)
      );
      return;
    }

    const successText = isSimulatedOffline
      ? (preferences.appLanguage === 'Telugu'
          ? `ఆఫ్‌లైన్ నిల్వ: AI ప్రాసెసింగ్ పెండింగ్‌లో సేవ్ చేయబడింది: "${newEvt.title}".`
          : preferences.appLanguage === 'Hindi'
          ? `ऑफ़लाइन सहेजा गया: AI प्रसंस्करण लंबित: "${newEvt.title}".`
          : `Saved locally: Pending AI processing ("${newEvt.title}").`)
      : (explicitlyConfirmed
          ? (preferences.appLanguage === 'Telugu'
              ? `రైతు నిర్ధారించి భద్రపరిచారు: "${newEvt.title}"!`
              : preferences.appLanguage === 'Hindi'
              ? `किसान द्वारा पुष्टि और सहेजा गया: "${newEvt.title}"!`
              : `Farmer confirmed and saved: "${newEvt.title}"!`)
          : (preferences.appLanguage === 'Telugu'
              ? `నిర్ధారణ పెండింగ్‌లో భద్రపరచబడింది: "${newEvt.title}".`
              : preferences.appLanguage === 'Hindi'
              ? `पुष्टि लंबित के रूप में सहेजा गया: "${newEvt.title}".`
              : `Saved as pending confirmation: "${newEvt.title}".`));

    setSavedSuccessMsg(successText);
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
    setCameraCapturedImage(null);
    setActiveTab('timeline');
  };

  /**
   * Camera permission check and capture simulation
   */
  const handleRequestCameraCapture = async (subject: 'fertilizer' | 'receipt' | 'crop') => {
    setCameraSubject(subject);
    setCameraAnalysisError(null);

    // Verify camera access if navigator is available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCameraPermissionDenied(false);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermissionDenied(true);
          setCameraAnalysisError(t.errors.cameraDenied);
        }
      }
    }

    setIsCameraActive(true);
  };

  /**
   * Simulates image capture and extraction
   */
  const handleProcessImageCapture = (
    mode: 'fertilizer_clear' | 'fertilizer_blurry' | 'receipt_clear' | 'crop_image'
  ) => {
    setIsAnalyzingImage(true);
    setCameraAnalysisError(null);

    setTimeout(() => {
      setIsAnalyzingImage(false);

      if (mode === 'fertilizer_blurry') {
        setCameraAnalysisError(
          preferences.appLanguage === 'Telugu'
            ? 'ఈ సమాచారాన్ని స్పష్టంగా చదవలేకపోయాను. దయచేసి స్పష్టమైన ఫోటో తీయండి లేదా వివరాలను నేరుగా నమోదు చేయండి.'
            : preferences.appLanguage === 'Hindi'
            ? 'मैं यह जानकारी स्पष्ट रूप से नहीं पढ़ सका। कृपया स्पष्ट फोटो लें।'
            : "I couldn't read this information clearly. Please retake photo with good lighting or enter manually."
        );
        return;
      }

      const todayLocal = getLocalDateString();

      if (mode === 'fertilizer_clear') {
        // Demonstrate extraction: product name, manufacturer, active ingredient, batch, expiry
        const draft: ExtractedDraft = {
          eventType: 'fertilizer',
          title: 'Fertilizer application (Coromandel Gromor Urea)',
          activityDate: todayLocal,
          isDateAssigned: true,
          plotId: 'plot-a',
          plotName: 'Plot A — Paddy',
          cropName: 'Paddy',
          fertilizerName: 'Urea (Prilled 46% N)',
          productName: 'Gromor Neem Coated Urea',
          quantity: 45,
          unit: 'kg',
          areaCoveredAcres: 2.0,
          rawTranscript: combinedVoiceContext ? `"${combinedVoiceContext}" + [Fertilizer Bag Photo]` : '[Coromandel Gromor Urea Package Photo]',
          source: 'camera_product',
          status: 'pending_confirmation',
          extractionEngine: 'rule_based',
          needsClarification: [
            {
              field: 'confirmation',
              question: 'AI extracted from fertilizer package (Simulated). Please review product name, batch, and expiry.',
            },
          ],
        };
        setCameraCapturedImage('photo-fertilizer-package');
        setExtractedDraft(draft);
      } else if (mode === 'receipt_clear') {
        // Receipt capture: seller, date, product, quantity, amount
        const draft: ExtractedDraft = {
          eventType: 'fertilizer',
          title: 'Fertilizer purchase receipt (Sri Lakshmi Agro Agencies)',
          activityDate: todayLocal,
          isDateAssigned: false,
          plotId: 'plot-a',
          plotName: 'Plot A — Paddy',
          cropName: 'Paddy',
          fertilizerName: 'Urea (45 kg bag)',
          productName: 'IFFCO Neem Coated Urea',
          quantity: 45,
          unit: 'kg',
          areaCoveredAcres: 2.0,
          rawTranscript: combinedVoiceContext ? `"${combinedVoiceContext}" + [Agro Retail Receipt Scan]` : '[Sri Lakshmi Agro Agencies Receipt Scan]',
          source: 'receipt_verified',
          status: 'pending_confirmation',
          extractionEngine: 'rule_based',
          needsClarification: [
            {
              field: 'receiptAmount',
              question: 'Seller: Sri Lakshmi Agro Agencies · Total Paid: ₹266.50 · Please confirm payment details.',
            },
          ],
        };
        setCameraCapturedImage('photo-receipt-scan');
        setExtractedDraft(draft);
      } else if (mode === 'crop_image') {
        // Crop observation image
        const draft: ExtractedDraft = {
          eventType: 'pest_scouting',
          title: 'Crop scouting observation (Leaf inspection)',
          activityDate: todayLocal,
          isDateAssigned: true,
          plotId: 'plot-a',
          plotName: 'Plot A — Paddy',
          cropName: 'Paddy',
          quantity: null,
          unit: null,
          areaCoveredAcres: 2.0,
          rawTranscript: combinedVoiceContext ? `"${combinedVoiceContext}" + [Paddy Leaf Photo]` : '[Plot A Crop Leaf Inspection Photo]',
          source: 'camera_product',
          status: 'pending_confirmation',
          extractionEngine: 'rule_based',
          needsClarification: [
            {
              field: 'observationNotes',
              question: 'Photo captured for Plot A Paddy. Safety rule: Automated disease diagnosis is disabled. Farmer visual confirmation required.',
            },
          ],
        };
        setCameraCapturedImage('photo-crop-leaf');
        setExtractedDraft(draft);
      }

      setIsCameraActive(false);
    }, 600);
  };

  /**
   * Detailed form submit handler
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formTitle.trim()) {
      setErrorMessage(t.errors.titleRequired);
      return;
    }

    const nowIso = new Date().toISOString();
    const parsedFormCost = formCost ? parseFloat(formCost) : null;
    const newEvt: FarmEvent = {
      eventId: `REC-${Date.now().toString().slice(-5)}`,
      eventType: formEventType,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: selectedPlotObj.id,
      plotName: selectedPlotObj.name,
      cropName: selectedPlotObj.cropName,
      activityDate: formActivityDate || null,
      recordedDate: nowIso,
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      inputName: formInputName.trim() || undefined,
      quantity: formQuantity ? parseFloat(formQuantity) : null,
      unit: formUnit || null,
      areaCoveredAcres: formArea ? parseFloat(formArea) : null,
      cost: parsedFormCost !== null && Number.isFinite(parsedFormCost) ? parsedFormCost : null,
      currency: 'INR',
      costType: parsedFormCost !== null && Number.isFinite(parsedFormCost) ? 'actual' : 'unknown',
      // Strict Provenance: manually entered is farmer-reported and pending confirmation, never independently verified
      source: 'farmer_reported',
      originalSource: 'farmer_reported',
      activitySource: 'manual_entry',
      evidenceType: 'farmer_statement',
      status: 'pending_confirmation',
      confirmationStatus: 'pending',
      verificationStatus: 'unverified',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saveRes = onAddEvent(newEvt);
    if (!saveRes.success) {
      setErrorMessage(
        getLocalizedStorageError(saveRes.code, saveRes.error || t.errors.saveActivityFailed, t)
      );
      return;
    }

    const formSuccessText =
      preferences.appLanguage === 'Telugu'
        ? `వ్యవసాయ రికార్డుల్లో నమోదు చేయబడింది: "${newEvt.title}" (నిర్ధారణ పెండింగ్)!`
        : preferences.appLanguage === 'Hindi'
        ? `खेत रिकॉर्ड में दर्ज किया गया: "${newEvt.title}" (पुष्टि लंबित)!`
        : `Recorded "${newEvt.title}" into farm records (pending confirmation)!`;
    setSavedSuccessMsg(formSuccessText);
    setTimeout(() => setSavedSuccessMsg(null), 4000);

    // Reset fields only upon verified save
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
    setErrorMessage(null);
    const targetPlot = plots.find((p) => p.id === plotId) || plots[0];
    const nowIso = new Date().toISOString();
    const newEvt: FarmEvent = {
      eventId: `REC-${Date.now().toString().slice(-5)}`,
      eventType: type,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: targetPlot.id,
      plotName: targetPlot.name,
      cropName: targetPlot.cropName,
      activityDate: getLocalDateString(),
      recordedDate: nowIso,
      title,
      description: `Quick 1-tap recorded on ${targetPlot.name}.`,
      quantity: qty,
      unit,
      areaCoveredAcres: area,
      cost: null,
      currency: 'INR',
      costType: 'unknown',
      // Strict Provenance: quick tap is farmer-reported and pending confirmation, never independently verified
      source: 'farmer_reported',
      originalSource: 'farmer_reported',
      activitySource: 'manual_entry',
      evidenceType: 'farmer_statement',
      status: 'pending_confirmation',
      confirmationStatus: 'pending',
      verificationStatus: 'unverified',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saveRes = onAddEvent(newEvt);
    if (!saveRes.success) {
      setErrorMessage(
        getLocalizedStorageError(saveRes.code, saveRes.error || t.errors.saveQuickActionFailed, t)
      );
      return;
    }

    const quickSuccessText =
      preferences.appLanguage === 'Telugu'
        ? `త్వరిత పని నమోదు చేయబడింది: "${title}" (నిర్ధారణ పెండింగ్)!`
        : preferences.appLanguage === 'Hindi'
        ? `त्वरित कार्य दर्ज किया गया: "${title}" (पुष्टि लंबित)!`
        : `Quick log saved: "${title}" (pending confirmation)!`;
    setSavedSuccessMsg(quickSuccessText);
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
              {t.record.captureNewTab}
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
              {t.record.activityTimelineTab} ({events.length})
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
              {t.record.viewInTimeline}
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
                  {t.record.languagePrefix} {preferences.voiceLanguage}
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
                  {t.record.photoReceiptShort}
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
                  {t.record.oneTapReadyShort}
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
                  {t.record.structuredEntryShort}
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
                {t.record.completeRecordsTitle} ({events.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.record.completeRecordsDesc}
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
              <span>{t.record.recordNewActivity}</span>
            </button>
          </div>
          <FarmTimeline
            events={events}
            plots={plots}
            onConfirmEvent={onConfirmEvent}
            onDeleteEvent={onDeleteEvent}
            onEditEvent={onEditEvent}
            language={preferences.appLanguage}
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
                    {t.record.voiceRecordingTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.record.voiceRecordingSubtitle} ({preferences.voiceLanguage})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModality('overview')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  {t.record.closeModality}
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
                  aria-label={t.record.tapToRecord}
                >
                  <Mic className="w-8 h-8" />
                </button>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {preferences.appLanguage === 'Telugu'
                      ? '“ఈరోజు మీ పొలంలో ఏమి జరిగింది?”'
                      : preferences.appLanguage === 'Hindi'
                      ? '“आज आपके खेत में क्या हुआ?”'
                      : '“What happened on your farm today?”'}
                  </h4>
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mt-1">
                    {isRecording ? t.record.listeningStatus : t.record.tapToRecordPrompt}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    {preferences.appLanguage === 'Telugu'
                      ? 'ఉదాహరణ: “ఈరోజు రెండు ఎకరాలకు యూరియా వేశాను.” లేదా “Plot A లో విత్తనాలు నాటాము.”'
                      : preferences.appLanguage === 'Hindi'
                      ? 'उदाहरण: “आज मैंने दो एकड़ में यूरिया डाला।”'
                      : 'Example: “Today I applied urea to two acres.”'}
                  </p>
                </div>

                {voiceEngineError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-lg text-xs text-left">
                    <div className="font-semibold mb-0.5">{t.record.voiceNotice}</div>
                    <div>{voiceEngineError}</div>
                  </div>
                )}

                {voiceTranscript && (
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left text-xs">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                      {t.record.transcribedSpeech}
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
                      {t.record.testPhrasesTitle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {t.record.testPhrasesSubtitle}
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800 gap-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        {preferences.appLanguage === 'Telugu' ? 'నేను అర్థం చేసుకున్నది:' : preferences.appLanguage === 'Hindi' ? 'मैंने समझा:' : 'I understood:'}
                      </div>
                      <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5 mt-0.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>{extractedDraft.title}</span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 animate-pulse">
                        {preferences.appLanguage === 'Telugu'
                          ? 'AI ద్వారా సంగ్రహించబడింది — నిర్ధారణ కోసం ఎదురుచూస్తోంది'
                          : preferences.appLanguage === 'Hindi'
                          ? 'AI निकाला गया — पुष्टि की प्रतीक्षा में'
                          : 'AI extracted — awaiting confirmation'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Breakdown: Activity, Input, Area, Date */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{t.record.activityLabel}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{t.eventTypes[extractedDraft.eventType] || extractedDraft.eventType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{t.record.inputProductLabel}</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">{extractedDraft.fertilizerName || extractedDraft.productName || t.timeline.noneRecorded}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{t.record.areaLabel}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{extractedDraft.areaCoveredAcres ? `${extractedDraft.areaCoveredAcres} ${t.units.acres}` : t.record.unknownValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{t.record.dateLabel}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{extractedDraft.activityDate || t.home.unknownDate}</span>
                    </div>
                  </div>

                  {/* Clarification prompt if any field was unknown */}
                  {extractedDraft.needsClarification && extractedDraft.needsClarification.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1.5">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{t.record.clarificationNeeded}</span>
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
                        {t.record.headlineLabel}
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
                        {t.record.activityDateLabel}
                        {extractedDraft.isDateAssigned && (
                          <span className="ml-1.5 text-[10px] font-normal text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            {t.record.appAssignedDateNotice}
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={extractedDraft.activityDate || ''}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            activityDate: e.target.value,
                            isDateAssigned: false,
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        {t.record.associatedPlotLabel}
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
                        <option value="">{t.record.unspecifiedPlot}</option>
                        {plots.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.areaAcres} {t.units.acres})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        {t.record.quantityRecorded}
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
                          placeholder={t.record.unknownValue}
                          className="w-2/3 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={extractedDraft.unit || ''}
                          onChange={(e) =>
                            setExtractedDraft({ ...extractedDraft, unit: e.target.value })
                          }
                          placeholder={t.myFarm.kgUnit}
                          className="w-1/3 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Confirm, Edit, Cancel */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200 dark:border-emerald-800">
                    <button
                      type="button"
                      onClick={() => {
                        setExtractedDraft(null);
                        setVoiceTranscript('');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      {preferences.appLanguage === 'Telugu' ? 'రద్దు చేయి (Cancel)' : preferences.appLanguage === 'Hindi' ? 'रद्द करें (Cancel)' : 'Cancel'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Switch to structured form prefilled with draft values for manual editing
                          setSelectedModality('form');
                          if (extractedDraft.plotId) setFormPlotId(extractedDraft.plotId);
                          setFormEventType(extractedDraft.eventType);
                          if (extractedDraft.activityDate) setFormActivityDate(extractedDraft.activityDate);
                          setFormTitle(extractedDraft.title);
                          if (extractedDraft.quantity !== null && extractedDraft.quantity !== undefined) {
                            setFormQuantity(String(extractedDraft.quantity));
                          }
                          if (extractedDraft.unit) setFormUnit(extractedDraft.unit);
                          if (extractedDraft.areaCoveredAcres !== null && extractedDraft.areaCoveredAcres !== undefined) {
                            setFormArea(String(extractedDraft.areaCoveredAcres));
                          }
                        }}
                        className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{preferences.appLanguage === 'Telugu' ? 'సవరించు (Edit)' : preferences.appLanguage === 'Hindi' ? 'संपादित करें (Edit)' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveExtractedDraft(false)}
                        className="px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
                        title={t.record.savePendingTooltip}
                      >
                        {t.record.savePending}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveExtractedDraft(true)}
                        className="px-5 py-2 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t.actions.confirm}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CAMERA & MULTIMODAL CAPTURE WORKFLOW (Section 5, 6, 7, 8, 14) */}
          {selectedModality === 'camera' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-sky-600" />
                    <span>{t.record.cameraHeaderTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.record.cameraHeaderSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModality('overview')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  {t.record.closeModality}
                </button>
              </div>

              {/* Offline processing simulation toggle (Requirement 14) */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Radio className={`w-3.5 h-3.5 ${isSimulatedOffline ? 'text-amber-500' : 'text-emerald-500'}`} />
                    <span>{t.record.cameraNetworkLabel}</span>
                    <span className={isSimulatedOffline ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                      {isSimulatedOffline ? t.record.cameraOfflineLabel : t.record.cameraOnlineLabel}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {isSimulatedOffline
                      ? t.sync.offlineBannerDesc
                      : t.record.cameraHeaderSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
                    isSimulatedOffline
                      ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                      : 'bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200'
                  }`}
                >
                  {isSimulatedOffline ? t.record.cameraSwitchOnline : t.record.cameraSimulateOffline}
                </button>
              </div>

              {/* Combined Voice + Camera Pre-Capture (Requirement 8) */}
              <div className="p-4 bg-sky-50/60 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 space-y-2 text-xs">
                <div className="font-bold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-sky-700" />
                  <span>{t.record.cameraVoiceCombined}</span>
                </div>
                <p className="text-sky-800 dark:text-sky-300 text-[11px]">
                  Farmer speaks (e.g. “I used this today on Plot A”) and then photographs the input or receipt. The system merges speech context and image intelligence into one candidate FarmEvent.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={combinedVoiceContext}
                    onChange={(e) => setCombinedVoiceContext(e.target.value)}
                    placeholder='Spoken context: e.g. "I used this today" or "దీన్ని ఈరోజు వేశాను"'
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setCombinedVoiceContext('I used this today on Plot A (2 acres).')}
                    className="px-2.5 py-1.5 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-lg font-medium text-[11px] shrink-0"
                  >
                    Use Sample Phrase
                  </button>
                </div>
              </div>

              {/* Camera Subject Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRequestCameraCapture('fertilizer')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    cameraSubject === 'fertilizer'
                      ? 'border-sky-600 bg-sky-50/40 dark:bg-sky-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{t.record.cameraSampleFertilizer}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.record.cameraHeaderSubtitle}</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestCameraCapture('receipt')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    cameraSubject === 'receipt'
                      ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 flex items-center justify-center mb-2">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{t.record.cameraSampleReceipt}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.record.cameraTabDesc}</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestCameraCapture('crop')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    cameraSubject === 'crop'
                      ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 flex items-center justify-center mb-2">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{t.record.cameraSampleFieldPhoto}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.record.photoReceiptNotice}</div>
                </button>
              </div>

              {/* Camera Viewfinder & Simulated Image Feeds */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 text-center space-y-4">
                <div className="max-w-md mx-auto py-6 border-2 border-dashed border-slate-700 rounded-xl space-y-2">
                  <Camera className="w-10 h-10 mx-auto text-sky-400 animate-pulse" />
                  <div className="text-sm font-bold">
                    {cameraSubject === 'fertilizer'
                      ? 'Point camera at Fertilizer or Chemical Package'
                      : cameraSubject === 'receipt'
                      ? 'Point camera at Agro Dealer Purchase Receipt'
                      : 'Point camera at Crop Plant or Field Observation'}
                  </div>
                  <p className="text-xs text-slate-400 px-4">
                    Ensure packaging text, batch numbers, or receipts are well-lit and in focus.
                  </p>
                </div>

                {cameraPermissionDenied && (
                  <div className="p-3 bg-amber-950/80 border border-amber-800 rounded-lg text-amber-200 text-xs text-left max-w-md mx-auto">
                    Camera permission was denied in this environment. Use the sample camera test feeds below to test the full intelligent workflow.
                  </div>
                )}

                {cameraAnalysisError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 text-xs text-left max-w-md mx-auto flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <div className="font-bold">{t.record.cameraQualityNotice}</div>
                      <div>{cameraAnalysisError}</div>
                    </div>
                  </div>
                )}

                {isAnalyzingImage && (
                  <div className="p-3 bg-sky-950/80 border border-sky-800 rounded-lg text-sky-200 text-xs max-w-md mx-auto flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
                    <span>{t.record.cameraAnalyzing}</span>
                  </div>
                )}

                {/* Sample Conceptual Capture Actions (Section 5, 6, 7, 13) */}
                <div className="pt-3 border-t border-slate-800 text-left max-w-lg mx-auto">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t.record.cameraQuickSamplesTitle}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleProcessImageCapture('fertilizer_clear')}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left"
                    >
                      <div className="font-bold text-sky-400">1. {t.record.cameraSampleFertilizer}</div>
                      <div className="text-[11px] text-slate-300">Gromor Urea 45kg, Coromandel, Batch #8492</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProcessImageCapture('fertilizer_blurry')}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left"
                    >
                      <div className="font-bold text-amber-400">2. {t.record.cameraQualityNotice}</div>
                      <div className="text-[11px] text-slate-300">Blurry / Unreadable sample</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProcessImageCapture('receipt_clear')}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left"
                    >
                      <div className="font-bold text-emerald-400">3. {t.record.cameraSampleReceipt}</div>
                      <div className="text-[11px] text-slate-300">Sri Lakshmi Agro, 45kg Urea, ₹266.50</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProcessImageCapture('crop_image')}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left"
                    >
                      <div className="font-bold text-indigo-400">4. {t.record.cameraSampleFieldPhoto}</div>
                      <div className="text-[11px] text-slate-300">{t.eventTypes.pest_scouting}</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Safety Disclosures Banner (Requirement 15) */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>{t.record.cameraSafetyPolicyTitle}</span>
                </div>
                <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                  {t.record.cameraSafetyPolicyDesc}
                </p>
              </div>
            </div>
          )}

          {/* QUICK 1-TAP ACTION LOGGERS */}
          {(selectedModality === 'quick' || selectedModality === 'overview') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.record.quick1TapTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.record.quick1TapSubtitle}
                  </p>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                  {t.record.zeroFriction}
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
                      {t.record.quickLog}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.record.quickLandPrepPaddy}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot A (2 {t.units.acres})</div>
                </button>

                {/* 2. Plot B - Groundnut Land Prep */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'land_prep',
                      t.record.quickLandPrepGroundnut,
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
                      {t.record.quickLog}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.record.quickLandPrepGroundnut}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot B (3 {t.units.acres})</div>
                </button>

                {/* 3. Irrigation on Plot A */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'irrigation',
                      t.record.quickIrrigationPaddy,
                      'plot-a',
                      null,
                      'hours',
                      2.0
                    )
                  }
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 rounded-xl text-left transition-colors min-h-[44px] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Droplets className="w-5 h-5 text-sky-600" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-800">
                      {t.record.quickLog}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.record.quickIrrigationPaddy}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plot A (2 {t.units.acres})</div>
                </button>

                {/* 4. Routine Field Scouting */}
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      'observation',
                      t.record.quickFieldInspection,
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
                      {t.record.quickLog}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.record.quickFieldInspection}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.record.quickFieldInspectionDesc}</div>
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
                      {t.record.structuredFormTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.record.structuredFormSubtitle}
                    </p>
                  </div>
                  <TrustIndicator
                    status="draft"
                    source="farmer_reported"
                    size="sm"
                    language={preferences.appLanguage}
                  />
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
                      {t.record.targetPlotLabel}
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
                          {p.name} ({p.areaAcres} {t.units.acres} — {p.cropName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Activity Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.activityTypeLabel}
                    </label>
                    <select
                      value={formEventType}
                      onChange={(e) => setFormEventType(e.target.value as FarmEventType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                      required
                    >
                      <option value="land_prep">{t.eventTypes.land_prep}</option>
                      <option value="sowing">{t.eventTypes.sowing}</option>
                      <option value="irrigation">{t.eventTypes.irrigation}</option>
                      <option value="fertilizer">{t.eventTypes.fertilizer}</option>
                      <option value="spray">{t.eventTypes.spray}</option>
                      <option value="weeding">{t.eventTypes.weeding}</option>
                      <option value="pest_scouting">{t.eventTypes.pest_scouting}</option>
                      <option value="observation">{t.eventTypes.observation}</option>
                      <option value="harvest">{t.eventTypes.harvest}</option>
                      <option value="sale">{t.eventTypes.sale}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.activityDateLabel}
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
                      {t.record.areaCoveredLabel}
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
                    {t.record.titleDescLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.record.titleDescPlaceholder}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    required
                  />
                </div>

                {/* Input Name & Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.inputProductOptionalLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.record.inputProductPlaceholder}
                      value={formInputName}
                      onChange={(e) => setFormInputName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.costOptionalLabel}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={t.record.costPlaceholder}
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.quantityOptionalLabel}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={t.record.quantityPlaceholder}
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.record.measurementUnitLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.timeline.unitPlaceholder}
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {t.record.formSourceFooter}
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.record.saveToRecords}</span>
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
              <span>{t.record.duplicateModalTitle}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.record.duplicateModalDesc}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {t.record.duplicateModalQuestion}
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
                {t.record.keepExistingOnly}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDuplicateModalOpen(false);
                  handleSaveExtractedDraft(true);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold"
              >
                {t.record.createAnotherRecord}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
