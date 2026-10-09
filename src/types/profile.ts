/**
 * AI Farm Hub — Phase 0.5 Profile & Personalization Data Models
 */

export type AppLanguage = 'Telugu' | 'English' | 'Hindi';
export type VoiceInputLanguage = 'Telugu' | 'English' | 'Hindi';
export type InteractionMode = 'Quick' | 'Assisted' | 'Detailed';
export type AiResponseStyle = 'Simple' | 'Balanced' | 'Detailed';
export type RecommendationMode = 'All recommendations' | 'Important situations' | 'Only when requested';
export type AppTheme = 'System' | 'Light' | 'Dark';
export type TextSize = 'Standard' | 'Large' | 'Extra large';
export type ContrastMode = 'Standard' | 'High contrast';
export type InteractionPreference = 'Touch' | 'Voice' | 'Balanced';

export interface FarmerProfile {
  id: string;
  fullName: string;
  preferredName: string; // "Ravi garu"
  role: string; // "Farmer / Farm Owner"
  experienceYears: number; // 5
  village: string; // "Rasapūdipalem"
  district: string; // "Anakapalli"
  state: string; // "Andhra Pradesh"
  country: string; // "India"
  digitalComfort: 'Basic' | 'Intermediate' | 'Advanced';
  primaryObjectives: string[];
  phone: string; // blank/not provided
  avatarInitials: string; // "RK"
}

export interface NotificationPreferences {
  importantAlerts: string[];
  reminders: string[];
}

export interface QuietHours {
  start: string; // "21:00"
  end: string;   // "06:00"
}

export interface FarmerPreferences {
  appLanguage: AppLanguage;
  voiceLanguage: VoiceInputLanguage;
  interactionMode: InteractionMode;
  aiResponseStyle: AiResponseStyle;
  recommendationMode: RecommendationMode;
  theme: AppTheme;
  textSize: TextSize;
  highContrast: boolean;
  readAloud: boolean;
  reduceMotion: boolean;
  interactionPreference: InteractionPreference;
  notificationPreferences: NotificationPreferences;
  quietHours: QuietHours;

  // Agricultural Units
  unitLand?: 'acres' | 'bigha' | 'hectares' | 'guntha';
  unitWeight?: 'quintals' | 'kg' | 'bags' | 'tons';
}

export const INITIAL_PREFERENCES: FarmerPreferences = {
  appLanguage: 'Telugu',
  voiceLanguage: 'Telugu',
  interactionMode: 'Quick',
  aiResponseStyle: 'Simple',
  recommendationMode: 'Important situations',
  theme: 'System',
  textSize: 'Large',
  highContrast: false,
  readAloud: true,
  reduceMotion: true,
  interactionPreference: 'Balanced',
  notificationPreferences: {
    importantAlerts: [
      'Severe weather',
      'Crop health',
      'Important farm alerts',
      'Payment',
      'Harvest',
    ],
    reminders: [
      'Irrigation',
      'Planned activities',
      'Market updates',
      'Record reminders',
    ],
  },
  quietHours: {
    start: '21:00',
    end: '06:00',
  },
  unitLand: 'acres',
  unitWeight: 'quintals',
};

export const INITIAL_PROFILE: FarmerProfile = {
  id: 'farmer-ravi-01',
  fullName: 'Ravi Kumar',
  preferredName: 'Ravi garu',
  role: 'Farmer / Farm Owner',
  experienceYears: 5,
  village: 'Rasapūdipalem',
  district: 'Anakapalli',
  state: 'Andhra Pradesh',
  country: 'India',
  digitalComfort: 'Intermediate',
  primaryObjectives: [
    'Improve farming profitability',
    'Reduce input costs',
    'Improve crop yield',
    'Save water',
    'Maintain accurate farm records',
  ],
  phone: '', // Not provided
  avatarInitials: 'RK',
};

/**
 * Migration helper to safely parse and migrate any old stored preferences.
 * Does not silently corrupt or change ambiguous settings.
 */
