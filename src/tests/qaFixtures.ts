/**
 * AI Farm Hub — Typed P0 QA Fixtures
 * Uses the repository's actual FarmEvent, Plot, and CropCycle types to exercise
 * real production functions across demo-vs-real boundaries, estimated costs,
 * farmer confirmation, evidence limitations, unknown values, filtering, and reload persistence.
 */

import { FarmEvent } from '../types/farm';

/**
 * 1. Synthetic demo event with actual cost and farmer_confirmed status.
 * Must NEVER contribute to realExpenditure, realConfirmedCount, or realEvidenceTally.
 */
export const QA_FIXTURE_DEMO_WITH_COST: FarmEvent = {
  eventId: 'QA-DEMO-COST-01',
  eventType: 'fertilizer',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  inputName: 'Urea (Demo Synthetic)',
  fertilizerName: 'Urea',
  activityDate: '2026-06-25',
  recordedDate: '2026-06-25T10:00:00Z',
  title: 'Demo Fertilizer Purchase & Application',
  description: 'Synthetic demo fertilizer event with cost.',
  quantity: 45,
  unit: 'kg',
  areaCoveredAcres: 2.0,
  cost: 1200,
  currency: 'INR',
  costType: 'actual',
  source: 'demo_data',
  originalSource: 'demo_data',
  activitySource: 'manual_entry',
  evidenceType: 'receipt',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'demo',
  isDemo: true,
  evidence: {
    type: 'receipt',
    label: 'Synthetic Demo Receipt',
    isDocumentVerified: false,
  },
  createdBy: 'Demo System',
  confirmedBy: 'Demo System',
  confirmedAt: '2026-06-25T10:05:00Z',
  createdAt: '2026-06-25T10:00:00Z',
  updatedAt: '2026-06-25T10:05:00Z',
};

/**
 * 2. Synthetic demo AI estimate with a projected cost.
 * Must NEVER contaminate realExpenditure OR realEstimatedEventsCount / realEstimatedCostTotal.
 */
export const QA_FIXTURE_DEMO_ESTIMATE: FarmEvent = {
  eventId: 'QA-DEMO-EST-01',
  eventType: 'fertilizer',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  inputName: 'Potash Estimate (Demo)',
  activityDate: '2026-07-10',
  recordedDate: '2026-07-10T09:00:00Z',
  title: 'Synthetic Demo Nutrient Estimate',
  quantity: 20,
  unit: 'kg',
  areaCoveredAcres: 2.0,
  cost: 650,
  currency: 'INR',
  costType: 'estimated',
  source: 'ai_estimated',
  originalSource: 'ai_estimated',
  activitySource: 'model_estimate',
  evidenceType: 'none',
  status: 'estimated',
  confirmationStatus: 'not_applicable',
  verificationStatus: 'estimated',
  isEstimate: true,
  estimateRationale: 'Synthetic demo projection only',
  isDemo: true,
  evidence: { type: 'none' },
  createdBy: 'Demo Advisory Engine',
  createdAt: '2026-07-10T09:00:00Z',
  updatedAt: '2026-07-10T09:00:00Z',
};

/**
 * 3. Real farmer non-estimated event with eligible actual cost on Plot A.
 * Must be counted EXACTLY ONCE in realExpenditure and realConfirmedCount.
 */
export const QA_FIXTURE_REAL_ACTUAL_COST: FarmEvent = {
  eventId: 'QA-REAL-ACTUAL-01',
  eventType: 'fertilizer',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  inputName: 'Neem Coated Urea',
  fertilizerName: 'Urea',
  activityDate: '2026-06-28',
  recordedDate: '2026-06-28T14:00:00Z',
  title: 'Real Farmer Urea Top-Dressing',
  description: 'Farmer logged real urea purchase and application.',
  quantity: 50,
  unit: 'kg',
  areaCoveredAcres: 2.0,
  cost: 540,
  currency: 'INR',
  costType: 'actual',
  source: 'farmer_reported',
  originalSource: 'farmer_reported',
  activitySource: 'manual_entry',
  evidenceType: 'receipt',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'unverified',
  isDemo: false,
  evidence: {
    type: 'receipt',
    label: 'Dealer Cash Memo #402',
    isDocumentVerified: false,
  },
  createdBy: 'Ravi Kumar',
  confirmedBy: 'Ravi Kumar',
  confirmedAt: '2026-06-28T14:05:00Z',
  createdAt: '2026-06-28T14:00:00Z',
  updatedAt: '2026-06-28T14:05:00Z',
};

