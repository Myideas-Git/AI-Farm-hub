import {
  Farmer,
  Farm,
  Plot,
  CropCycle,
  FarmEvent,
  MarketBenchmark,
  FarmInsight,
} from '../types/farm';

export const DEMO_FARMER: Farmer = {
  id: 'farmer-ravi-01',
  name: 'Ravi Kumar',
  preferredName: 'Ravi garu',
  role: 'Farmer / Farm Owner',
  phone: '', // Not provided - preserved unknown
  village: 'Rasapūdipalem',
  district: 'Anakapalli',
  state: 'Andhra Pradesh',
  country: 'India',
  digitalComfort: 'Intermediate',
  experienceYears: 5,
  primaryObjectives: [
    'Improve farming profitability',
    'Reduce input costs',
    'Improve crop yield',
    'Save water',
    'Maintain accurate farm records',
  ],
};

export const DEMO_FARM: Farm = {
  id: 'farm-ravi-01',
  farmerId: 'farmer-ravi-01',
  name: 'Ravi Kumar Farm',
  totalAreaAcres: 5.0,
  location: 'Rasapūdipalem, Anakapalli district, Andhra Pradesh',
  village: 'Rasapūdipalem',
  district: 'Anakapalli',
  state: 'Andhra Pradesh',
  country: 'India',
  irrigationSource: null, // Unknown
  soilPrimary: null, // Unknown
  soilTestStatus: 'not_available', // Not available
};

export const DEMO_PLOTS: Plot[] = [
  {
    id: 'plot-a',
    farmId: 'farm-ravi-01',
    name: 'Plot A — Paddy',
    areaAcres: 2.0,
    cropName: 'Paddy / Rice',
    soilType: null, // Unknown
    waterSource: null, // Unknown
    irrigationType: null, // Unknown
    season: null, // Not specified
    currentCropCycleId: 'cycle-paddy-01',
    status: 'preparation',
    soilOrganicCarbon: null, // Unknown (never 0)
    soilPH: null, // Unknown (never 0)
    soilDataTrust: 'unknown',
  },
  {
    id: 'plot-b',
    farmId: 'farm-ravi-01',
    name: 'Plot B — Groundnut',
    areaAcres: 3.0,
    cropName: 'Groundnut',
    soilType: null, // Unknown
    waterSource: null, // Unknown
    irrigationType: null, // Unknown
    season: null, // Not specified
    currentCropCycleId: 'cycle-groundnut-01',
    status: 'preparation',
    soilOrganicCarbon: null, // Unknown
    soilPH: null, // Unknown
    soilDataTrust: 'unknown',
  },
];

export const DEMO_CROP_CYCLES: CropCycle[] = [
  {
    id: 'cycle-paddy-01',
    plotId: 'plot-a',
    cropId: 'crop-paddy',
    cropName: 'Paddy / Rice',
    variety: null, // Unknown
    season: null, // Not specified
    sowingDate: null, // Unknown
    expectedHarvestDate: null, // Unknown
    stage: 'land_preparation',
    stageProgressPercent: 10,
    targetYieldQuintals: null, // Unknown
    actualYieldQuintals: null, // Unknown
    status: 'active',
    notes: 'Demo crop cycle. Sowing date and variety unrecorded.',
  },
  {
    id: 'cycle-groundnut-01',
    plotId: 'plot-b',
    cropId: 'crop-groundnut',
    cropName: 'Groundnut',
    variety: null, // Unknown
    season: null, // Not specified
    sowingDate: null, // Unknown
    expectedHarvestDate: null, // Unknown
    stage: 'land_preparation',
    stageProgressPercent: 10,
    targetYieldQuintals: null, // Unknown
    actualYieldQuintals: null, // Unknown
    status: 'active',
    notes: 'Demo crop cycle. Sowing date and variety unrecorded.',
  },
];

/**
 * 5 Standard Sample Activity Records clearly tagged as DEMO records.
 * Cannot be mistaken for real completed farmer activities.
 */
