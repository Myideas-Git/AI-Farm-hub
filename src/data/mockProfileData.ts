import {
  FarmerProfile,
  FarmerPreferences,
  INITIAL_PROFILE,
  INITIAL_PREFERENCES,
} from '../types/profile';

export const INITIAL_FARMER_PROFILE: FarmerProfile = INITIAL_PROFILE;
export const INITIAL_FARMER_PREFERENCES: FarmerPreferences = INITIAL_PREFERENCES;

export const ROLE_LABELS: Record<string, string> = {
  'Farmer / Farm Owner': 'Farmer / Farm Owner',
  owner_operator: 'Owner & Primary Operator',
  farm_manager: 'Farm Manager / Supervisor',
  tenant_farmer: 'Tenant / Sharecropper Farmer',
  family_advisor: 'Family Member & Digital Advisor',
  progressive_grower: 'Progressive Agtech Adopter',
};

export const OBJECTIVE_LABELS: Record<string, string> = {
  'Improve farming profitability': 'Improve farming profitability',
  'Reduce input costs': 'Reduce input costs',
  'Improve crop yield': 'Improve crop yield',
  'Save water': 'Save water',
  'Maintain accurate farm records': 'Maintain accurate farm records',
  cost_reduction: 'Reduce Input Costs & Wastage',
  yield_maximization: 'Maximize Harvest Yield & Output',
  soil_health_regeneration: 'Build Long-Term Soil Organic Matter',
  risk_mitigation: 'Minimize Pest, Weather & Cash Flow Risks',
  organic_transition: 'Transition Toward Low-Chemical / Organic Farming',
  market_profit_timing: 'Time Mandi Selling for Top Market Price',
};
