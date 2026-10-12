/**
 * AI-Powered Farm Intelligence Platform / AI Farm Hub
 * Phase 0.5 — Core Extensible Data Models with Provenance and Trust Tracking
 */

export type TrustStatus =
  | 'confirmed' // Independently verified (third-party, official document, or agronomist verified)
  | 'unverified' // Farmer self-declaration or unverified by independent parties
  | 'estimated'
  | 'demo'
  | 'unknown'
  | 'pending'
  | 'conflicting';

export type EventSource =
  | 'farmer_reported' // Manually reported by farmer via form or 1-tap quick action
  | 'farmer_voice' // Captured via farmer voice interaction
  | 'ai_extracted' // Extracted from speech/audio or multimodal input using AI/rule-based engine
  | 'ai_estimated' // Estimated by AI model (flagged clearly as estimate)
  | 'receipt_verified' // Verified with scanned receipt / invoice
  | 'camera_product' // Captured via camera inspection of input product/package
  | 'gps_captured' // Field coordinates captured via GPS
  | 'weather_data' // Weather service recorded
  | 'soil_report' // Laboratory soil test backed
  | 'verified_document' // General document/lab backed record
  | 'demo_data' // Pre-seeded fictional demo record
  | 'unknown'
  | 'farmer_confirmed'; // Backwards-compatible legacy value; new confirmations preserve original capture source

export type RecordStatus =
  | 'draft'
  | 'pending_confirmation'
  | 'pending_ai_processing' // Offline capture awaiting AI processing
  | 'farmer_confirmed'
  | 'conflicting'
  | 'demo'
  | 'demo_incomplete'
  | 'estimated'
  | 'unknown';

export type SyncState = 'online' | 'offline' | 'pending_sync' | 'sync_completed';

export type SemanticHealth = 'healthy' | 'attention' | 'urgent' | 'info' | 'unknown';

export interface CorrectionHistoryItem {
  id: string;
  timestamp: string;
  field: string;
  oldValue: string | number | null | undefined;
  newValue: string | number | null | undefined;
  reason?: string;
}

export interface ConflictItem {
  field: string;
  existingValue: string | number | null | undefined;
  incomingValue: string | number | null | undefined;
  description: string;
}

export interface Farmer {
  id: string;
  name: string;
  preferredName?: string;
  role: string;
  phone?: string;
  village: string;
  district: string;
  state: string;
  country: string;
  digitalComfort: 'Basic' | 'Intermediate' | 'Advanced';
  experienceYears: number;
  primaryObjectives: string[];
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  totalAreaAcres: number;
  location: string;
  village: string;
  district: string;
  state: string;
  country: string;
  irrigationSource: string | null; // null for unknown
  soilPrimary: string | null; // null for unknown
  soilTestStatus: 'not_available' | 'pending' | 'verified';
}

export type CropStage =
  | 'land_preparation'
  | 'sowing'
  | 'vegetative'
  | 'flowering'
  | 'grain_filling'
  | 'maturity'
  | 'harvested'
  | 'unknown';

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  areaAcres: number;
  cropName: string;
  soilType: string | null; // null for unknown
  waterSource: string | null; // null for unknown
  irrigationType: string | null;
  season?: string | null;
  currentCropCycleId?: string;
  status: 'active_crop' | 'fallow' | 'preparation' | 'unknown';
  soilOrganicCarbon?: number | null; // null represents unknown (never 0!)
  soilPH?: number | null;
  soilDataTrust: TrustStatus;
}

export interface Crop {
  id: string;
  commonName: string;
  scientificName?: string;
  variety: string | null;
  season?: string | null;
  standardDurationDays?: number;
}

export interface CropCycle {
  id: string;
  plotId: string;
  cropId: string;
  cropName: string;
  variety: string | null;
  season: string | null;
  sowingDate: string | null; // YYYY-MM-DD or null
  expectedHarvestDate: string | null;
  actualHarvestDate?: string | null;
  stage: CropStage;
  stageProgressPercent?: number;
  targetYieldQuintals: number | null;
  actualYieldQuintals?: number | null;
  status: 'active' | 'completed' | 'abandoned' | 'unknown';
  notes?: string;
}