export const INITIAL_DEMO_EVENTS: FarmEvent[] = [
  {
    eventId: 'DEMO-001',
    eventType: 'land_prep',
    farmerId: 'farmer-ravi-01',
    farmId: 'farm-ravi-01',
    plotId: 'plot-a',
    plotName: 'Plot A — Paddy',
    cropName: 'Paddy',
    activityDate: null, // Unknown
    recordedDate: '2026-10-01T00:00:00Z',
    title: 'Land preparation',
    description: 'Land preparation activity on Plot A — Paddy (Demo record).',
    quantity: null, // Unknown
    unit: null,
    areaCoveredAcres: 2.0,
    cost: null,
    currency: 'INR',
    source: 'demo_data',
    status: 'demo',
    verificationStatus: 'demo',
    isDemo: true,
    evidence: { type: 'none' },
    createdBy: 'Demo System',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    eventId: 'DEMO-002',
    eventType: 'land_prep',
    farmerId: 'farmer-ravi-01',
    farmId: 'farm-ravi-01',
    plotId: 'plot-b',
    plotName: 'Plot B — Groundnut',
    cropName: 'Groundnut',
    activityDate: null, // Unknown
    recordedDate: '2026-10-01T00:00:00Z',
    title: 'Land preparation',
    description: 'Land preparation activity on Plot B — Groundnut (Demo record).',
    quantity: null, // Unknown
    unit: null,
    areaCoveredAcres: 3.0,
    cost: null,
    currency: 'INR',
    source: 'demo_data',
    status: 'demo',
    verificationStatus: 'demo',
    isDemo: true,
    evidence: { type: 'none' },
    createdBy: 'Demo System',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    eventId: 'DEMO-003',
    eventType: 'fertilizer',
    farmerId: 'farmer-ravi-01',
    farmId: 'farm-ravi-01',
    plotId: null, // Not specified
    plotName: 'Not specified',
    cropName: 'Not specified',
    fertilizerName: 'Urea',
    activityDate: null, // Unknown
    recordedDate: '2026-10-02T00:00:00Z',
    title: 'Fertilizer application',
    description: 'Fertilizer: Urea. Plot and quantity not recorded.',
    quantity: null, // Unknown
    unit: null,
    areaCoveredAcres: null, // Unknown
    cost: null,
    currency: 'INR',
    source: 'demo_data',
    status: 'demo_incomplete',
    verificationStatus: 'demo',
    isDemo: true,
    evidence: { type: 'none' },
    createdBy: 'Demo System',
    createdAt: '2026-10-02T00:00:00Z',
    updatedAt: '2026-10-02T00:00:00Z',
  },
  {
    eventId: 'DEMO-004',
    eventType: 'irrigation',
    farmerId: 'farmer-ravi-01',
    farmId: 'farm-ravi-01',
    plotId: null, // Not specified
    plotName: 'Not specified',
    cropName: 'Not specified',
    activityDate: null, // Unknown
    recordedDate: '2026-10-03T00:00:00Z',
    title: 'Irrigation',
    description: 'Irrigation activity. Water quantity and plot unknown.',
    quantity: null, // Unknown
    unit: null,
    areaCoveredAcres: null,
    cost: null,
    currency: 'INR',
    source: 'demo_data',
    status: 'demo_incomplete',
    verificationStatus: 'demo',
    isDemo: true,
    evidence: { type: 'none' },
    createdBy: 'Demo System',
    createdAt: '2026-10-03T00:00:00Z',
    updatedAt: '2026-10-03T00:00:00Z',
  },
  {
    eventId: 'DEMO-005',
    eventType: 'sowing',
    farmerId: 'farmer-ravi-01',
    farmId: 'farm-ravi-01',
    plotId: null, // Not specified
    plotName: 'Not specified',
    cropName: 'Not specified',
    activityDate: null, // Unknown
    recordedDate: '2026-10-04T00:00:00Z',
    title: 'Seed sowing',
    description: 'Seed variety and quantity unknown. Incomplete demo record.',
    quantity: null, // Unknown
    unit: null,
    areaCoveredAcres: null,
    cost: null,
    currency: 'INR',
    source: 'demo_data',
    status: 'demo_incomplete',
    verificationStatus: 'demo',
    isDemo: true,
    evidence: { type: 'none' },
    createdBy: 'Demo System',
    createdAt: '2026-10-04T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z',
  },
];

export const DEMO_SAMPLE_INSIGHT: FarmInsight = {
  id: 'insight-01',
  title: 'Input recording initial baseline',
  summary: 'Plot A (Paddy) and Plot B (Groundnut) are registered in early land preparation stage.',
  detail:
    'Ravi Kumar Farm (5.0 acres) in Rasapūdipalem has registered Plot A (2 acres Paddy) and Plot B (3 acres Groundnut). No completed input or harvest vouchers are confirmed yet. Historical comparisons will activate as real activities are recorded.',
  severity: 'info',
  plotId: 'plot-a',
  plotName: 'Plot A — Paddy',
  recommendationPrompt:
    'Confirm plot boundaries and record sowing when field preparation finishes.',
  isDemo: true,
};

export const DEMO_MARKET_BENCHMARKS: MarketBenchmark[] = [
  {
    cropId: 'crop-paddy',
    cropName: 'Paddy (Common / Dhan)',
    variety: 'BPT-5204 (Samba Mahsuri)',
    marketName: 'Anakapalli AMC Market Yard',
    minPricePerQuintal: 2183,
    modalPricePerQuintal: 2320,
    maxPricePerQuintal: 2450,
    currency: 'INR',
    trend: 'stable',
    lastUpdatedDate: '2026-10-07',
    isMock: true,
  },
  {
    cropId: 'crop-groundnut',
    cropName: 'Groundnut (Pods / Verusenaga)',
    variety: 'K-6 (Kadiri)',
    marketName: 'Anakapalli AMC Market Yard',
    minPricePerQuintal: 6200,
    modalPricePerQuintal: 6780,
    maxPricePerQuintal: 7150,
    currency: 'INR',
    trend: 'up',
    lastUpdatedDate: '2026-10-07',
    isMock: true,
  },
];
