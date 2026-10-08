/**
 * AI-Powered Farm Intelligence Platform
 * Phase 0.5 — Profile & Personalization Data Models
 *
 * Strict Architectural Separation:
 * - Profile: "Who am I?" (Identity, experience, objectives, role)
 * - Preferences: "How should the application behave for me?" (Language, mode, contrast, style, units)
 * - Farm & Plots remain separate in /types/farm.ts ("What do I own or manage?")
 */

export type FarmerRole =
  | 'owner_operator'
  | 'farm_manager'
  | 'tenant_farmer'
  | 'family_advisor'
  | 'progressive_grower';

export type FarmerObjective =
  | 'cost_reduction'
  | 'yield_maximization'
  | 'soil_health_regeneration'
  | 'risk_mitigation'
  | 'organic_transition'
  | 'market_profit_timing';

export interface FarmerProfile {
  id: string;
  fullName: string;
  preferredName: string; // e.g., "Ramesh-ji" or "Ramesh Patel"
  role: FarmerRole;
  experienceYears: number;
  primaryObjectives: FarmerObjective[];
  phone?: string;
  village: string;
  district: string;
  state: string;
  avatarInitials: string;
}

export type InteractionMode = 'simplified' | 'standard' | 'data_rich';

export type AiResponseStyle = 'concise' | 'explanatory' | 'conversational';

export type RecommendationBehavior =
  | 'conservative'
  | 'balanced'
  | 'progressive'
  | 'soil_first';

export type DisplayScale = 'standard' | 'large' | 'extra_large';

export type LandUnit = 'acres' | 'bigha' | 'hectares' | 'guntha';

export type WeightUnit = 'quintals' | 'kg' | 'bags' | 'tons';

export interface FarmerPreferences {
  // Localization & Speech
  language: 'en' | 'hi' | 'hinglish';
  voiceLanguage: 'hi-IN' | 'en-IN';

  // Interaction ergonomics
  interactionMode: InteractionMode;
  aiResponseStyle: AiResponseStyle;
  recommendationBehavior: RecommendationBehavior;

  // Accessibility & Outdoor Sunlight
  displayScale: DisplayScale;
  highContrastMode: boolean; // High-contrast black/white for outdoor harsh sunlight
  audioFeedback: boolean; // Audio confirmation tones on button click

  // Agricultural Units
  unitLand: LandUnit;
  unitWeight: WeightUnit;
  unitCurrency: 'INR';

  // Advisory Notifications
  notifications: {
    irrigationWindowAlerts: boolean;
    scoutingReminders: boolean;
    mandiPriceReports: boolean;
    offlineSyncAlerts: boolean;
  };
}
