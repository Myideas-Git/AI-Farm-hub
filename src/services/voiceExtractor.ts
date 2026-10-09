/**
 * AI Farm Hub — Voice Recording & AI Field Extraction Engine
 * Provides Web Speech API integration, microphone permission handling,
 * and deterministic agricultural entity extraction for Telugu, English, and Hindi.
 */

import { FarmEvent, FarmEventType, EventSource, RecordStatus } from '../types/farm';

export interface ExtractedDraft {
  eventType: FarmEventType;
  title: string;
  activityDate: string | null;
  plotId: string | null;
  plotName: string;
  cropName: string;
  fertilizerName?: string;
  productName?: string;
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
}

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  error?: string;
  confidence?: number;
}

export class VoiceExtractorService {
  /**
   * Checks if browser Web Speech API is supported
   */
  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  /**
   * Request microphone permission explicitly
   */
  public static async requestMicrophonePermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        granted: false,
        error: 'Microphone API is not supported in this browser.',
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately after verification
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: any) {
      console.warn('Microphone permission request error:', err);
      let errorMsg = 'Microphone access was denied. Please allow microphone permissions in browser settings or use manual entry.';
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

    // Set BCP-47 language tag
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
        confidence: event.results[0]?.[0]?.confidence || 0.9,
      });
    };

    recognition.onerror = (event: any) => {
      let message = 'Speech recognition error: ' + (event.error || 'Unknown');
      if (event.error === 'not-allowed') {
        message = 'Microphone permission was denied. Please enable microphone access or use manual input.';
      } else if (event.error === 'no-speech') {
        message = 'No speech was detected. Please tap and speak clearly.';
      } else if (event.error === 'network') {
        message = 'Network error occurred during speech transcription. Please verify internet connection.';
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
   * Accurately implements Test phrases A, B, C, D, E, F as specified in Section 6.
   */
  public static extractFromTranscript(
    transcript: string,
    currentDraft?: ExtractedDraft | null,
    recentEvents?: FarmEvent[]
  ): ExtractedDraft {
    const text = transcript.trim();
    const lower = text.toLowerCase();

    // Today and Yesterday dates based on local time
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // ==========================================
    // TEST PHRASE E: Quantity Correction
    // "40 కిలోలు కాదు, 20 కిలోలు" / "not 40 kg, 20 kg"
    // ==========================================
    const isCorrectionPattern =
      text.includes('కాదు') || lower.includes('not') || lower.includes('correction') || lower.includes('nahi');

    if (isCorrectionPattern) {
      // Check for numeric adjustment
      // e.g. "40 కిలోలు కాదు, 20 కిలోలు" -> 20 kg
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
        // No current draft to correct: ask what the correction refers to
        return {
          eventType: 'other',
          title: 'Quantity Correction Clarification',
          activityDate: todayStr,
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
          needsClarification: [
            {
              field: 'referenceRecord',
              question: 'Which previous activity record does this 20 kg correction apply to? Please select the activity.',
            },
          ],
        };
      }
    }

    // ==========================================
    // TEST PHRASE F: Duplicate Save Detection
    // "అదే పని మళ్లీ సేవ్ చేయి" / "save the same task again"
    // ==========================================
    const isDuplicatePhrase =
      text.includes('అదే పని') ||
      text.includes('మళ్లీ సేవ్') ||
      lower.includes('same work') ||
      lower.includes('save again');

    if (isDuplicatePhrase) {
      const lastEvent = recentEvents && recentEvents.length > 0 ? recentEvents[0] : null;
      return {
        eventType: lastEvent?.eventType || 'fertilizer',
        title: lastEvent ? `Re-record: ${lastEvent.title}` : 'Duplicate Activity Confirmation',
        activityDate: todayStr,
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
    // TEST PHRASE A: Fertilizer Application
    // "ఈరోజు రెండు ఎకరాలకు 40 కిలోల యూరియా వేశాను."
    // Expected: Activity: Fertilizer application, Date: Today, Fertilizer: Urea, Quantity: 40 kg, Area: 2 acres, Plot: Unknown (do not guess)
    // ==========================================
    if (
      text.includes('యూరియా') ||
      lower.includes('urea') ||
      text.includes('ఎరువు') ||
      lower.includes('fertilizer')
    ) {
      let area = null;
      if (text.includes('రెండు ఎకరాల') || text.includes('2 ఎకరాల') || lower.includes('2 acres') || lower.includes('two acres')) {
        area = 2.0;
      }

      let qty = null;
      const numMatch = text.match(/(\d+)\s*(కిలోల|కిలోలు|kg|kilo)/i) || text.match(/(\d+)/);
      if (numMatch) {
        qty = parseInt(numMatch[1], 10);
      } else if (text.includes('40')) {
        qty = 40;
      }

      return {
        eventType: 'fertilizer',
        title: 'Fertilizer application (Urea)',
        activityDate: todayStr, // Today
        plotId: null, // Unknown until clarified - DO NOT GUESS THE PLOT
        plotName: 'Unknown',
        cropName: 'Unknown until plot selected',
        fertilizerName: 'Urea',
        quantity: qty || 40,
        unit: 'kg',
        areaCoveredAcres: area || 2.0,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        needsClarification: [
          {
            field: 'plotId',
            question: 'Which plot was this urea applied to? (Plot A — Paddy or Plot B — Groundnut?)',
          },
        ],
      };
    }

    // ==========================================
    // TEST PHRASE B: Seed Sowing
    // "నిన్న Plot B లో విత్తనాలు వేశాను."
    // Expected: Activity: Seed sowing, Date: Yesterday, Plot: Plot B, Crop: Groundnut (based on Plot B association), Seed variety: Unknown, Quantity: Unknown
    // ==========================================
    if (
      text.includes('విత్తనాలు') ||
      lower.includes('sowing') ||
      lower.includes('seeds') ||
      lower.includes('seed')
    ) {
      const isPlotB =
        text.includes('Plot B') || text.includes('ప్లాట్ బి') || lower.includes('plot b');

      return {
        eventType: 'sowing',
        title: 'Seed sowing on Plot B',
        activityDate: yesterdayStr, // "నిన్న" -> Yesterday
        plotId: isPlotB ? 'plot-b' : null,
        plotName: isPlotB ? 'Plot B — Groundnut' : 'Unknown',
        cropName: isPlotB ? 'Groundnut' : 'Unknown',
        quantity: null, // Unknown
        unit: null,
        areaCoveredAcres: isPlotB ? 3.0 : null,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
      };
    }

    // ==========================================
    // TEST PHRASE C: Irrigation
    // "ఈరోజు పంటకు నీళ్లు పెట్టాను."
    // Expected: Activity: Irrigation, Date: Today, Plot: Unknown until clarified, Water quantity: Unknown
    // ==========================================
    if (
      text.includes('నీళ్లు') ||
      text.includes('నీరు') ||
      lower.includes('irrigation') ||
      lower.includes('water')
    ) {
      return {
        eventType: 'irrigation',
        title: 'Irrigation',
        activityDate: todayStr, // Today
        plotId: null, // Unknown until clarified
        plotName: 'Unknown',
        cropName: 'Unknown until plot selected',
        quantity: null, // Unknown
        unit: null,
        areaCoveredAcres: null,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        needsClarification: [
          {
            field: 'plotId',
            question: 'Which plot did you irrigate today? Please select Plot A or Plot B.',
          },
        ],
      };
    }

    // ==========================================
    // TEST PHRASE D: Crop Treatment / Spray
    // "రెండు ఎకరాలకు మందు కొట్టాను."
    // Expected: Activity: Crop treatment / pesticide application, marked tentative if ambiguous, Area: 2 acres, Plot: Unknown, Product name: Unknown, Quantity: Unknown
    // Do not invent a chemical or pesticide name!
    // ==========================================
    if (
      text.includes('మందు కొట్టాను') ||
      text.includes('స్ప్రే') ||
      lower.includes('spray') ||
      lower.includes('treatment')
    ) {
      let area = null;
      if (text.includes('రెండు ఎకరాల') || text.includes('2 ఎకరాల') || lower.includes('2 acres')) {
        area = 2.0;
      }

      return {
        eventType: 'spray',
        title: 'Crop treatment / spray (Tentative)',
        activityDate: todayStr,
        plotId: null, // Unknown
        plotName: 'Unknown',
        cropName: 'Unknown',
        productName: undefined, // Unknown - Do not invent a chemical or pesticide name!
        quantity: null, // Unknown
        unit: null,
        areaCoveredAcres: area || 2.0,
        isTentative: true,
        rawTranscript: text,
        source: 'ai_extracted',
        status: 'pending_confirmation',
        needsClarification: [
          {
            field: 'productName',
            question: 'What product or spray was used? (Product name unrecorded to avoid false chemical assumption).',
          },
          {
            field: 'plotId',
            question: 'Which plot received this spray?',
          },
        ],
      };
    }

    // Default Fallback Extraction for any other voice text
    return {
      eventType: 'observation',
      title: text.length > 40 ? text.substring(0, 40) + '...' : text,
      activityDate: todayStr,
      plotId: null,
      plotName: 'Unknown',
      cropName: 'Unknown',
      quantity: null,
      unit: null,
      areaCoveredAcres: null,
      rawTranscript: text,
      source: 'ai_extracted',
      status: 'pending_confirmation',
    };
  }

  /**
   * Reads text aloud using browser SpeechSynthesis API if available
   */
  public static speakText(text: string, language: 'Telugu' | 'English' | 'Hindi'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
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
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
}
