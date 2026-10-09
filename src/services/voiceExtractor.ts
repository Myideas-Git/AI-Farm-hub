/**
 * AI Farm Hub — Voice Recording & Rule-Based Entity Extraction Engine
 * Provides Web Speech API integration, microphone permission verification,
 * and deterministic agricultural entity parsing for Telugu, English, and Hindi.
 *
 * HONEST ARCHITECTURE DISCLOSURE:
 * This workflow uses browser SpeechRecognition and deterministic, rule-based entity parsing.
 * An external generative AI model is NOT connected to this voice extraction pipeline in Phase 0.5.
 * We never invent missing crop names, chemical products, quantities, or plot areas.
 */

import { FarmEvent, FarmEventType, EventSource, RecordStatus } from '../types/farm';

export interface ExtractedDraft {
  eventType: FarmEventType;
  title: string;
  activityDate: string | null;
  isDateAssigned?: boolean;
  plotId: string | null;
  plotName: string;
  cropName: string;
  fertilizerName?: string | null;
  productName?: string | null;
  quantity: number | null;
  unit: string | null;
  areaCoveredAcres: number | null;
  isTentative?: boolean;
  rawTranscript: string;
  source: EventSource;
  status: RecordStatus;
  needsClarification?: {
    field: string;
    question: string;
  }[];
  isCorrection?: boolean;
  isDuplicateRequest?: boolean;
  extractionEngine: 'rule_based';
}

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  error?: string;
  confidence?: number;
}

