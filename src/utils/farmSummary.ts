/**
 * AI Farm Hub — Farm Memory & Expenditure Summary Calculation Engine
 * Pure, reusable summary calculation logic shared between UI components and automated test suites.
 *
 * STRICT DATA INTEGRITY GUARANTEES:
 * 1. Demo records (isDemo: true) NEVER contribute to real farmer expenditure or confirmed counts.
 * 2. Estimated costs (costType: 'estimated', isEstimate: true, source: 'ai_estimated') are NEVER
 *    counted as actual farmer expenditure.
 * 3. Plot filtering strictly isolates events belonging to the selected plot.
 * 4. Filtering does not mutate or duplicate stored events.
 */

import {
  ActivitySource,
  ConfidenceSource,
  ConfirmationStatus,
  CostType,
  CropCycle,
  CropStage,
  EvidenceType,
  FarmEvent,
  FarmEventType,
  Plot,
} from '../types/farm';
import type { TranslationDictionary } from '../i18n/translations';

export interface EvidenceTally {
  receipts: number;
  photos: number;
  gps: number;
  weather: number;
  soil: number;
}

export interface SummaryInputItem {
  name: string;
  qty: string;
  type: string;
  date: string | null;
}

export interface FarmSummaryResult {
  // Real Farmer Metrics (Strictly non-demo, non-estimated)
  realTotalEvents: number;
  realConfirmedCount: number;
  realPendingCount: number;
  realExpenditure: number;
  realHarvestYieldKg: number;
  realInputs: SummaryInputItem[];
  realEvidenceTally: EvidenceTally;
  realEstimatedEventsCount: number;
  realEstimatedCostTotal: number;

  // Synthetic Demo Metrics (Separately tracked for interface demonstration)
  demoTotalEvents: number;
  demoConfirmedCount: number;
  demoExpenditure: number;
  demoHarvestYieldKg: number;
  demoInputs: SummaryInputItem[];
  demoEvidenceTally: EvidenceTally;
  demoEstimatedEventsCount: number;
  demoEstimatedCostTotal: number;

  // Unverified Estimates (Active scope total; excludes demo when excludeDemo is true)
  estimatedEventsCount: number;
  estimatedCostTotal: number;

  // Active View Filter Context
  activeVisibleCount: number;
  hasRealData: boolean;
  hasDemoData: boolean;
  isDemoModeOnly: boolean;
}

export interface SummaryCalculationOptions {
  plotId?: string | null; // null or 'all' calculates across all plots
  excludeDemo?: boolean;
}

export interface FarmEventFilterOptions {
  category?: 'all' | 'farmer' | 'demo';
  plotId?: string;
  eventType?: string;
  source?: string;
  searchQuery?: string;
}

/**
 * Determines if an event represents an unverified estimate rather than a recorded actual fact.
 */
export function isEstimatedEvent(evt: FarmEvent): boolean {
  return (
    Boolean(evt.isEstimate) ||
    evt.costType === 'estimated' ||
    evt.source === 'ai_estimated' ||
    evt.status === 'estimated'
  );
}

/**
 * Pure, non-mutating timeline filter and chronological sorter shared between FarmTimeline UI and tests.
 */