export function migratePreferences(raw: any): FarmerPreferences {
  if (!raw || typeof raw !== 'object') {
    return { ...INITIAL_PREFERENCES };
  }

  const result: FarmerPreferences = { ...INITIAL_PREFERENCES };

  // Language mapping
  if (raw.appLanguage === 'Telugu' || raw.appLanguage === 'English' || raw.appLanguage === 'Hindi') {
    result.appLanguage = raw.appLanguage;
  } else if (raw.language === 'hi') {
    result.appLanguage = 'Hindi';
  } else if (raw.language === 'en') {
    result.appLanguage = 'English';
  } else if (raw.language === 'te') {
    result.appLanguage = 'Telugu';
  }

  // Voice Language mapping
  if (raw.voiceLanguage === 'Telugu' || raw.voiceLanguage === 'English' || raw.voiceLanguage === 'Hindi') {
    result.voiceLanguage = raw.voiceLanguage;
  } else if (raw.voiceLanguage === 'hi-IN') {
    result.voiceLanguage = 'Hindi';
  } else if (raw.voiceLanguage === 'en-IN') {
    result.voiceLanguage = 'English';
  }

  // Interaction Mode
  if (raw.interactionMode === 'Quick' || raw.interactionMode === 'Assisted' || raw.interactionMode === 'Detailed') {
    result.interactionMode = raw.interactionMode;
  } else if (raw.interactionMode === 'simplified') {
    result.interactionMode = 'Quick';
  } else if (raw.interactionMode === 'standard') {
    result.interactionMode = 'Assisted';
  } else if (raw.interactionMode === 'data_rich') {
    result.interactionMode = 'Detailed';
  }

  // AI response style
  if (raw.aiResponseStyle === 'Simple' || raw.aiResponseStyle === 'Balanced' || raw.aiResponseStyle === 'Detailed') {
    result.aiResponseStyle = raw.aiResponseStyle;
  }

  // Recommendation mode
  if (
    raw.recommendationMode === 'All recommendations' ||
    raw.recommendationMode === 'Important situations' ||
    raw.recommendationMode === 'Only when requested'
  ) {
    result.recommendationMode = raw.recommendationMode;
  }

  // Theme
  if (raw.theme === 'Light' || raw.theme === 'Dark' || raw.theme === 'System') {
    result.theme = raw.theme;
  }

  // Text size
  if (raw.textSize === 'Standard' || raw.textSize === 'Large' || raw.textSize === 'Extra large') {
    result.textSize = raw.textSize;
  } else if (raw.displayScale === 'large') {
    result.textSize = 'Large';
  } else if (raw.displayScale === 'extra_large') {
    result.textSize = 'Extra large';
  }

  // High contrast
  if (typeof raw.highContrast === 'boolean') {
    result.highContrast = raw.highContrast;
  } else if (typeof raw.highContrastMode === 'boolean') {
    result.highContrast = raw.highContrastMode;
  }

  // Read aloud
  if (typeof raw.readAloud === 'boolean') {
    result.readAloud = raw.readAloud;
  }

  // Reduce motion
  if (typeof raw.reduceMotion === 'boolean') {
    result.reduceMotion = raw.reduceMotion;
  }

  // Interaction preference
  if (raw.interactionPreference === 'Touch' || raw.interactionPreference === 'Voice' || raw.interactionPreference === 'Balanced') {
    result.interactionPreference = raw.interactionPreference;
  }

  // Notifications
  if (raw.notificationPreferences && typeof raw.notificationPreferences === 'object') {
    result.notificationPreferences = {
      importantAlerts: Array.isArray(raw.notificationPreferences.importantAlerts)
        ? raw.notificationPreferences.importantAlerts
        : INITIAL_PREFERENCES.notificationPreferences.importantAlerts,
      reminders: Array.isArray(raw.notificationPreferences.reminders)
        ? raw.notificationPreferences.reminders
        : INITIAL_PREFERENCES.notificationPreferences.reminders,
    };
  }

  // Quiet hours
  if (raw.quietHours && typeof raw.quietHours === 'object') {
    result.quietHours = {
      start: typeof raw.quietHours.start === 'string' ? raw.quietHours.start : '21:00',
      end: typeof raw.quietHours.end === 'string' ? raw.quietHours.end : '06:00',
    };
  }

  return result;
}
