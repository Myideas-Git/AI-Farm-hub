import React, { useState } from 'react';
import {
  X,
  User,
  Sliders,
  Check,
  Sun,
  Eye,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  Shield,
  Save,
  CheckCircle2,
  Languages,
  Scale,
  Bell,
  Compass,
} from 'lucide-react';
import {
  FarmerProfile,
  FarmerPreferences,
  FarmerRole,
  FarmerObjective,
  InteractionMode,
  AiResponseStyle,
  RecommendationBehavior,
  DisplayScale,
  LandUnit,
  WeightUnit,
} from '../../types/profile';
import { ROLE_LABELS, OBJECTIVE_LABELS } from '../../data/mockProfileData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  preferences: FarmerPreferences;
  onSaveProfile: (profile: FarmerProfile) => void;
  onSavePreferences: (preferences: FarmerPreferences) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  preferences,
  onSaveProfile,
  onSavePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  // Local draft state
  const [draftProfile, setDraftProfile] = useState<FarmerProfile>(profile);
  const [draftPreferences, setDraftPreferences] = useState<FarmerPreferences>(preferences);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleObjectiveToggle = (obj: FarmerObjective) => {
    setDraftProfile((prev) => {
      const exists = prev.primaryObjectives.includes(obj);
      if (exists) {
        return {
          ...prev,
          primaryObjectives: prev.primaryObjectives.filter((o) => o !== obj),
        };
      } else {
        return {
          ...prev,
          primaryObjectives: [...prev.primaryObjectives, obj],
        };
      }
    });
  };

  const handleSave = () => {
    onSaveProfile(draftProfile);
    onSavePreferences(draftPreferences);
    setSaveSuccessMsg('Personalization settings saved and applied!');
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
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {draftProfile.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {draftProfile.fullName}
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  PHASE 0.5
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Personal identity & application interaction preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Profile vs Preferences */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'profile'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Farmer Profile ("Who am I?")</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'preferences'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>App Behavior ("How it behaves")</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: FARMER PROFILE ("Who am I?") */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-xs text-slate-600 leading-relaxed">
                <strong>Architectural Principle:</strong> Your profile defines your farming background, identity, and strategic objectives. It is strictly separated from your farm plots and soil measurements.
              </div>

              {/* Name & Preferred Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Full Legal / Official Name *
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
                            .toUpperCase() || 'FP',
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[42px]"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Used for official mandi receipts and records.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Preferred Greeting / How We Address You *
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
                    placeholder="e.g. Ramesh-ji, Patel Sahab"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[42px]"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Used in daily greetings: "Namaste, {draftProfile.preferredName || draftProfile.fullName}"
                  </span>
                </div>
              </div>

              {/* Role & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Farming Role *
                  </label>
                  <select
                    value={draftProfile.role}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        role: e.target.value as FarmerRole,
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[42px]"
                  >
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Farming Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    value={draftProfile.experienceYears}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        experienceYears: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 min-h-[42px]"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Helps calibrate advice level without underestimating your wisdom.
                  </span>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    value={draftProfile.village}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        village: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={draftProfile.district}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        district: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={draftProfile.state}
                    onChange={(e) =>
                      setDraftProfile({
                        ...draftProfile,
                        state: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  />
                </div>
              </div>

              {/* Primary Farming Objectives */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Primary Farming Objectives (Select all that apply)
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  These priorities shape which observations and insights are highlighted for you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    Object.entries(OBJECTIVE_LABELS) as [
                      FarmerObjective,
                      string
                    ][]
                  ).map(([key, label]) => {
                    const isChecked = draftProfile.primaryObjectives.includes(key);
                    return (
                      <div
                        key={key}
                        onClick={() => handleObjectiveToggle(key)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors flex items-start gap-2.5 min-h-[44px] ${
                          isChecked
                            ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/40'
                        }`}
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            handleObjectiveToggle(key);
                          }
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-emerald-800 border-emerald-800 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATION PREFERENCES ("How should the app behave for me?") */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Interaction Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Interaction Ergonomics Mode *
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Choose how much complexity and digital density you prefer in your daily workflow.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mode: Simplified */}
                  <div
                    onClick={() =>
                      setDraftPreferences({
                        ...draftPreferences,
                        interactionMode: 'simplified',
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                      draftPreferences.interactionMode === 'simplified'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        Simplified
                      </span>
                      {draftPreferences.interactionMode === 'simplified' && (
                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Large buttons, voice/camera emphasis, minimal forms, audio hints. For high outdoor friction.
                    </p>
                  </div>

                  {/* Mode: Standard */}
                  <div
                    onClick={() =>
                      setDraftPreferences({
                        ...draftPreferences,
                        interactionMode: 'standard',
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                      draftPreferences.interactionMode === 'standard'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        Balanced (Standard)
                      </span>
                      {draftPreferences.interactionMode === 'standard' && (
                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Practical balance of quick actions, field summaries, and straightforward logging.
                    </p>
                  </div>

                  {/* Mode: Data-Rich */}
                  <div
                    onClick={() =>
                      setDraftPreferences({
                        ...draftPreferences,
                        interactionMode: 'data_rich',
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                      draftPreferences.interactionMode === 'data_rich'
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        Data-Rich
                      </span>
                      {draftPreferences.interactionMode === 'data_rich' && (
                        <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Detailed tabular breakdowns, audit history, deeper telemetry and numerical charts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Scale & High Contrast Outdoor Mode */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Outdoor Readability & Accessibility
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Designed specifically for direct sunlight and one-handed farm use.
                    </p>
                  </div>
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Display Scale */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Text & Control Scale
                    </label>
                    <select
                      value={draftPreferences.displayScale}
                      onChange={(e) =>
                        setDraftPreferences({
                          ...draftPreferences,
                          displayScale: e.target.value as DisplayScale,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                    >
                      <option value="standard">Standard Scale (100%)</option>
                      <option value="large">Large / Sunlight Readability (115%)</option>
                      <option value="extra_large">Extra Large / Senior (130%)</option>
                    </select>
                  </div>

                  {/* High Contrast Mode Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        High-Contrast Sunlight Mode
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Deepens contrasts for harsh field glare
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftPreferences({
                          ...draftPreferences,
                          highContrastMode: !draftPreferences.highContrastMode,
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-hidden ${
                        draftPreferences.highContrastMode
                          ? 'bg-slate-900'
                          : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={draftPreferences.highContrastMode}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          draftPreferences.highContrastMode
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Audio Feedback Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    {draftPreferences.audioFeedback ? (
                      <Volume2 className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Audio Confirmation & Tap Cues
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Chime feedback when completing field logging
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftPreferences({
                        ...draftPreferences,
                        audioFeedback: !draftPreferences.audioFeedback,
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-hidden ${
                      draftPreferences.audioFeedback
                        ? 'bg-emerald-800'
                        : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={draftPreferences.audioFeedback}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        draftPreferences.audioFeedback
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Language & Voice Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Interface Language
                  </label>
                  <select
                    value={draftPreferences.language}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        language: e.target.value as 'en' | 'hi' | 'hinglish',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="en">English (Default)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="hinglish">Hinglish (Hindi in Latin Script)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Voice Input / Dictation Language
                  </label>
                  <select
                    value={draftPreferences.voiceLanguage}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        voiceLanguage: e.target.value as 'hi-IN' | 'en-IN',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="hi-IN">हिन्दी - India (hi-IN)</option>
                    <option value="en-IN">Indian English (en-IN)</option>
                  </select>
                </div>
              </div>

              {/* Agricultural Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Preferred Land Area Unit
                  </label>
                  <select
                    value={draftPreferences.unitLand}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        unitLand: e.target.value as LandUnit,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="acres">Acres (Standard)</option>
                    <option value="bigha">Bigha (Central India / MP)</option>
                    <option value="hectares">Hectares</option>
                    <option value="guntha">Guntha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Preferred Crop Yield / Weight Unit
                  </label>
                  <select
                    value={draftPreferences.unitWeight}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        unitWeight: e.target.value as WeightUnit,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="quintals">Quintals (100 kg)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="bags">Standard 50kg Bags</option>
                    <option value="tons">Metric Tons</option>
                  </select>
                </div>
              </div>

              {/* AI Response Style & Advisory Behavior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Advisory Response Style
                  </label>
                  <select
                    value={draftPreferences.aiResponseStyle}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        aiResponseStyle: e.target.value as AiResponseStyle,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="concise">Concise & Direct (Only actionable points)</option>
                    <option value="explanatory">Guided & Explanatory (Explain reasoning)</option>
                    <option value="conversational">Conversational (Ask clarifying questions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Decision Strategy Calibrator
                  </label>
                  <select
                    value={draftPreferences.recommendationBehavior}
                    onChange={(e) =>
                      setDraftPreferences({
                        ...draftPreferences,
                        recommendationBehavior: e.target.value as RecommendationBehavior,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 min-h-[40px]"
                  >
                    <option value="conservative">Conservative (Low input risk & capital preservation)</option>
                    <option value="balanced">Balanced (Optimal market return)</option>
                    <option value="progressive">Progressive (Targeting maximum top-end yield)</option>
                    <option value="soil_first">Soil-First (Regenerative & biological health)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors min-h-[40px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Personalization</span>
          </button>
        </div>
      </div>
    </div>
  );
};