export function filterFarmEvents(
  events: FarmEvent[],
  filters: FarmEventFilterOptions = {}
): FarmEvent[] {
  const {
    category = 'all',
    plotId = 'all',
    eventType = 'all',
    source = 'all',
    searchQuery = '',
  } = filters;

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filtered = events.filter((evt) => {
    if (category === 'farmer' && evt.isDemo) return false;
    if (category === 'demo' && !evt.isDemo) return false;

    if (plotId && plotId !== 'all') {
      if (plotId === 'unassigned' && evt.plotId !== null) return false;
      if (plotId !== 'unassigned' && evt.plotId !== plotId) return false;
    }

    if (eventType && eventType !== 'all') {
      if (eventType === 'spray' && evt.eventType !== 'spray') return false;
      if (
        eventType === 'pest_scouting' &&
        evt.eventType !== 'pest_scouting' &&
        evt.eventType !== 'observation'
      ) {
        return false;
      }
      if (
        eventType !== 'spray' &&
        eventType !== 'pest_scouting' &&
        evt.eventType !== eventType
      ) {
        return false;
      }
    }

    if (source && source !== 'all') {
      if (source === 'ai_estimated') {
        if (!isEstimatedEvent(evt)) return false;
      } else if (source === 'farmer_confirmed') {
        const isConfirmed =
          !isEstimatedEvent(evt) &&
          (evt.confirmationStatus === 'confirmed' ||
            evt.status === 'farmer_confirmed' ||
            evt.source === 'farmer_confirmed');
        if (!isConfirmed) return false;
      } else if (source === 'receipt_verified') {
        const hasReceipt =
          evt.source === 'receipt_verified' ||
          evt.evidenceType === 'receipt' ||
          evt.evidence?.type === 'receipt';
        if (!hasReceipt) return false;
      } else if (source === 'gps_captured') {
        const hasGps =
          evt.source === 'gps_captured' ||
          evt.evidenceType === 'gps_observation' ||
          evt.evidence?.type === 'gps';
        if (!hasGps) return false;
      } else if (source === 'weather_data') {
        const hasWeather =
          evt.source === 'weather_data' ||
          evt.evidenceType === 'weather_data' ||
          evt.evidence?.type === 'weather';
        if (!hasWeather) return false;
      } else if (source === 'soil_report') {
        const hasSoil =
          evt.source === 'soil_report' ||
          evt.evidenceType === 'soil_test' ||
          evt.evidence?.type === 'soil_test' ||
          evt.evidence?.type === 'lab_report';
        if (!hasSoil) return false;
      } else if (evt.source !== source) {
        return false;
      }
    }

    if (trimmedQuery) {
      const matchesTitle = evt.title.toLowerCase().includes(trimmedQuery);
      const matchesInput =
        evt.inputName?.toLowerCase().includes(trimmedQuery) ||
        evt.fertilizerName?.toLowerCase().includes(trimmedQuery) ||
        evt.productName?.toLowerCase().includes(trimmedQuery);
      const matchesDesc = evt.description?.toLowerCase().includes(trimmedQuery);
      const matchesPlot = evt.plotName.toLowerCase().includes(trimmedQuery);
      const matchesCrop = evt.cropName.toLowerCase().includes(trimmedQuery);
      const matchesDate = evt.activityDate?.toLowerCase().includes(trimmedQuery);
      const matchesType = evt.eventType.toLowerCase().includes(trimmedQuery);
      if (
        !matchesTitle &&
        !matchesInput &&
        !matchesDesc &&
        !matchesPlot &&
        !matchesCrop &&
        !matchesDate &&
        !matchesType
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort newest-first on a fresh array without mutating caller's input
  return [...filtered].sort((a, b) => {
    const dateA = a.activityDate ? new Date(a.activityDate).getTime() : 0;
    const dateB = b.activityDate ? new Date(b.activityDate).getTime() : 0;
    return dateB - dateA;
  });
}

function tallyEvidence(tally: EvidenceTally, evt: FarmEvent): void {
  const evType = evt.evidence?.type;
  if (evType === 'receipt' || evt.evidenceType === 'receipt' || evt.source === 'receipt_verified') {
    tally.receipts++;
  }
  if (evType === 'photo' || evt.evidenceType === 'photograph' || evt.source === 'camera_product') {
    tally.photos++;
  }
  if (evType === 'gps' || evt.evidenceType === 'gps_observation' || evt.source === 'gps_captured') {
    tally.gps++;
  }
  if (evType === 'weather' || evt.evidenceType === 'weather_data' || evt.source === 'weather_data') {
    tally.weather++;
  }
  if (
    evType === 'soil_test' ||
    evType === 'lab_report' ||
    evt.evidenceType === 'soil_test' ||
    evt.source === 'soil_report'
  ) {
    tally.soil++;
  }
}

function extractHarvestYieldKg(evt: FarmEvent): number {
  if (evt.eventType !== 'harvest') return 0;
  if (typeof evt.quantity !== 'number' || !Number.isFinite(evt.quantity) || evt.quantity <= 0) {
    return 0;
  }
  const normalizedUnit = (evt.unit || '').trim().toLowerCase();
  if (normalizedUnit === 'quintal' || normalizedUnit === 'quintals' || normalizedUnit === 'q') {
    return Math.round(evt.quantity * 100 * 100) / 100;
  }
  if (normalizedUnit === 'kg' || normalizedUnit === 'kgs' || normalizedUnit === 'kilograms') {
    return evt.quantity;
  }
  return 0;
}

/**
 * Calculates farm activity and expenditure summary with strict demo-versus-real boundaries.
 *
 * Policy:
 * - Real farmer metrics ALWAYS exclude synthetic demo records (isDemo: true) and estimated records.
 * - Synthetic demo metrics are tracked in separate demo* fields for clearly labelled interface demos.
 * - When options.excludeDemo is true, demo records are filtered out globally before calculation.
 */
export function calculateFarmSummary(
  events: FarmEvent[],
  options?: SummaryCalculationOptions
): FarmSummaryResult {
  const targetPlotId = options?.plotId;
  const excludeDemo = Boolean(options?.excludeDemo);

  // 1. Apply plot and optional demo-exclusion filter safely without mutating input array
  const scopedEvents = events.filter((evt) => {
    if (excludeDemo && evt.isDemo) return false;
    if (!targetPlotId || targetPlotId === 'all') return true;
    if (targetPlotId === 'unassigned') return evt.plotId === null;
    return evt.plotId === targetPlotId;
  });

  let realTotalEvents = 0;
  let realConfirmedCount = 0;
  let realPendingCount = 0;
  let realExpenditure = 0;
  let realHarvestYieldKg = 0;
  const realInputs: SummaryInputItem[] = [];
  const realEvidenceTally: EvidenceTally = { receipts: 0, photos: 0, gps: 0, weather: 0, soil: 0 };
  let realEstimatedEventsCount = 0;
  let realEstimatedCostTotal = 0;

  let demoTotalEvents = 0;
  let demoConfirmedCount = 0;
  let demoExpenditure = 0;
  let demoHarvestYieldKg = 0;
  const demoInputs: SummaryInputItem[] = [];
  const demoEvidenceTally: EvidenceTally = { receipts: 0, photos: 0, gps: 0, weather: 0, soil: 0 };
  let demoEstimatedEventsCount = 0;
  let demoEstimatedCostTotal = 0;

  for (const evt of scopedEvents) {
    const isSyntheticDemo = Boolean(evt.isDemo);
    const isEstimated = isEstimatedEvent(evt);
    const isFarmerConfirmed =
      !isEstimated &&
      (evt.confirmationStatus === 'confirmed' || evt.status === 'farmer_confirmed');

    const costValue =
      typeof evt.cost === 'number' && Number.isFinite(evt.cost) && evt.cost > 0 ? evt.cost : 0;
    const inputName = evt.inputName || evt.fertilizerName || evt.productName || '';
    const qtyFormatted =
      evt.quantity !== null && evt.quantity !== undefined
        ? `${evt.quantity} ${evt.unit || ''}`.trim()
        : '';

    if (isSyntheticDemo) {
      // Synthetic demo record processing — NEVER touches real* counters
      demoTotalEvents++;
      if (isEstimated) {
        demoEstimatedEventsCount++;
        demoEstimatedCostTotal += costValue;
      } else {
        if (isFarmerConfirmed) {
          demoConfirmedCount++;
        }
        if (costValue > 0) {
          demoExpenditure += costValue;
        }
        if (inputName) {
          demoInputs.push({
            name: inputName,
            qty: qtyFormatted,
            type: evt.eventType,
            date: evt.activityDate,
          });
        }
        demoHarvestYieldKg += extractHarvestYieldKg(evt);
      }
      tallyEvidence(demoEvidenceTally, evt);
    } else {
      // Real farmer record processing
      realTotalEvents++;
      if (isEstimated) {
        realEstimatedEventsCount++;
        realEstimatedCostTotal += costValue;
      } else {
        if (isFarmerConfirmed) {
          realConfirmedCount++;
        } else if (
          evt.confirmationStatus === 'pending' ||
          evt.status === 'pending_confirmation' ||
          evt.status === 'pending_ai_processing'
        ) {
          realPendingCount++;
        }

        // Cost integrity rule: only real, non-estimated, positive costs contribute to realExpenditure
        if (costValue > 0) {
          realExpenditure += costValue;
        }

        if (inputName) {
          realInputs.push({
            name: inputName,
            qty: qtyFormatted,
            type: evt.eventType,
            date: evt.activityDate,
          });
        }

        realHarvestYieldKg += extractHarvestYieldKg(evt);
      }
      tallyEvidence(realEvidenceTally, evt);
    }
  }

  const estimatedEventsCount = excludeDemo
    ? realEstimatedEventsCount
    : realEstimatedEventsCount + demoEstimatedEventsCount;
  const estimatedCostTotal = excludeDemo
    ? realEstimatedCostTotal
    : realEstimatedCostTotal + demoEstimatedCostTotal;

  const hasRealData = realTotalEvents > 0;
  const hasDemoData = demoTotalEvents > 0;

  return {
    realTotalEvents,
    realConfirmedCount,
    realPendingCount,
    realExpenditure,
    realHarvestYieldKg,
    realInputs,
    realEvidenceTally,
    realEstimatedEventsCount,
    realEstimatedCostTotal,
    demoTotalEvents,
    demoConfirmedCount,
    demoExpenditure,
    demoHarvestYieldKg,
    demoInputs,
    demoEvidenceTally,
    demoEstimatedEventsCount,
    demoEstimatedCostTotal,
    estimatedEventsCount,
    estimatedCostTotal,
    activeVisibleCount: scopedEvents.length,
    hasRealData,
    hasDemoData,
    isDemoModeOnly: !hasRealData && hasDemoData,
  };
}

export interface EvidenceVerificationEvaluation {
  canIndependentlyVerify: boolean;
  reason: string;
}

/**
 * Enforces P0 evidence limitation rules:
 * - GPS location alone does not prove sowing, irrigation, spraying, or other field activity occurred.
 * - Weather data alone does not prove irrigation occurred.
 * - A purchase receipt may support a purchase/sale, but does not prove field application.
 * - A photograph supports visual evidence, but does not automatically prove date, quantity, or correct application.
 * - Manual entry / farmer statement is a farmer report, never independent verification.
 * - Independent verification requires an explicit documented verification mechanism beyond these single signals.
 */
export function evaluateEvidenceVerificationSupport(
  eventType: FarmEventType,
  evidenceType: EvidenceType,
  verificationMechanism?: string
): EvidenceVerificationEvaluation {
  const hasDocumentedMechanism = Boolean(verificationMechanism && verificationMechanism.trim().length > 0);

  if (evidenceType === 'farmer_statement' || evidenceType === 'none') {
    return {
      canIndependentlyVerify: false,
      reason: 'Farmer self-report or missing evidence is not independent verification.',
    };
  }

  if (evidenceType === 'gps_observation') {
    return {
      canIndependentlyVerify: false,
      reason: `GPS coordinates alone cannot independently verify that ${eventType} occurred.`,
    };
  }

  if (evidenceType === 'weather_data') {
    return {
      canIndependentlyVerify: false,
      reason: `Weather data alone cannot independently verify that ${eventType} occurred.`,
    };
  }

  if (evidenceType === 'receipt') {
    if (eventType !== 'sale') {
      return {
        canIndependentlyVerify: false,
        reason: `A receipt may support a purchase or weighment, but does not independently verify field application (${eventType}).`,
      };
    }
    if (!hasDocumentedMechanism) {
      return {
        canIndependentlyVerify: false,
        reason: 'Receipt requires a documented independent verification mechanism to be marked verified.',
      };
    }
  }

  if (evidenceType === 'photograph') {
    return {
      canIndependentlyVerify: false,
      reason: 'A photograph supports visual observation, but does not automatically prove date, quantity, or field application.',
    };
  }

  if (!hasDocumentedMechanism) {
    return {
      canIndependentlyVerify: false,
      reason: 'Independent verification requires an explicit documented verification mechanism.',
    };
  }

  return {
    canIndependentlyVerify: true,
    reason: `Supported by documented verification mechanism: ${verificationMechanism}`,
  };
}

export function inferActivitySource(evt: FarmEvent): ActivitySource {
  if (evt.activitySource) return evt.activitySource;
  if (isEstimatedEvent(evt)) return 'model_estimate';
  if (evt.source === 'farmer_voice' || evt.source === 'ai_extracted') return 'voice_input';
  if (evt.source === 'camera_product') return 'camera_assisted';
  if (evt.source === 'farmer_reported' || evt.source === 'demo_data' || evt.source === 'farmer_confirmed') {
    return 'manual_entry';
  }
  return 'unknown';
}

export function inferEvidenceType(evt: FarmEvent): EvidenceType {
  if (evt.evidenceType) return evt.evidenceType;
  switch (evt.evidence?.type) {
    case 'receipt':
      return 'receipt';
    case 'photo':
      return 'photograph';
    case 'gps':
      return 'gps_observation';
    case 'weather':
      return 'weather_data';
    case 'soil_test':
    case 'lab_report':
      return 'soil_test';
    case 'audio_note':
      return 'farmer_statement';
    case 'none':
    default:
      return evt.source === 'farmer_reported' || evt.source === 'farmer_voice'
        ? 'farmer_statement'
        : 'none';
  }
}

export function inferConfirmationStatus(evt: FarmEvent): ConfirmationStatus {
  if (isEstimatedEvent(evt)) return 'not_applicable';
  if (evt.confirmationStatus) return evt.confirmationStatus;
  if (evt.status === 'farmer_confirmed') return 'confirmed';
  return 'pending';
}

export function inferCostType(evt: FarmEvent): CostType {
  if (isEstimatedEvent(evt)) return 'estimated';
  if (evt.cost === null || evt.cost === undefined) return 'unknown';
  return evt.costType || 'actual';
}

/**
 * P1 Confidence Integrity Rule:
 * - Never invent AI confidence for manually entered records.
 * - Never equate GPS accuracy with confidence that an activity occurred.
 * - Real records may only carry a confidence score when genuinely measured from a documented
 *   real source ('web_speech_api_asr' or 'sensor_calibration') in (0, 1].
 * - Demo records may only carry a confidence score if explicitly marked 'synthetic_demo_only'.
 */
export function sanitizeEventConfidence(evt: FarmEvent): {
  confidence: number | undefined;
  confidenceSource: ConfidenceSource | undefined;
} {
  const rawConfidence = evt.confidence;
  const rawSource = evt.confidenceSource;

  if (
    typeof rawConfidence !== 'number' ||
    !Number.isFinite(rawConfidence) ||
    rawConfidence <= 0 ||
    rawConfidence > 1
  ) {
    return { confidence: undefined, confidenceSource: undefined };
  }

  const activitySource = inferActivitySource(evt);
  const evidenceType = inferEvidenceType(evt);

  // Manual entries never have measured AI confidence
  if (activitySource === 'manual_entry' || evt.source === 'farmer_reported') {
    return { confidence: undefined, confidenceSource: undefined };
  }

  // GPS accuracy is not confidence that an activity occurred
  if (evidenceType === 'gps_observation' || evt.source === 'gps_captured') {
    if (rawSource !== 'web_speech_api_asr' && rawSource !== 'sensor_calibration') {
      return { confidence: undefined, confidenceSource: undefined };
    }
  }

  // Missing confidenceSource means unsubstantiated/invented percentage -> strip
  if (!rawSource) {
    return { confidence: undefined, confidenceSource: undefined };
  }

  // Real farmer records must never carry synthetic_demo_only confidence
  if (!evt.isDemo && rawSource === 'synthetic_demo_only') {
    return { confidence: undefined, confidenceSource: undefined };
  }

  // Demo records must never present confidence as a real measured score
  if (evt.isDemo && rawSource !== 'synthetic_demo_only') {
    return { confidence: undefined, confidenceSource: undefined };
  }

  return { confidence: rawConfidence, confidenceSource: rawSource };
}

/**
 * Normalizes separated provenance fields, strips unsupported confidence scores,
 * and prevents unsupported claims of independent verification.
 */
export function normalizeEventProvenance(evt: FarmEvent): FarmEvent {
  const estimated = isEstimatedEvent(evt);
  const activitySource = inferActivitySource(evt);
  const evidenceType = inferEvidenceType(evt);
  const confirmationStatus = inferConfirmationStatus(evt);
  const costType = inferCostType(evt);
  const originalSource = evt.originalSource ?? evt.source;

  let verificationStatus = evt.verificationStatus;
  if (estimated) {
    verificationStatus = 'estimated';
  } else if (verificationStatus === 'confirmed') {
    const evalResult = evaluateEvidenceVerificationSupport(
      evt.eventType,
      evidenceType,
      evt.verificationMechanism
    );
    if (!evalResult.canIndependentlyVerify) {
      verificationStatus = evt.isDemo ? 'demo' : 'unverified';
    }
  }

  const { confidence, confidenceSource } = sanitizeEventConfidence({
    ...evt,
    activitySource,
    evidenceType,
  });

  return {
    ...evt,
    originalSource,
    activitySource,
    evidenceType,
    confirmationStatus,
    costType,
    verificationStatus,
    confidence,
    confidenceSource,
  };
}

/**
 * Dynamic yield unit converter from quintals to kilograms.
 * 1 Quintal = 100 Kilograms.
 * Returns null for missing, non-finite, or negative inputs so missing yield is never silently treated as 0.
 */
export function convertQuintalsToKilograms(quintals: number | null | undefined): number | null {
  if (
    quintals === null ||
    quintals === undefined ||
    typeof quintals !== 'number' ||
    !Number.isFinite(quintals) ||
    quintals < 0
  ) {
    return null;
  }
  return Math.round(quintals * 100 * 100) / 100;
}

/**
 * Formats yield in quintals alongside its dynamically computed kilogram equivalent.
 * Explicitly displays the localized missing-yield label when yield is absent or invalid.
 */
export function formatYieldDisplay(
  quintals: number | null | undefined,
  t: TranslationDictionary
): string {
  const kg = convertQuintalsToKilograms(quintals);
  if (kg === null || quintals === null || quintals === undefined) {
    return t.myFarm.yieldNotRecorded;
  }
  return `${quintals} ${t.myFarm.quintalsUnit} (${kg.toLocaleString('en-IN')} ${t.myFarm.kgUnit})`;
}

/**
 * Localizes known agricultural measurement units into the active UI language,
 * preserving unrecognized custom unit strings verbatim.
 */
export function formatUnitLabel(
  unit: string | null | undefined,
  t: TranslationDictionary
): string {
  if (!unit) return '';
  const normalized = unit.trim().toLowerCase();
  if (normalized === 'kg' || normalized === 'kilogram' || normalized === 'kilograms') {
    return t.myFarm.kgUnit;
  }
  if (normalized === 'quintal' || normalized === 'quintals' || normalized === 'qtl') {
    return t.myFarm.quintalsUnit;
  }
  if (normalized === 'hour' || normalized === 'hours' || normalized === 'hr' || normalized === 'hrs' || normalized === 'runtime hours') {
    return t.units.hours;
  }
  if (normalized === 'bag' || normalized === 'bags') {
    return t.units.bags;
  }
  if (normalized === 'liter' || normalized === 'liters' || normalized === 'litre' || normalized === 'litres' || normalized === 'l') {
    return t.units.liters;
  }
  if (normalized === 'ml' || normalized === 'milliliter' || normalized === 'milliliters') {
    return t.units.ml;
  }
  if (normalized === 'acre' || normalized === 'acres') {
    return t.units.acres;
  }
  return unit;
}

/**
 * Maps ActivityStorageService error codes to localized farmer-facing error messages.
 */
export function getLocalizedStorageError(
  code:
    | 'QUOTA_EXCEEDED'
    | 'STORAGE_UNAVAILABLE'
    | 'NOT_FOUND'
    | 'CORRUPT_DATA'
    | 'DUPLICATE'
    | 'INVALID_STATE'
    | 'UNKNOWN'
    | undefined,
  fallbackMessage: string,
  t: TranslationDictionary
): string {
  switch (code) {
    case 'QUOTA_EXCEEDED':
      return t.errors.quotaExceeded;
    case 'STORAGE_UNAVAILABLE':
      return t.errors.storageUnavailable;
    case 'CORRUPT_DATA':
      return t.errors.corruptData;
    case 'DUPLICATE':
      return t.errors.duplicateRecord;
    case 'INVALID_STATE':
      return t.errors.estimateCannotBeConfirmed;
    case 'NOT_FOUND':
      return t.errors.recordNotFound;
    default:
      return fallbackMessage || t.errors.saveActivityFailed;
  }
}

export interface StateValidationResult {
  isValid: boolean;
  issues: string[];
}

/**
 * P1 Crop Lifecycle State Machine Definitions
 */
export const CROP_STAGE_ORDER: readonly CropStage[] = [
  'land_preparation',
  'sowing',
  'vegetative',
  'flowering',
  'grain_filling',
  'maturity',
  'harvested',
] as const;

export const VALID_STAGE_TRANSITIONS: Record<CropStage, readonly CropStage[]> = {
  unknown: [
    'land_preparation',
    'sowing',
    'vegetative',
    'flowering',
    'grain_filling',
    'maturity',
    'harvested',
  ],
  land_preparation: ['sowing'],
  sowing: ['vegetative'],
  vegetative: ['flowering'],
  flowering: ['grain_filling'],
  grain_filling: ['maturity'],
  maturity: ['harvested'],
  harvested: [], // Terminal stage for a cycle; a new crop starts a new CropCycle
};

export const VALID_CYCLE_STATUS_TRANSITIONS: Record<
  CropCycle['status'],
  readonly CropCycle['status'][]
> = {
  unknown: ['active', 'completed', 'abandoned'],
  active: ['completed', 'abandoned'],
  completed: [], // Terminal
  abandoned: [], // Terminal
};

export const STAGE_PROGRESS_BOUNDS: Record<CropStage, readonly [number, number]> = {
  unknown: [0, 99],
  land_preparation: [0, 15],
  sowing: [10, 25],
  vegetative: [25, 55],
  flowering: [50, 75],
  grain_filling: [70, 90],
  maturity: [85, 99],
  harvested: [100, 100],
};

function isIsoDateOrdered(earlier: string, later: string): boolean {
  const t1 = Date.parse(earlier);
  const t2 = Date.parse(later);
  if (Number.isNaN(t1) || Number.isNaN(t2)) return false;
  return t2 >= t1;
}

/**
 * Checks whether expectedHarvestDate has passed while actualHarvestDate remains unrecorded.
 * Explicitly supports the P1 rule: do NOT infer an actual harvest merely because an expected date has passed.
 */
export function hasExpectedHarvestPassedWithoutActual(
  cycle: CropCycle,
  referenceDateIso: string
): boolean {
  if (!cycle.expectedHarvestDate || cycle.actualHarvestDate) return false;
  const expectedTs = Date.parse(cycle.expectedHarvestDate);
  const refTs = Date.parse(referenceDateIso);
  if (Number.isNaN(expectedTs) || Number.isNaN(refTs)) return false;
  return refTs > expectedTs;
}

/**
 * Validates whether a CropStage transition is allowed under the crop lifecycle state machine.
 */
export function validateCropStageTransition(
  fromStage: CropStage,
  toStage: CropStage,
  nextCycleContext?: Partial<CropCycle>
): StateValidationResult {
  const issues: string[] = [];

  if (fromStage === toStage) {
    return { isValid: true, issues: [] };
  }

  const allowedTargets = VALID_STAGE_TRANSITIONS[fromStage] || [];
  if (!allowedTargets.includes(toStage)) {
    issues.push(
      `Invalid crop stage transition from "${fromStage}" to "${toStage}". Allowed next stage(s): ${
        allowedTargets.length > 0 ? allowedTargets.join(', ') : 'none (terminal stage)'
      }.`
    );
  }

  // Entering sowing or later requires sowingDate
  if (
    toStage !== 'land_preparation' &&
    toStage !== 'unknown' &&
    nextCycleContext &&
    !nextCycleContext.sowingDate
  ) {
    issues.push(`Transitioning to stage "${toStage}" requires a recorded sowingDate.`);
  }

  // Entering harvested requires explicit actualHarvestDate (never inferred from expectedHarvestDate)
  if (toStage === 'harvested') {
    if (!nextCycleContext?.actualHarvestDate) {
      issues.push(
        'Transitioning to stage "harvested" requires an explicit actualHarvestDate; expectedHarvestDate alone is insufficient.'
      );
    }
    if (nextCycleContext?.status && nextCycleContext.status !== 'completed') {
      issues.push('Transitioning to stage "harvested" requires cycle status "completed".');
    }
  }

  return { isValid: issues.length === 0, issues };
}

/**
 * Validates whether a CropCycle status transition is permitted.
 */
export function validateCycleStatusTransition(
  fromStatus: CropCycle['status'],
  toStatus: CropCycle['status'],
  cycle: Partial<CropCycle>
): StateValidationResult {
  const issues: string[] = [];

  if (fromStatus === toStatus) {
    return { isValid: true, issues: [] };
  }

  const allowed = VALID_CYCLE_STATUS_TRANSITIONS[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    issues.push(
      `Invalid cycle status transition from "${fromStatus}" to "${toStatus}". Allowed: ${
        allowed.length > 0 ? allowed.join(', ') : 'none (terminal status)'
      }.`
    );
  }

  if (toStatus === 'completed') {
    if (cycle.stage !== 'harvested') {
      issues.push('Cannot mark crop cycle "completed" unless stage is "harvested".');
    }
    if (!cycle.actualHarvestDate) {
      issues.push('Cannot mark crop cycle "completed" without an explicit actualHarvestDate.');
    }
  }

  return { isValid: issues.length === 0, issues };
}

/**
 * Validates plot and crop cycle states, dates, progress bounds, and yield consistency.
 * Prevents contradictory combinations such as a plot in "preparation" whose currentCropCycleId
 * points to a "harvested" / "completed" cycle at 100% progress.
 */
export function validateCropCycleState(plot: Plot, cycle?: CropCycle): StateValidationResult {
  const issues: string[] = [];
  if (!cycle) {
    return { isValid: true, issues: [] };
  }

  const isCurrentPlotCycle = plot.currentCropCycleId === cycle.id;

  // 1. Cycle stage vs lifecycle status consistency
  if (cycle.stage === 'harvested' && cycle.status !== 'completed') {
    issues.push(
      'A crop cycle at stage "harvested" must have lifecycle status "completed", not "' +
        cycle.status +
        '".'
    );
  }
  if (cycle.status === 'completed' && cycle.stage !== 'harvested') {
    issues.push(
      'A "completed" crop cycle must have stage "harvested" (found "' + cycle.stage + '").'
    );
  }

  // 2. Expected harvest date vs actual harvest date & sowing date rules
  if (cycle.stage === 'harvested' && !cycle.actualHarvestDate) {
    issues.push(
      'Harvested crop cycle must have an actualHarvestDate explicitly recorded; expectedHarvestDate alone does not confirm harvest.'
    );
  }

  if (
    cycle.stage !== 'land_preparation' &&
    cycle.stage !== 'unknown' &&
    !cycle.sowingDate
  ) {
    issues.push(
      `Crop cycle at stage "${cycle.stage}" must have a sowingDate recorded (or remain in land_preparation/unknown).`
    );
  }

  if (cycle.sowingDate && cycle.expectedHarvestDate) {
    if (!isIsoDateOrdered(cycle.sowingDate, cycle.expectedHarvestDate)) {
      issues.push('expectedHarvestDate cannot be earlier than sowingDate.');
    }
  }

  if (cycle.sowingDate && cycle.actualHarvestDate) {
    if (!isIsoDateOrdered(cycle.sowingDate, cycle.actualHarvestDate)) {
      issues.push('actualHarvestDate cannot be earlier than sowingDate.');
    }
  }

  // 3. Progress percentage consistency against defined stage bounds
  if (cycle.stageProgressPercent !== undefined && cycle.stageProgressPercent !== null) {
    if (
      !Number.isFinite(cycle.stageProgressPercent) ||
      cycle.stageProgressPercent < 0 ||
      cycle.stageProgressPercent > 100
    ) {
      issues.push('stageProgressPercent must be between 0 and 100.');
    } else {
      const [minPct, maxPct] = STAGE_PROGRESS_BOUNDS[cycle.stage];
      if (cycle.stageProgressPercent < minPct || cycle.stageProgressPercent > maxPct) {
        issues.push(
          `stageProgressPercent (${cycle.stageProgressPercent}%) is inconsistent with stage "${cycle.stage}" (expected ${minPct}%–${maxPct}%).`
        );
      }
    }
  } else if (cycle.stage === 'harvested') {
    issues.push('Harvested cycle stage progress must be 100%.');
  }

  // 4. Yield consistency
  if (
    cycle.actualYieldQuintals !== undefined &&
    cycle.actualYieldQuintals !== null
  ) {
    if (!Number.isFinite(cycle.actualYieldQuintals) || cycle.actualYieldQuintals < 0) {
      issues.push('actualYieldQuintals cannot be negative.');
    }
    if (cycle.stage === 'land_preparation' || cycle.stage === 'sowing') {
      issues.push(
        `actualYieldQuintals cannot be recorded while cycle stage is "${cycle.stage}".`
      );
    }
  }

  if (
    cycle.targetYieldQuintals !== undefined &&
    cycle.targetYieldQuintals !== null &&
    (!Number.isFinite(cycle.targetYieldQuintals) || cycle.targetYieldQuintals < 0)
  ) {
    issues.push('targetYieldQuintals cannot be negative.');
  }

  // 5. Plot status vs currentCropCycleId consistency
  if (isCurrentPlotCycle) {
    if (plot.status === 'preparation') {
      if (cycle.stage === 'harvested' || cycle.status === 'completed') {
        issues.push(
          'Plot marked "preparation" cannot have its currentCropCycleId pointing to a "harvested"/"completed" cycle; completed prior cycles must be separated from the active preparation cycle.'
        );
      }
    }
    if (plot.status === 'fallow' && cycle.status === 'active') {
      issues.push('Plot marked "fallow" cannot have an "active" current crop cycle.');
    }
    if (plot.status === 'active_crop' && cycle.status !== 'active') {
      issues.push(
        `Plot marked "active_crop" must reference an "active" current cycle (found "${cycle.status}").`
      );
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Validates Andhra Pradesh demo farm baseline area allocation:
 * 2 acres paddy + 3 acres groundnut = 5.0 acres total.
 */
export function validateFarmAreaBaseline(plots: Plot[], totalFarmAreaAcres: number): {
  isValid: boolean;
  sumPlotsAcres: number;
  expectedTotalAcres: number;
} {
  const sum = plots.reduce((acc, p) => acc + (p.areaAcres || 0), 0);
  const roundedSum = Math.round(sum * 10) / 10;
  const roundedTotal = Math.round(totalFarmAreaAcres * 10) / 10;
  return {
    isValid: roundedSum === 5.0 && roundedTotal === 5.0 && roundedSum === roundedTotal,
    sumPlotsAcres: roundedSum,
    expectedTotalAcres: roundedTotal,
  };
}