export type FarmEventType =
  | 'land_prep'
  | 'sowing'
  | 'irrigation'
  | 'fertilizer'
  | 'pest_scouting'
  | 'spray'
  | 'weeding'
  | 'observation'
  | 'harvest'
  | 'sale'
  | 'other';

export interface ProductInspectionDetails {
  productName: string | null;
  manufacturer: string | null;
  activeIngredient: string | null;
  batchNumber: string | null;
  expiryDate: string | null;
  clarityIssue?: string | null;
}

export interface ReceiptInspectionDetails {
  seller: string | null;
  date: string | null;
  product: string | null;
  quantity: number | null;
  unit: string | null;
  amount: number | null;
  currency: string;
}

export interface GpsCoordinatesEvidence {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedAt?: string;
  locationName?: string;
}

export interface WeatherDataEvidence {
  condition: string;
  temperatureC?: number;
  rainfallMm?: number;
  humidityPercent?: number;
  recordedAt?: string;
  sourceStation?: string;
}

export interface SoilReportEvidence {
  sampleId: string;
  labName: string;
  testDate?: string;
  ph?: number;
  nitrogenKgPerHa?: number;
  phosphorusKgPerHa?: number;
  potassiumKgPerHa?: number;
  recommendation?: string;
}

export interface FarmEventEvidence {
  type: 'photo' | 'receipt' | 'audio_note' | 'lab_report' | 'gps' | 'weather' | 'soil_test' | 'none';
  label?: string;
  uri?: string;
  notes?: string;
  isDocumentVerified?: boolean;
  productDetails?: ProductInspectionDetails;
  receiptDetails?: ReceiptInspectionDetails;
  gpsCoords?: GpsCoordinatesEvidence;
  weatherData?: WeatherDataEvidence;
  soilReport?: SoilReportEvidence;
  isSimulatedAi?: boolean;
}

export interface FarmEvent {
  eventId: string;
  eventType: FarmEventType;
  farmerId: string;
  farmId: string;
  plotId: string | null; // null represents unknown/not specified
  plotName: string;
  cropCycleId?: string;
  cropName: string;
  activityDate: string | null; // YYYY-MM-DD or null if unknown
  recordedDate: string; // ISO
  title: string;
  description?: string;
  inputName?: string; // Specific input (e.g., 'Urea', 'Product X', 'Drip irrigation', 'BPT-5204 Seeds')
  quantity?: number | null;
  unit?: string | null;
  areaCoveredAcres?: number | null;
  cost?: number | null;
  currency: string;
  source: EventSource; // Original capture source (e.g. ai_extracted, farmer_reported, ai_estimated)
  originalSource?: EventSource; // Preserved initial source
  status: RecordStatus; // Lifecycle / confirmation status (e.g. pending_confirmation, farmer_confirmed)
  verificationStatus: TrustStatus; // Independent verification level (e.g. unverified, pending, confirmed)
  isDemo: boolean;
  isDateAssigned?: boolean; // Flagged true when date was auto-assigned today for review
  rawTranscript?: string; // Captured voice transcript note
  evidence: FarmEventEvidence;
  confidence?: number; // 0 - 1 (only when supported by real speech recognition or sensor metrics)
  isEstimate?: boolean; // When true, clearly displayed as an AI estimate to avoid presenting estimates as facts
  estimateRationale?: string;
  createdBy: string;
  confirmedBy?: string;
  confirmedAt?: string;
  correctionHistory?: CorrectionHistoryItem[];
  conflicts?: ConflictItem[];
  fertilizerName?: string;
  productName?: string;
  isTentative?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketBenchmark {
  cropId: string;
  cropName: string;
  variety: string;
  marketName: string;
  minPricePerQuintal: number;
  modalPricePerQuintal: number;
  maxPricePerQuintal: number;
  currency: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdatedDate: string;
  isMock: true;
}

export interface FarmInsight {
  id: string;
  title: string;
  summary: string;
  detail: string;
  severity: SemanticHealth;
  plotId?: string;
  plotName?: string;
  recommendationPrompt: string;
  isDemo: true;
}