/**
 * 4. Real non-demo event with an estimated cost (costType: 'estimated', isEstimate: true).
 * Must be excluded from realExpenditure and tracked under realEstimatedCostTotal.
 */
export const QA_FIXTURE_REAL_ESTIMATED_COST: FarmEvent = {
  eventId: 'QA-REAL-EST-01',
  eventType: 'spray',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  inputName: 'Projected Spray Budget',
  activityDate: '2026-07-12',
  recordedDate: '2026-07-12T08:00:00Z',
  title: 'Estimated Spray Cost (Not Incurred)',
  quantity: 200,
  unit: 'ml',
  areaCoveredAcres: 2.0,
  cost: 900,
  currency: 'INR',
  costType: 'estimated',
  source: 'ai_estimated',
  originalSource: 'ai_estimated',
  activitySource: 'model_estimate',
  evidenceType: 'none',
  status: 'estimated',
  confirmationStatus: 'not_applicable',
  verificationStatus: 'estimated',
  isEstimate: true,
  estimateRationale: 'Rough seasonal cost projection before purchase',
  isDemo: false,
  evidence: { type: 'none' },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-07-12T08:00:00Z',
  updatedAt: '2026-07-12T08:00:00Z',
};

/**
 * 5. Real voice-extracted activity pending farmer confirmation.
 * Tests that farmer confirmation preserves source/originalSource/activitySource
 * and never alters verificationStatus.
 */
export const QA_FIXTURE_REAL_VOICE_PENDING: FarmEvent = {
  eventId: 'QA-REAL-VOICE-01',
  eventType: 'irrigation',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  activityDate: '2026-06-29',
  recordedDate: '2026-06-29T07:30:00Z',
  title: 'Voice-Recorded Borewell Irrigation',
  quantity: 3,
  unit: 'hours',
  areaCoveredAcres: 2.0,
  cost: 250,
  currency: 'INR',
  costType: 'actual',
  source: 'ai_extracted',
  originalSource: 'farmer_voice',
  activitySource: 'voice_input',
  evidenceType: 'farmer_statement',
  status: 'pending_confirmation',
  confirmationStatus: 'pending',
  verificationStatus: 'unverified',
  isDemo: false,
  rawTranscript: 'Plot A lo 3 gantalu neellu pettanu',
  evidence: { type: 'audio_note', label: 'Telugu Voice Note' },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-06-29T07:30:00Z',
  updatedAt: '2026-06-29T07:30:00Z',
};

/**
 * 6. Real Plot B (Groundnut) activity with actual cost for multi-plot filter isolation tests.
 */
export const QA_FIXTURE_PLOT_B_REAL: FarmEvent = {
  eventId: 'QA-REAL-PLOTB-01',
  eventType: 'sowing',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-b',
  plotName: 'Plot B — Groundnut',
  cropCycleId: 'cycle-groundnut-01',
  cropName: 'Groundnut',
  inputName: 'K-6 Groundnut Seed',
  activityDate: '2026-07-01',
  recordedDate: '2026-07-01T09:15:00Z',
  title: 'Groundnut Seed Sowing on Plot B',
  quantity: 90,
  unit: 'kg',
  areaCoveredAcres: 3.0,
  cost: 2400,
  currency: 'INR',
  costType: 'actual',
  source: 'farmer_reported',
  originalSource: 'farmer_reported',
  activitySource: 'manual_entry',
  evidenceType: 'farmer_statement',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'unverified',
  isDemo: false,
  evidence: { type: 'none' },
  createdBy: 'Ravi Kumar',
  confirmedBy: 'Ravi Kumar',
  confirmedAt: '2026-07-01T09:20:00Z',
  createdAt: '2026-07-01T09:15:00Z',
  updatedAt: '2026-07-01T09:20:00Z',
};

