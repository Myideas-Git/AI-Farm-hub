/**
 * AI-Powered Farm Intelligence Platform
 * Phase 0 — Core Extensible Data Models
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
  | 'farmer_confirmed'
  | 'ai_extracted'
  | 'ai_estimated'
  | 'verified_document'
  | 'unknown';

export type SyncState = 'online' | 'offline' | 'pending_sync' | 'sync_completed';

export type SemanticHealth = 'healthy' | 'attention' | 'urgent' | 'info' | 'unknown';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: string;
  experienceYears: number;
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
  soilPrimary: string;
  primaryWaterSource: string;
}

export type CropStage =
  | 'land_preparation'
  | 'sowing'
  | 'vegetative'
  | 'flowering'
  | 'grain_filling'
  | 'maturity'
  | 'harvested';

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  areaAcres: number;
  soilType: string;
  waterSource: string;
  irrigationType: string;
  currentCropCycleId?: string;
  status: 'active_crop' | 'fallow' | 'preparation';
  soilOrganicCarbon?: number | null; // null represents unknown (never 0!)
  soilPH?: number | null;
  soilDataTrust: TrustStatus;
}

export interface Crop {
  id: string;
  commonName: string;
  scientificName: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  standardDurationDays: number;
}

export interface CropCycle {
  id: string;
  plotId: string;
  cropId: string;
  cropName: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  sowingDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  actualHarvestDate?: string;
  stage: CropStage;
  stageProgressPercent: number; // 0-100
  targetYieldQuintals: number;
  actualYieldQuintals?: number | null;
  status: 'active' | 'completed' | 'abandoned';
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
  | 'sale';

export interface FarmEventEvidence {
  type: 'photo' | 'receipt' | 'audio_note' | 'lab_report' | 'none';
  label?: string;
  uri?: string;
  notes?: string;
}

export interface FarmEvent {
  eventId: string;
  eventType: FarmEventType;
  farmerId: string;
  farmId: string;
  plotId: string;
  plotName: string;
  cropCycleId: string;
  cropName: string;
  activityDate: string; // YYYY-MM-DD
  recordedDate: string; // ISO
  title: string;
  description?: string;
  quantity?: number | null;
  unit?: string;
  areaCoveredAcres?: number | null;
  cost?: number | null;
  currency: string;
  source: EventSource;
  evidence: FarmEventEvidence;
  confidence?: number; // 0 - 1
  verificationStatus: TrustStatus;
  createdBy: string;
  confirmedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  farmEventId?: string;
  plotId: string;
  category: 'seeds' | 'fertilizer' | 'chemicals' | 'labor' | 'irrigation_power' | 'machinery' | 'transport' | 'other';
  amount: number;
  currency: string;
  date: string;
  description: string;
  trustStatus: TrustStatus;
}

export interface Harvest {
  id: string;
  cropCycleId: string;
  plotId: string;
  date: string;
  quantityQuintals: number;
  qualityGrade: string;
  storageLocation: string;
  trustStatus: TrustStatus;
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
  isMock: true; // Explicitly declared mock
}

export interface FarmInsight {
  id: string;
  title: string;
  summary: string;
  detail: string;
  severity: SemanticHealth;
  plotId?: string;
  plotName?: string;
  metricComparison?: {
    currentCycleValue: string;
    previousCycleValue: string;
    deltaPercentage: string;
    unit: string;
  };
  recommendationPrompt: string; // "You decide"
  isDemo: true;
}
