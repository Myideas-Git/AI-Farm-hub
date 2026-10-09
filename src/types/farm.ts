/**
 * AI-Powered Farm Intelligence Platform / AI Farm Hub
 * Phase 0.5 — Core Extensible Data Models with Provenance and Trust Tracking
 */

export type TrustStatus =
  | 'confirmed'
  | 'estimated'
  | 'demo'
  | 'unknown'
  | 'pending'
  | 'conflicting';

export type EventSource =
  | 'farmer_reported'
  | 'ai_extracted'
  | 'farmer_confirmed'
  | 'verified_document'
  | 'demo_data'
  | 'unknown';

export type RecordStatus =
  | 'draft'
  | 'pending_confirmation'
  | 'farmer_confirmed'
  | 'conflicting'
  | 'demo'
  | 'demo_incomplete'
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

export interface FarmEventEvidence {
  type: 'photo' | 'receipt' | 'audio_note' | 'lab_report' | 'none';
  label?: string;
  uri?: string;
  notes?: string;
  isDocumentVerified?: boolean;
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
  quantity?: number | null;
  unit?: string | null;
  areaCoveredAcres?: number | null;
  cost?: number | null;
  currency: string;
  source: EventSource;
  status: RecordStatus;
  verificationStatus: TrustStatus;
  isDemo: boolean;
  evidence: FarmEventEvidence;
  confidence?: number; // 0 - 1
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
