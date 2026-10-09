import React, { useState, useEffect } from 'react';
import {
  DEMO_FARMER,
  DEMO_FARM,
  DEMO_PLOTS,
  DEMO_CROP_CYCLES,
  INITIAL_DEMO_EVENTS,
  DEMO_SAMPLE_INSIGHT,
  DEMO_MARKET_BENCHMARKS,
} from './data/mockFarmData';
import {
  INITIAL_FARMER_PROFILE,
  INITIAL_FARMER_PREFERENCES,
} from './data/mockProfileData';
import { FarmEvent, SyncState } from './types/farm';
import { FarmerProfile, FarmerPreferences, migratePreferences } from './types/profile';
import { TopBar, NavTab } from './components/layout/TopBar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { MyFarmScreen } from './components/screens/MyFarmScreen';
import { RecordScreen } from './components/screens/RecordScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { MarketScreen } from './components/screens/MarketScreen';
import { QuickRecordModal } from './components/common/QuickRecordModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { ActivityStorageService, StorageResult } from './services/activityStorage';
import { getTranslations } from './i18n/translations';
import {
  SlidersHorizontal,
  RefreshCw,
  Sun,
  UserCheck,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY_PROFILE = 'farm_intel_farmer_profile';
const STORAGE_KEY_PREFS = 'farm_intel_farmer_preferences';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [syncState, setSyncState] = useState<SyncState>('online');

  // Load activities durably with error isolation
  const [events, setEvents] = useState<FarmEvent[]>(() => {
    const res = ActivityStorageService.loadAllRecords();
    return res.data;
  });
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [resetModalType, setResetModalType] = useState<'records_only' | 'all_defaults' | null>(null);

  // Persistent Profile & Preferences State
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_FARMER_PROFILE,
          ...parsed,
          primaryObjectives: Array.isArray(parsed?.primaryObjectives)
            ? parsed.primaryObjectives
            : INITIAL_FARMER_PROFILE.primaryObjectives,
        };
      }
      return INITIAL_FARMER_PROFILE;
    } catch {
      return INITIAL_FARMER_PROFILE;
    }
  });

  const [preferences, setPreferences] = useState<FarmerPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      return saved ? migratePreferences(JSON.parse(saved)) : INITIAL_FARMER_PREFERENCES;
    } catch {
      return INITIAL_FARMER_PREFERENCES;
    }
  });

  const t = getTranslations(preferences.appLanguage);

  // Synchronize document HTML lang metadata with active language
  useEffect(() => {
    const langCode =
      preferences.appLanguage === 'Telugu'
        ? 'te'
        : preferences.appLanguage === 'Hindi'
        ? 'hi'
        : 'en';
    document.documentElement.lang = langCode;
  }, [preferences.appLanguage]);

  // Check storage health on mount
  useEffect(() => {
    const res = ActivityStorageService.loadAllRecords();
    if (!res.success && res.isCorrupt) {
      setStorageNotice(
        res.error ||
          'Notice: An unreadable storage entry was quarantined to protect farm records. Baseline data is preserved.'
      );
    }
  }, []);

  // QA State Testing Simulator (for reviewing empty and error states without code alteration)
  const [qaViewMode, setQaViewMode] = useState<'standard' | 'empty' | 'error'>('standard');
  const [showQaBar, setShowQaBar] = useState(false);

  const handleSaveProfile = (updatedProfile: FarmerProfile) => {
    setProfile(updatedProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn('Local storage write failed', e);
    }
  };

  const handleSavePreferences = (updatedPrefs: FarmerPreferences) => {
    setPreferences(updatedPrefs);
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updatedPrefs));
    } catch (e) {
      console.warn('Local storage write failed', e);
    }
  };

  // Durable activity handlers verifying persistence before updating state
  const handleAddEvent = (newEvent: FarmEvent): StorageResult<FarmEvent> => {
    const result = ActivityStorageService.saveRecord(newEvent, false);
    if (result.success) {
      const loadRes = ActivityStorageService.loadAllRecords();
      setEvents(loadRes.data);
      if (syncState === 'offline') {
        setSyncState('pending_sync');
      }
    }
    return result;
  };

  const handleConfirmEvent = (eventId: string) => {
    const result = ActivityStorageService.confirmRecord(
      eventId,
      profile.preferredName || profile.fullName
    );
    if (result.success) {
      const loadRes = ActivityStorageService.loadAllRecords();
      setEvents(loadRes.data);
    }
    return result;
  };

  const handleDeleteEvent = (eventId: string) => {
    const result = ActivityStorageService.deleteRecord(eventId);
    if (result.success) {
      const loadRes = ActivityStorageService.loadAllRecords();
      setEvents(loadRes.data);
    }
    return result;
  };

  const handleEditEvent = (updatedEvent: FarmEvent) => {
    const result = ActivityStorageService.updateRecord(updatedEvent.eventId, updatedEvent);
    if (result.success) {
      const loadRes = ActivityStorageService.loadAllRecords();
      setEvents(loadRes.data);
    }
    return result;
  };

  // Safe confirmed reset execution
  const executeReset = () => {
    if (resetModalType === 'records_only') {
      const res = ActivityStorageService.resetAllFarmerRecords();
      if (res.success) {
        setEvents(INITIAL_DEMO_EVENTS);
      }
    } else if (resetModalType === 'all_defaults') {
      ActivityStorageService.resetAllFarmerRecords();
      setEvents(INITIAL_DEMO_EVENTS);
      setSyncState('online');
      setQaViewMode('standard');
      setProfile(INITIAL_FARMER_PROFILE);
      setPreferences(INITIAL_FARMER_PREFERENCES);
      try {
        localStorage.removeItem(STORAGE_KEY_PROFILE);
        localStorage.removeItem(STORAGE_KEY_PREFS);
      } catch {
        // ignore
      }
    }
    setResetModalType(null);
  };

  // Determine root scale class based on preferences
  const scaleClass =
    preferences.textSize === 'Extra large'
      ? 'text-[17px]'
      : preferences.textSize === 'Large'
      ? 'text-[15px]'
      : 'text-[14px]';

  const isDarkMode =
    preferences.theme === 'Dark' ||
    (preferences.theme === 'System' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 ${scaleClass} ${
        isDarkMode ? 'dark' : ''
      } ${preferences.highContrast ? 'contrast-125 saturate-110' : ''} ${
        preferences.reduceMotion ? 'motion-reduce' : ''
      }`}
    >
      {/* Top Application Bar with Language and Sync Status */}
      <TopBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setQaViewMode('standard');
        }}
        syncState={syncState}
        onSyncStateChange={setSyncState}
        onQuickRecordClick={() => setIsQuickRecordOpen(true)}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        language={preferences.appLanguage}
      />

      {/* Storage Health Notice if unreadable cache was quarantined */}
      {storageNotice && (
        <div className="bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 px-4 py-2 text-xs text-center border-b border-amber-300 dark:border-amber-800 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
          <span>{storageNotice}</span>
          <button
            type="button"
            onClick={() => setStorageNotice(null)}
            className="underline ml-2 text-[11px] font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Offline Status Warning Banner if in Offline or Pending Sync mode */}
      {syncState === 'offline' && (
        <div className="bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 px-4 py-2 text-xs text-center border-b border-amber-200 dark:border-amber-800 font-medium">
          Offline Mode Active (Local Memory Only) — Working locally without internet connection. Any newly logged records are preserved in browser memory.
        </div>
      )}
      {syncState === 'pending_sync' && (
        <div className="bg-sky-100 dark:bg-sky-950 text-sky-950 dark:text-sky-200 px-4 py-2 text-xs text-center border-b border-sky-200 dark:border-sky-800 font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-700 dark:text-sky-400" />
          <span>Local Changes Pending Sync — 1 record saved in browser memory. Tap network indicator to simulate sync state.</span>
        </div>
      )}

      {/* High Contrast Sunlight Mode notification banner */}
      {preferences.highContrast && (
        <div className="bg-slate-900 text-white px-4 py-1.5 text-xs text-center font-bold flex items-center justify-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>High-Contrast Sunlight Mode Active (Optimized for Outdoor Glare)</span>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {/* QA State Inspector Bar Toggle (for testing empty states, error recovery & personalization) */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Phase 0.5 Profile & Personalization</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-400">
              {profile.preferredName || profile.fullName} ({preferences.interactionMode} mode)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-semibold border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-emerald-800 dark:text-emerald-300" />
              <span>Edit Profile & Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQaBar(!showQaBar)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              title="Open QA controls for edge state testing"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>QA Panel {showQaBar ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        {/* Expandable QA Simulator Toolbar */}
        {showQaBar && (
          <div className="mb-6 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-3 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Personalization & Edge State Simulator (QA Only)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalType('records_only')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline"
                >
                  Reset Activity Records Only
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => setResetModalType('all_defaults')}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Reset All to Defaults
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Edge Views */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  View States (Simulated):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQaViewMode('standard')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      qaViewMode === 'standard'
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Standard Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setQaViewMode('empty')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      qaViewMode === 'empty'
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Empty State
                  </button>
                  <button
                    type="button"
                    onClick={() => setQaViewMode('error')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      qaViewMode === 'error'
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Storage Error State
                  </button>
                </div>
              </div>

              {/* Instant Personalization Toggles */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Quick Preference Tests:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleSavePreferences({
                        ...preferences,
                        highContrast: !preferences.highContrast,
                      })
                    }
                    className={`px-2.5 py-1 rounded font-medium ${
                      preferences.highContrast
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Sunlight Contrast: {preferences.highContrast ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const modes: ('Quick' | 'Assisted' | 'Detailed')[] = [
                        'Quick',
                        'Assisted',
                        'Detailed',
                      ];
                      const next =
                        modes[(modes.indexOf(preferences.interactionMode) + 1) % modes.length];
                      handleSavePreferences({
                        ...preferences,
                        interactionMode: next,
                      });
                    }}
                    className="px-2.5 py-1 rounded font-medium bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                  >
                    Mode: {preferences.interactionMode}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const themes: ('System' | 'Light' | 'Dark')[] = ['System', 'Light', 'Dark'];
                      const next =
                        themes[(themes.indexOf(preferences.theme) + 1) % themes.length];
                      handleSavePreferences({
                        ...preferences,
                        theme: next,
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Theme: {preferences.theme}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const langs: ('Telugu' | 'English' | 'Hindi')[] = ['Telugu', 'English', 'Hindi'];
                      const next =
                        langs[(langs.indexOf(preferences.appLanguage) + 1) % langs.length];
                      handleSavePreferences({
                        ...preferences,
                        appLanguage: next,
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Language: {preferences.appLanguage}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render View based on QA simulator or active tab */}
        {qaViewMode === 'empty' ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <EmptyState
              title={t.common.emptyTitle}
              description={t.common.emptyDesc}
              actionLabel={t.common.emptyAction}
              onAction={() => {
                setQaViewMode('standard');
                setIsQuickRecordOpen(true);
              }}
            />
          </div>
        ) : qaViewMode === 'error' ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <ErrorState
              title={t.common.errorTitle}
              message={t.common.errorDesc}
              retryLabel={t.actions.tryAgain}
              onRetry={() => setQaViewMode('standard')}
            />
          </div>
        ) : (
          /* Standard Screens */
          <>
            {activeTab === 'home' && (
              <HomeScreen
                farmer={DEMO_FARMER}
                farm={DEMO_FARM}
                plots={DEMO_PLOTS}
                cropCycles={DEMO_CROP_CYCLES}
                events={events}
                insight={DEMO_SAMPLE_INSIGHT}
                profile={profile}
                preferences={preferences}
                onNavigate={setActiveTab}
                onQuickRecord={() => setIsQuickRecordOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {activeTab === 'my-farm' && (
              <MyFarmScreen
                farmer={DEMO_FARMER}
                farm={DEMO_FARM}
                plots={DEMO_PLOTS}
                cropCycles={DEMO_CROP_CYCLES}
                events={events}
                preferences={preferences}
                onRecordActivityClick={() => setIsQuickRecordOpen(true)}
                onConfirmEvent={handleConfirmEvent}
                onDeleteEvent={handleDeleteEvent}
                onEditEvent={handleEditEvent}
              />
            )}

            {activeTab === 'record' && (
              <RecordScreen
                plots={DEMO_PLOTS}
                cropCycles={DEMO_CROP_CYCLES}
                events={events}
                preferences={preferences}
                onAddEvent={handleAddEvent}
                onConfirmEvent={handleConfirmEvent}
                onDeleteEvent={handleDeleteEvent}
                onEditEvent={handleEditEvent}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsScreen
                insight={DEMO_SAMPLE_INSIGHT}
                events={events}
                profile={profile}
                preferences={preferences}
                onNavigateToRecord={() => setActiveTab('record')}
              />
            )}

            {activeTab === 'market' && (
              <MarketScreen
                benchmarks={DEMO_MARKET_BENCHMARKS}
                cropCycles={DEMO_CROP_CYCLES}
                plots={DEMO_PLOTS}
                language={preferences.appLanguage}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation (Visible on screen < md) */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={preferences.appLanguage}
      />

      {/* Global Quick Record Modal */}
      <QuickRecordModal
        isOpen={isQuickRecordOpen}
        onClose={() => setIsQuickRecordOpen(false)}
        plots={DEMO_PLOTS}
        cropCycles={DEMO_CROP_CYCLES}
        onAddEvent={handleAddEvent}
        language={preferences.appLanguage}
        farmerName={profile.preferredName || profile.fullName}
      />

      {/* Phase 0.5 Profile & Personalization Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        preferences={preferences}
        onSaveProfile={handleSaveProfile}
        onSavePreferences={handleSavePreferences}
      />

      {/* Safe Reset Confirmation Modal (Fix E: Explicit confirmation before destructive actions) */}
      {resetModalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3.5 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span id="reset-modal-title">{t.resetModal.title}</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.resetModal.warningText}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1 text-[11px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <p>• {t.resetModal.whatDeleted}</p>
              <p>• {t.resetModal.whatRetained}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setResetModalType(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t.resetModal.cancelText}
              </button>
              <button
                type="button"
                onClick={executeReset}
                className="px-4 py-2 rounded-lg bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors shadow-xs"
              >
                {t.resetModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