/**
 * Returns a calendar date string in YYYY-MM-DD format based on the user's LOCAL timezone.
 * Avoids the UTC-boundary day mismatch of Date.toISOString().
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class VoiceExtractorService {
  /**
   * Checks if browser Web Speech API is supported
   */
  public static isSpeechRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  }

  /**
   * Request microphone permission explicitly with browser MediaDevices API
   */
  public static async requestMicrophonePermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        granted: false,
        error: 'Microphone API is not supported in this browser. Please use manual entry.',
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately after verification
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: any) {
      let errorMsg =
        'Microphone access was denied. Please allow microphone permissions in browser settings or use manual entry.';
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No microphone device was detected on your system.';
      }
      return {
        granted: false,
        error: errorMsg,
      };
    }
  }

  /**
   * Creates a browser SpeechRecognition instance configured for the selected language
   */
  public static createSpeechRecognition(
    language: 'Telugu' | 'English' | 'Hindi',
    onResult: (result: SpeechRecognitionResultState) => void,
    onError: (errorMsg: string) => void,
    onEnd: () => void
  ): any {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech Recognition engine is not supported in your browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Set standard Indian BCP-47 language tag
    if (language === 'Telugu') {
      recognition.lang = 'te-IN';
    } else if (language === 'Hindi') {
      recognition.lang = 'hi-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: !!finalTranscript,
        confidence: event.results[0]?.[0]?.confidence || 0.85,
      });
    };

    recognition.onerror = (event: any) => {
      let message = 'Speech recognition error: ' + (event.error || 'Unknown');
      if (event.error === 'not-allowed') {
        message = 'Microphone permission was denied. Please allow microphone access or use manual input.';
      } else if (event.error === 'no-speech') {
        message = 'No speech was detected. Please tap and speak clearly.';
      } else if (event.error === 'network') {
        message = 'Network error during speech recognition. An active connection is required for browser speech.';
      }
      onError(message);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }

  /**
   * Extracts structured activity fields from Telugu, English, or Hindi speech text.
   *
   * STRICT ANTI-INVENTION RULES:
   * 1. Never invent fertilizer, pesticide, or crop name if not present.
   * 2. Never invent quantity, unit, or plot acreage if not present.
   * 3. If a date is not spoken, flag date as unassigned or assign local today with an explicit review notice.
   * 4. Mark all extracted results as 'pending_confirmation' with 'ai_extracted' source.
   */
  public static extractFromTranscript(
    transcript: string,
    currentDraft?: ExtractedDraft | null,
    recentEvents?: FarmEvent[]
  ): ExtractedDraft {
    const text = transcript.trim();
    const lower = text.toLowerCase();

    // Local calendar dates (timezone-accurate)
    const todayLocal = getLocalDateString(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayLocal = getLocalDateString(yesterdayDate);

    // Date detection
    let detectedDate: string | null = null;
    let isDateAssigned = false;

    if (
      text.includes('ఈరోజు') ||
      lower.includes('today') ||
      lower.includes('aaj') ||
      text.includes('ఈ రోజు') ||
      text.includes('आज')
    ) {
      detectedDate = todayLocal;
    } else if (
      text.includes('నిన్న') ||
      lower.includes('yesterday') ||
      lower.includes('kal') ||
      text.includes('कल')
    ) {
      detectedDate = yesterdayLocal;
    } else {
      // Date was NOT spoken in transcript: assign local today for convenient review, but flag it
      detectedDate = todayLocal;
      isDateAssigned = true;
    }

    const needsClarificationList: { field: string; question: string }[] = [];
    if (isDateAssigned) {
      needsClarificationList.push({
        field: 'activityDate',
        question: 'Activity date was not spoken in voice input. We assigned today for your review. Please adjust if this occurred earlier.',
      });
    }

    // ==========================================
    // 1. Correction Handling
    // e.g., "40 కిలోలు కాదు, 20 కిలోలు" / "not 40 kg, 20 kg" / "40 nahi, 20 kg"
    // ==========================================
    const isCorrectionPattern =
      text.includes('కాదు') ||
      lower.includes('not') ||
      lower.includes('correction') ||
      text.includes('नहीं') ||
      lower.includes('nahi');

    if (isCorrectionPattern) {
      const numberMatches = text.match(/\d+/g);
      let correctedQuantity: number | null = null;
      if (numberMatches && numberMatches.length >= 2) {
        correctedQuantity = parseInt(numberMatches[numberMatches.length - 1], 10);
      } else if (numberMatches && numberMatches.length === 1) {
        correctedQuantity = parseInt(numberMatches[0], 10);
      }

      if (currentDraft) {
        return {
          ...currentDraft,
          quantity: correctedQuantity !== null ? correctedQuantity : currentDraft.quantity,
          rawTranscript: text,
          isCorrection: true,
          status: 'pending_confirmation',
        };
      } else {
        return {
          eventType: 'other',
          title: 'Quantity Correction Clarification',
          activityDate: detectedDate,
          isDateAssigned,
          plotId: null,
          plotName: 'Unknown',
          cropName: 'Unknown',
          quantity: correctedQuantity,
          unit: 'kg',
          areaCoveredAcres: null,
          rawTranscript: text,
          source: 'ai_extracted',
          status: 'pending_confirmation',
          isCorrection: true,
          extractionEngine: 'rule_based',
          needsClarification: [
            {
              field: 'referenceRecord',
              question: 'Which previous activity record does this correction apply to? Please select the activity.',
            },
          ],
        };
      }
    }

    // ==========================================
    // 2. Duplicate Save / Repeat Request
    // e.g., "అదే పని మళ్లీ సేవ్ చేయి" / "save the same task again"
    // ==========================================
    const isDuplicatePhrase =
      text.includes('అదే పని') ||
      text.includes('మళ్లీ సేవ్') ||
      lower.includes('same work') ||
      lower.includes('same task') ||
      lower.includes('save again');

    if (isDuplicatePhrase) {
      const lastEvent = recentEvents && recentEvents.length > 0 ? recentEvents[0] : null;
      return {
        eventType: lastEvent?.eventType || 'other',
        title: lastEvent ? `Re-record: ${lastEvent.title}` : 'Duplicate Activity Confirmation',
        activityDate: detectedDate,
        isDateAssigned,
        plotId: lastEvent?.plotId || null,
        plotName: lastEvent?.plotName || 'Unknown',
        cropName: lastEvent?.cropName || 'Unknown',
        quantity: lastEvent?.quantity || null,
        unit: lastEvent?.unit || null,
        areaCoveredAcres: lastEvent?.areaCoveredAcres || null,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        isDuplicateRequest: true,
        extractionEngine: 'rule_based',
        needsClarification: [
          {
            field: 'duplicateConfirmation',
            question:
              'Potential duplicate detected: Would you like to create another separate record, or keep the existing record as is?',
          },
        ],
      };
    }

    // ==========================================
    // 3. Area Detection (Strict — never invented)
    // ==========================================
    let extractedArea: number | null = null;
    const areaMatch =
      text.match(/(\d+(?:\.\d+)?)\s*(?:ఎకరాల|ఎకరాలు|acres|acre|एकड़)/i) ||
      (text.includes('రెండు ఎకరాల') || text.includes('రెండు ఎకరాలు') || lower.includes('two acres')
        ? [null, '2.0']
        : null) ||
      (text.includes('మూడు ఎకరాల') || text.includes('మూడు ఎకరాలు') || lower.includes('three acres')
        ? [null, '3.0']
        : null);

    if (areaMatch && areaMatch[1]) {
      extractedArea = parseFloat(areaMatch[1]);
    }

    // ==========================================
    // 4. Quantity & Unit Detection (Strict — never invented)
    // ==========================================
    let extractedQuantity: number | null = null;
    let extractedUnit: string | null = null;
    const qtyMatch = text.match(/(\d+(?:\.\d+)?)\s*(కిలోల|కిలోలు|kg|kilos|kilograms|బస్తాలు|bags|క్వింటాళ్ళు|quintals|లీటర్లు|liters|hours|గంటలు)/i);
    if (qtyMatch) {
      extractedQuantity = parseFloat(qtyMatch[1]);
      const rawUnit = qtyMatch[2].toLowerCase();
      if (rawUnit.includes('కిలో') || rawUnit.includes('kg') || rawUnit.includes('kilo')) {
        extractedUnit = 'kg';
      } else if (rawUnit.includes('బస్తా') || rawUnit.includes('bag')) {
        extractedUnit = 'bags';
      } else if (rawUnit.includes('క్వింటా') || rawUnit.includes('quintal')) {
        extractedUnit = 'quintals';
      } else if (rawUnit.includes('లీటర్') || rawUnit.includes('liter')) {
        extractedUnit = 'liters';
      } else if (rawUnit.includes('గంట') || rawUnit.includes('hour')) {
        extractedUnit = 'hours';
      } else {
        extractedUnit = rawUnit;
      }
    }

    // ==========================================
    // 5. Plot & Crop Recognition (Plot A: Paddy 2 Ac; Plot B: Groundnut 3 Ac)
    // ==========================================
    let extractedPlotId: string | null = null;
    let extractedPlotName = 'Not specified';
    let extractedCropName = 'Not specified';

    const isPlotAMentioned =
      text.includes('Plot A') ||
      text.includes('ప్లాట్ ఎ') ||
      text.includes('ప్లాట్ A') ||
      lower.includes('plot a');
    const isPlotBMentioned =
      text.includes('Plot B') ||
      text.includes('ప్లాట్ బి') ||
      text.includes('ప్లాట్ B') ||
      lower.includes('plot b');
    const isPaddyMentioned =
      text.includes('వరి') || lower.includes('paddy') || lower.includes('rice') || text.includes('धान');
    const isGroundnutMentioned =
      text.includes('వేరుశనగ') ||
      lower.includes('groundnut') ||
      lower.includes('peanut') ||
      text.includes('मूंगफली');

    if (isPlotAMentioned || (isPaddyMentioned && !isPlotBMentioned)) {
      extractedPlotId = 'plot-a';
      extractedPlotName = 'Plot A — Paddy';
      extractedCropName = 'Paddy';
    } else if (isPlotBMentioned || (isGroundnutMentioned && !isPlotAMentioned)) {
      extractedPlotId = 'plot-b';
      extractedPlotName = 'Plot B — Groundnut';
      extractedCropName = 'Groundnut';
    } else {
      needsClarificationList.push({
        field: 'plotId',
        question: 'Which plot did this activity occur in? (Plot A — Paddy or Plot B — Groundnut)',
      });
    }

    // ==========================================
    // 6. Event Type & Chemical/Fertilizer Specifics
    // ==========================================

    // FERTILIZER
    if (
      text.includes('యూరియా') ||
      lower.includes('urea') ||
      text.includes('ఎరువు') ||
      lower.includes('fertilizer') ||
      text.includes('खाद') ||
      text.includes('డిఎపి') ||
      lower.includes('dap')
    ) {
      let fertilizerName: string | null = null;
      if (text.includes('యూరియా') || lower.includes('urea') || text.includes('यूरिया')) {
        fertilizerName = 'Urea';
      } else if (text.includes('డిఎపి') || lower.includes('dap') || text.includes('डीएपी')) {
        fertilizerName = 'DAP';
      } else {
        // DO NOT INVENT UREA! Farmer only said "fertilizer" / "ఎరువు" / "खाद"
        fertilizerName = null;
        needsClarificationList.push({
          field: 'fertilizerName',
          question: 'Which fertilizer was applied? (Fertilizer name not specified to avoid assumptions).',
        });
      }

      if (extractedQuantity === null) {
        needsClarificationList.push({
          field: 'quantity',
          question: 'What quantity of fertilizer was applied? (Quantity not recorded in voice).',
        });
      }

      const title = fertilizerName
        ? `Fertilizer application (${fertilizerName})`
        : 'Fertilizer application (Unspecified)';

      return {
        eventType: 'fertilizer',
        title,
        activityDate: detectedDate,
        isDateAssigned,
        plotId: extractedPlotId,
        plotName: extractedPlotName,
        cropName: extractedCropName,
        fertilizerName,
        quantity: extractedQuantity,
        unit: extractedUnit,
        areaCoveredAcres: extractedArea,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        extractionEngine: 'rule_based',
        needsClarification: needsClarificationList.length > 0 ? needsClarificationList : undefined,
      };
    }

    // SPRAY / PESTICIDE / MEDICINE
    if (
      text.includes('మందు కొట్టాను') ||
      text.includes('మందు') ||
      text.includes('స్ప్రే') ||
      lower.includes('spray') ||
      lower.includes('pesticide') ||
      lower.includes('medicine') ||
      text.includes('दवा')
    ) {
      // DO NOT INVENT A CHEMICAL OR PESTICIDE NAME
      needsClarificationList.push({
        field: 'productName',
        question: 'What product or spray was used? (Product name kept empty to avoid false chemical assumption).',
      });

      return {
        eventType: 'spray',
        title: 'Crop treatment / spray (Tentative)',
        activityDate: detectedDate,
        isDateAssigned,
        plotId: extractedPlotId,
        plotName: extractedPlotName,
        cropName: extractedCropName,
        productName: null,
        quantity: extractedQuantity,
        unit: extractedUnit,
        areaCoveredAcres: extractedArea,
        isTentative: true,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        extractionEngine: 'rule_based',
        needsClarification: needsClarificationList,
      };
    }

    // SOWING / SEEDS
    if (
      text.includes('విత్తనాలు') ||
      lower.includes('sowing') ||
      lower.includes('seeds') ||
      lower.includes('seed') ||
      text.includes('बुवाई') ||
      text.includes('बीज')
    ) {
      return {
        eventType: 'sowing',
        title: extractedPlotName !== 'Not specified' ? `Seed sowing on ${extractedPlotName}` : 'Seed sowing',
        activityDate: detectedDate,
        isDateAssigned,
        plotId: extractedPlotId,
        plotName: extractedPlotName,
        cropName: extractedCropName,
        quantity: extractedQuantity,
        unit: extractedUnit,
        areaCoveredAcres: extractedArea,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        extractionEngine: 'rule_based',
        needsClarification: needsClarificationList.length > 0 ? needsClarificationList : undefined,
      };
    }

    // IRRIGATION
    if (
      text.includes('నీళ్లు') ||
      text.includes('నీరు') ||
      lower.includes('irrigation') ||
      lower.includes('water') ||
      text.includes('సిंचाई') ||
      text.includes('पानी')
    ) {
      return {
        eventType: 'irrigation',
        title: extractedPlotName !== 'Not specified' ? `Irrigation on ${extractedPlotName}` : 'Irrigation',
        activityDate: detectedDate,
        isDateAssigned,
        plotId: extractedPlotId,
        plotName: extractedPlotName,
        cropName: extractedCropName,
        quantity: extractedQuantity,
        unit: extractedUnit,
        areaCoveredAcres: extractedArea,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        extractionEngine: 'rule_based',
        needsClarification: needsClarificationList.length > 0 ? needsClarificationList : undefined,
      };
    }

    // HARVEST
    if (
      text.includes('కోత') ||
      lower.includes('harvest') ||
      lower.includes('cutting') ||
      text.includes('कटाई')
    ) {
      return {
        eventType: 'harvest',
        title: 'Crop harvest',
        activityDate: detectedDate,
        isDateAssigned,
        plotId: extractedPlotId,
        plotName: extractedPlotName,
        cropName: extractedCropName,
        quantity: extractedQuantity,
        unit: extractedUnit,
        areaCoveredAcres: extractedArea,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        extractionEngine: 'rule_based',
        needsClarification: needsClarificationList.length > 0 ? needsClarificationList : undefined,
      };
    }

    // DEFAULT FALLBACK FOR GENERAL OBSERVATION
    return {
      eventType: 'observation',
      title: text.length > 45 ? text.substring(0, 45) + '...' : text,
      activityDate: detectedDate,
      isDateAssigned,
      plotId: extractedPlotId,
      plotName: extractedPlotName,
      cropName: extractedCropName,
      quantity: extractedQuantity,
      unit: extractedUnit,
      areaCoveredAcres: extractedArea,
      rawTranscript: text,
      source: 'ai_extracted',
      status: 'pending_confirmation',
      extractionEngine: 'rule_based',
      needsClarification: needsClarificationList.length > 0 ? needsClarificationList : undefined,
    };
  }

  /**
   * Reads text aloud using browser SpeechSynthesis API if available
   */
  public static speakText(text: string, language: 'Telugu' | 'English' | 'Hindi'): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'Telugu') {
        utterance.lang = 'te-IN';
      } else if (language === 'Hindi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis playback error', e);
    }
  }
}
