import { FarmerProfile, FarmerPreferences } from '../types/profile';

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  id: 'farmer-01',
  fullName: 'Ramesh Patel',
  preferredName: 'Ramesh-ji',
  role: 'owner_operator',
  experienceYears: 22,
  primaryObjectives: [
    'cost_reduction',
    'soil_health_regeneration',
    'yield_maximization',
  ],
  phone: '+91 98260 41209',
  village: 'Pipariya',
  district: 'Narmadapuram',
  state: 'Madhya Pradesh',
  avatarInitials: 'RP',
};

export const INITIAL_FARMER_PREFERENCES: FarmerPreferences = {
  language: 'en',
  voiceLanguage: 'hi-IN',
  interactionMode: 'standard',
  aiResponseStyle: 'explanatory',
  recommendationBehavior: 'balanced',
  displayScale: 'standard',
  highContrastMode: false,
  audioFeedback: false,
  unitLand: 'acres',
  unitWeight: 'quintals',
  unitCurrency: 'INR',
  notifications: {
    irrigationWindowAlerts: true,
    scoutingReminders: true,
    mandiPriceReports: false,
    offlineSyncAlerts: true,
  },
};

export const ROLE_LABELS: Record<string, string> = {
  owner_operator: 'Owner & Primary Operator',
  farm_manager: 'Farm Manager / Supervisor',
  tenant_farmer: 'Tenant / Sharecropper Farmer',
  family_advisor: 'Family Member & Digital Advisor',
  progressive_grower: 'Progressive Agtech Adopter',
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  cost_reduction: 'Reduce Input Costs & Wastage',
  yield_maximization: 'Maximize Harvest Yield & Output',
  soil_health_regeneration: 'Build Long-Term Soil Organic Matter',
  risk_mitigation: 'Minimize Pest, Weather & Cash Flow Risks',
  organic_transition: 'Transition Toward Low-Chemical / Organic Farming',
  market_profit_timing: 'Time Mandi Selling for Top Market Price',
};
