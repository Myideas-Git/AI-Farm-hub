import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Sliders,
  Check,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  Save,
  CheckCircle2,
  Moon,
  Laptop,
  Bell,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import {
  FarmerProfile,
  FarmerPreferences,
  AppLanguage,
  VoiceInputLanguage,
  InteractionMode,
  AiResponseStyle,
  RecommendationMode,
  AppTheme,
  TextSize,
  InteractionPreference,
  INITIAL_PROFILE,
  INITIAL_PREFERENCES,
  migratePreferences,
} from '../../types/profile';
import { TRANSLATIONS } from '../../i18n/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  preferences: FarmerPreferences;
  onSaveProfile: (profile: FarmerProfile) => void;
  onSavePreferences: (preferences: FarmerPreferences) => void;
}

const OBJECTIVE_OPTIONS = [
  'Improve farming profitability',
  'Reduce input costs',
  'Improve crop yield',
  'Save water',
  'Maintain accurate farm records',
];

const ALERT_OPTIONS = [
  'Severe weather',
  'Crop health',
  'Important farm alerts',
  'Payment',
  'Harvest',
];

const REMINDER_OPTIONS = [
  'Irrigation',
  'Planned activities',
  'Market updates',
  'Record reminders',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  preferences,
  onSaveProfile,
  onSavePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('preferences');

  // Draft state with robust defaults and migration
  const [draftProfile, setDraftProfile] = useState<FarmerProfile>(() => ({
    ...INITIAL_PROFILE,
    ...profile,
    primaryObjectives: Array.isArray(profile?.primaryObjectives)
      ? profile.primaryObjectives
      : INITIAL_PROFILE.primaryObjectives,
  }));
  const [draftPreferences, setDraftPreferences] = useState<FarmerPreferences>(() =>
    migratePreferences(preferences)
  );
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync draft states when modal opens or incoming props update
  useEffect(() => {
    if (isOpen) {
      setDraftProfile({
        ...INITIAL_PROFILE,
        ...profile,
        primaryObjectives: Array.isArray(profile?.primaryObjectives)
          ? profile.primaryObjectives
          : INITIAL_PROFILE.primaryObjectives,
      });
      setDraftPreferences(migratePreferences(preferences));
    }
  }, [isOpen, profile, preferences]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[draftPreferences?.appLanguage] || TRANSLATIONS.Telugu;

  const handleObjectiveToggle = (obj: string) => {
    setDraftProfile((prev) => {
      const currentList = Array.isArray(prev?.primaryObjectives)
        ? prev.primaryObjectives
        : INITIAL_PROFILE.primaryObjectives;
      const exists = currentList.includes(obj);
      return {
        ...prev,
        primaryObjectives: exists
          ? currentList.filter((o) => o !== obj)
          : [...currentList, obj],
      };
    });
  };

  const handleAlertToggle = (alert: string) => {
    setDraftPreferences((prev) => {
      const currentAlerts =
        prev?.notificationPreferences?.importantAlerts ??
        INITIAL_PREFERENCES.notificationPreferences.importantAlerts;
      const exists = currentAlerts.includes(alert);
      return {
        ...prev,
        notificationPreferences: {
          ...INITIAL_PREFERENCES.notificationPreferences,
          ...prev?.notificationPreferences,
          importantAlerts: exists
            ? currentAlerts.filter((a) => a !== alert)
            : [...currentAlerts, alert],
        },
      };
    });
  };

  const handleReminderToggle = (reminder: string) => {
    setDraftPreferences((prev) => {
      const currentReminders =
        prev?.notificationPreferences?.reminders ??
        INITIAL_PREFERENCES.notificationPreferences.reminders;
      const exists = currentReminders.includes(reminder);
      return {
        ...prev,
        notificationPreferences: {
          ...INITIAL_PREFERENCES.notificationPreferences,
          ...prev?.notificationPreferences,
          reminders: exists
            ? currentReminders.filter((r) => r !== reminder)
            : [...currentReminders, reminder],
        },
      };
    });
  };

  const handleSave = () => {
    onSaveProfile(draftProfile);
    onSavePreferences(draftPreferences);
    setSaveSuccessMsg(
      draftPreferences.appLanguage === 'Telugu'
        ? 'ప్రొఫైల్ మరియు ప్రాధాన్యతలు విజయవంతంగా భద్రపరచబడ్డాయి!'
        : 'Profile and preferences successfully saved and applied!'
    );
    setTimeout(() => {
      setSaveSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Profile and Preferences"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {draftProfile.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {draftProfile.preferredName || draftProfile.fullName}
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold">
                  {t.phaseBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {draftProfile.role} · {draftProfile.village}, {draftProfile.district}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Profile vs Preferences */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'preferences'
                ? 'border-emerald-800 text-emerald-900 dark:text-emerald-400 dark:border-emerald-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.preferencesModal.preferencesTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'profile'
                ? 'border-emerald-800 text-emerald-900 dark:text-emerald-400 dark:border-emerald-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.preferencesModal.profileTab}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: APPLICATION PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* App Language & Voice Language (Independent) */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Language Settings (Independent)
                  </span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                    Telugu Default
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* App Language */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.preferencesModal.appLanguageLabel} *
                    </label>
                    <select
                      value={draftPreferences.appLanguage}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          appLanguage: e.target.value as AppLanguage,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                    </select>
                  </div>

                  {/* Voice Language (Independent!) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.preferencesModal.voiceLanguageLabel} *
                    </label>
                    <select
                      value={draftPreferences.voiceLanguage}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          voiceLanguage: e.target.value as VoiceInputLanguage,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  {t.preferencesModal.translationNote}
                </p>
              </div>

              {/* Interaction Mode & AI Response Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Interaction mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.preferencesModal.interactionModeLabel}
                  </label>
                  <select
                    value={draftPreferences.interactionMode}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        interactionMode: e.target.value as InteractionMode,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  >
                    <option value="Quick">Quick (Default — 1-tap rapid actions)</option>
                    <option value="Assisted">Assisted (Step-by-step guidance)</option>
                    <option value="Detailed">Detailed (Full forms and metadata)</option>
                  </select>
                </div>

                {/* AI Response Style */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.preferencesModal.aiResponseStyleLabel}
                  </label>
                  <select
                    value={draftPreferences.aiResponseStyle}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        aiResponseStyle: e.target.value as AiResponseStyle,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  >
                    <option value="Simple">Simple (Clear, direct summaries)</option>
                    <option value="Balanced">Balanced (Standard context)</option>
                    <option value="Detailed">Detailed (Comprehensive agronomic rationale)</option>
                  </select>
                </div>
              </div>

              {/* Theme, Text Size, Contrast */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Display, Text Size & Contrast
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Theme */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.preferencesModal.themeLabel}
                    </label>
                    <select
                      value={draftPreferences.theme}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          theme: e.target.value as AppTheme,
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                    >
                      <option value="System">System (Auto)</option>
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>

                  {/* Text Size */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.preferencesModal.textSizeLabel}
                    </label>
                    <select
                      value={draftPreferences.textSize}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          textSize: e.target.value as TextSize,
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Large">Large (Default for outdoor)</option>
                      <option value="Extra large">Extra large</option>
                    </select>
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.preferencesModal.contrastLabel}
                    </label>
                    <select
                      value={draftPreferences.highContrast ? 'High contrast' : 'Standard'}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          highContrast: e.target.value === 'High contrast',
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                    >
                      <option value="Standard">Standard</option>
                      <option value="High contrast">High contrast (Sunlight)</option>
                    </select>
                  </div>
                </div>

                {/* Read Aloud & Reduce Motion toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {t.preferencesModal.readAloudLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftPreferences({
                          ...draftPreferences,
                          readAloud: !draftPreferences.readAloud,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-hidden ${
                        draftPreferences.readAloud ? 'bg-emerald-800' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={draftPreferences.readAloud}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          draftPreferences.readAloud ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {t.preferencesModal.reduceMotionLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftPreferences({
                          ...draftPreferences,
                          reduceMotion: !draftPreferences.reduceMotion,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-hidden ${
                        draftPreferences.reduceMotion ? 'bg-emerald-800' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={draftPreferences.reduceMotion}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          draftPreferences.reduceMotion ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendation Mode & Interaction Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.preferencesModal.recommendationModeLabel}
                  </label>
                  <select
                    value={draftPreferences.recommendationMode}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        recommendationMode: e.target.value as RecommendationMode,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  >
                    <option value="Important situations">Important situations only (Default)</option>
                    <option value="All recommendations">All recommendations</option>
                    <option value="Only when requested">Only when requested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.preferencesModal.interactionPrefLabel}
                  </label>
                  <select
                    value={draftPreferences.interactionPreference}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        interactionPreference: e.target.value as InteractionPreference,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  >
                    <option value="Balanced">Balanced (Default)</option>
                    <option value="Touch">Touch first</option>
                    <option value="Voice">Voice first</option>
                  </select>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.preferencesModal.quietHoursLabel}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    No audible notifications will sound during this time.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="time"
                    value={draftPreferences.quietHours?.start ?? '21:00'}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        quietHours: {
                          start: e.target.value,
                          end: draftPreferences.quietHours?.end ?? '06:00',
                        },
                      })
                    }
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={draftPreferences.quietHours?.end ?? '06:00'}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        quietHours: {
                          start: draftPreferences.quietHours?.start ?? '21:00',
                          end: e.target.value,
                        },
                      })
                    }
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                </div>
              </div>

              {/* Enabled Alert & Reminder Categories */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Alert & Reminder Subscriptions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Important Alerts:
                    </span>
                    {ALERT_OPTIONS.map((alert) => (
                      <label key={alert} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(draftPreferences.notificationPreferences?.importantAlerts ?? []).includes(alert)}
                          onChange={() => handleAlertToggle(alert)}
                          className="rounded text-emerald-800 focus:ring-emerald-700"
                        />
                        <span>{alert}</span>
                      </label>
                    ))}
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Activity Reminders:
                    </span>
                    {REMINDER_OPTIONS.map((reminder) => (
                      <label key={reminder} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(draftPreferences.notificationPreferences?.reminders ?? []).includes(reminder)}
                          onChange={() => handleReminderToggle(reminder)}
                          className="rounded text-emerald-800 focus:ring-emerald-700"
                        />
                        <span>{reminder}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FARMER PROFILE ("Who am I?") */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Demo Farmer Notice:</strong> These are demo values (Ravi Kumar / Ravi garu, Rasapūdipalem). Phone number, GPS coordinates, and soil tests remain unrecorded. We never invent missing data.
              </div>

              {/* Name & Preferred Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={draftProfile.fullName}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        fullName: e.target.value,
                        avatarInitials:
                          e.target.value
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || 'RK',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[42px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Preferred Name / Address Greeting *
                  </label>
                  <input
                    type="text"
                    value={draftProfile.preferredName}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        preferredName: e.target.value,
                      })
                    }
                    placeholder="e.g. Ravi garu"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[42px]"
                    required
                  />
                </div>
              </div>

              {/* Role, Experience & Digital Comfort */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={draftProfile.role}
                    onChange={(e) => setDraftProfile({ ...draftProfile, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={draftProfile.experienceYears}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        experienceYears: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Digital Comfort
                  </label>
                  <select
                    value={draftProfile.digitalComfort}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        digitalComfort: e.target.value as 'Basic' | 'Intermediate' | 'Advanced',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 min-h-[40px]"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate (Default)</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={draftProfile.village}
                    onChange={(e) => setDraftProfile({ ...draftProfile, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={draftProfile.district}
                    onChange={(e) => setDraftProfile({ ...draftProfile, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={draftProfile.state}
                    onChange={(e) => setDraftProfile({ ...draftProfile, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={draftProfile.country}
                    onChange={(e) => setDraftProfile({ ...draftProfile, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[40px]"
                  />
                </div>
              </div>

              {/* Primary Objectives */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Primary Objectives (Ravi Kumar)
                </label>
                <div className="space-y-2">
                  {OBJECTIVE_OPTIONS.map((obj) => {
                    const isChecked = (draftProfile.primaryObjectives || []).includes(obj);
                    return (
                      <div
                        key={obj}
                        onClick={() => handleObjectiveToggle(obj)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 ${
                          isChecked
                            ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-emerald-800 border-emerald-800 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{obj}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors min-h-[40px]"
          >
            {t.actions.cancel}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{t.preferencesModal.saveAndApply}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