/**
 * 7. Real manual entry with unknown fields (null quantity, null cost, null date).
 * Must keep unknown values as null across save and reload — never coerced to 0.
 */
export const QA_FIXTURE_REAL_UNKNOWN_FIELDS: FarmEvent = {
  eventId: 'QA-REAL-UNKNOWN-01',
  eventType: 'weeding',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: null,
  plotName: 'Not specified',
  cropName: 'Not specified',
  activityDate: null,
  recordedDate: '2026-07-04T11:00:00Z',
  title: 'Manual Weeding (Incomplete Details)',
  quantity: null,
  unit: null,
  areaCoveredAcres: null,
  cost: null,
  currency: 'INR',
  costType: 'unknown',
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
  createdAt: '2026-07-04T11:00:00Z',
  updatedAt: '2026-07-04T11:00:00Z',
};

/**
 * 8. Attempted over-claim fixture: GPS-tagged sowing claiming verificationStatus: 'confirmed'.
 * Production provenance normalizer / storage MUST downgrade this because GPS alone cannot verify sowing.
 */
export const QA_FIXTURE_GPS_OVERCLAIM: FarmEvent = {
  eventId: 'QA-OVERCLAIM-GPS-01',
  eventType: 'sowing',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropName: 'Paddy',
  activityDate: '2026-06-11',
  recordedDate: '2026-06-11T10:00:00Z',
  title: 'GPS-Tagged Sowing Attempt',
  quantity: 25,
  unit: 'kg',
  areaCoveredAcres: 2.0,
  cost: null,
  currency: 'INR',
  costType: 'unknown',
  source: 'gps_captured',
  originalSource: 'farmer_reported',
  activitySource: 'manual_entry',
  evidenceType: 'gps_observation',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'confirmed', // Unsupported claim: GPS alone cannot independently verify sowing
  isDemo: false,
  evidence: {
    type: 'gps',
    gpsCoords: { latitude: 17.6868, longitude: 83.2185, accuracyMeters: 4 },
  },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-06-11T10:00:00Z',
  updatedAt: '2026-06-11T10:00:00Z',
};

/**
 * 9. Attempted over-claim fixture: Receipt-backed fertilizer application claiming verificationStatus: 'confirmed'.
 * A purchase receipt supports purchase only, never field application verification.
 */
export const QA_FIXTURE_RECEIPT_OVERCLAIM: FarmEvent = {
  eventId: 'QA-OVERCLAIM-RECEIPT-01',
  eventType: 'fertilizer',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropName: 'Paddy',
  inputName: 'DAP',
  activityDate: '2026-06-20',
  recordedDate: '2026-06-20T12:00:00Z',
  title: 'Receipt-Backed Fertilizer Application Attempt',
  quantity: 50,
  unit: 'kg',
  areaCoveredAcres: 2.0,
  cost: 1350,
  currency: 'INR',
  costType: 'actual',
  source: 'receipt_verified',
  originalSource: 'farmer_reported',
  activitySource: 'camera_assisted',
  evidenceType: 'receipt',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'confirmed', // Unsupported claim: purchase receipt does not prove field application
  isDemo: false,
  evidence: {
    type: 'receipt',
    label: 'DAP Purchase Invoice',
    isDocumentVerified: false,
  },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-06-20T12:00:00Z',
  updatedAt: '2026-06-20T12:00:00Z',
};

/**
 * 10. Real harvest record (15 quintals = 1500 kg) alongside synthetic demo harvest (1850 kg).
 * Ensures demo harvest yields never contaminate real harvest yield totals.
 */
export const QA_FIXTURE_REAL_HARVEST: FarmEvent = {
  eventId: 'QA-REAL-HARVEST-01',
  eventType: 'harvest',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropCycleId: 'cycle-paddy-01',
  cropName: 'Paddy',
  activityDate: '2026-08-25',
  recordedDate: '2026-08-25T18:00:00Z',
  title: 'Real Farmer Paddy Harvest',
  quantity: 15,
  unit: 'quintals',
  areaCoveredAcres: 2.0,
  cost: 2800,
  currency: 'INR',
  costType: 'actual',
  source: 'farmer_reported',
  originalSource: 'farmer_reported',
  activitySource: 'manual_entry',
  evidenceType: 'farmer_statement',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'unverified',
  isDemo: false,
  evidence: { type: 'none' },
  createdBy: 'Ravi Kumar',
  confirmedBy: 'Ravi Kumar',
  confirmedAt: '2026-08-25T18:05:00Z',
  createdAt: '2026-08-25T18:00:00Z',
  updatedAt: '2026-08-25T18:05:00Z',
};

/**
 * 11. Attempted over-claim fixture: Weather-only irrigation claiming verificationStatus: 'confirmed'.
 * Weather station data alone cannot independently prove that irrigation occurred.
 */
export const QA_FIXTURE_WEATHER_OVERCLAIM: FarmEvent = {
  eventId: 'QA-OVERCLAIM-WEATHER-01',
  eventType: 'irrigation',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropName: 'Paddy',
  activityDate: '2026-06-19',
  recordedDate: '2026-06-19T08:00:00Z',
  title: 'Weather-Backed Irrigation Attempt',
  quantity: 3,
  unit: 'hours',
  areaCoveredAcres: 2.0,
  cost: null,
  currency: 'INR',
  costType: 'unknown',
  source: 'weather_data',
  originalSource: 'farmer_reported',
  activitySource: 'manual_entry',
  evidenceType: 'weather_data',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'confirmed', // Unsupported claim: weather data alone does not prove irrigation occurred
  isDemo: false,
  evidence: {
    type: 'weather',
    label: 'Dry Spell Weather Log',
    weatherData: {
      condition: 'Clear / Dry',
      temperatureC: 35,
      rainfallMm: 0,
      humidityPercent: 52,
      sourceStation: 'Anakapalli Station',
    },
  },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-06-19T08:00:00Z',
  updatedAt: '2026-06-19T08:00:00Z',
};

/**
 * 12. Attempted over-claim fixture: Photo-only pesticide spray claiming verificationStatus: 'confirmed'.
 * A photograph supports visual evidence only and does not prove date, dosage, or field application.
 */
export const QA_FIXTURE_PHOTO_OVERCLAIM: FarmEvent = {
  eventId: 'QA-OVERCLAIM-PHOTO-01',
  eventType: 'spray',
  farmerId: 'farmer-ravi-01',
  farmId: 'farm-ravi-01',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  cropName: 'Paddy',
  inputName: 'Neem Oil',
  activityDate: '2026-07-05',
  recordedDate: '2026-07-05T15:00:00Z',
  title: 'Photo-Backed Spray Attempt',
  quantity: 150,
  unit: 'ml',
  areaCoveredAcres: 2.0,
  cost: 420,
  currency: 'INR',
  costType: 'actual',
  source: 'camera_product',
  originalSource: 'camera_product',
  activitySource: 'camera_assisted',
  evidenceType: 'photograph',
  status: 'farmer_confirmed',
  confirmationStatus: 'confirmed',
  verificationStatus: 'confirmed', // Unsupported claim: photograph does not prove date, dosage, or field application
  isDemo: false,
  evidence: {
    type: 'photo',
    label: 'Bottle Photo',
  },
  createdBy: 'Ravi Kumar',
  createdAt: '2026-07-05T15:00:00Z',
  updatedAt: '2026-07-05T15:00:00Z',
};

export const QA_EVIDENCE_LIMITED_FIXTURES: FarmEvent[] = [
  QA_FIXTURE_GPS_OVERCLAIM,
  QA_FIXTURE_RECEIPT_OVERCLAIM,
  QA_FIXTURE_WEATHER_OVERCLAIM,
  QA_FIXTURE_PHOTO_OVERCLAIM,
];

export const QA_MIXED_DATASET: FarmEvent[] = [
  QA_FIXTURE_DEMO_WITH_COST,
  QA_FIXTURE_DEMO_ESTIMATE,
  QA_FIXTURE_REAL_ACTUAL_COST,
  QA_FIXTURE_REAL_ESTIMATED_COST,
  QA_FIXTURE_REAL_VOICE_PENDING,
  QA_FIXTURE_PLOT_B_REAL,
  QA_FIXTURE_REAL_UNKNOWN_FIELDS,
];
