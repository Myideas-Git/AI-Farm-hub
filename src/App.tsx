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
import { FarmerProfile, FarmerPreferences } from './types/profile';
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
import {
  SlidersHorizontal,
  RefreshCw,
  Sun,
  UserCheck,
  Check,
} from 'lucide-react';

const STORAGE_KEY_PROFILE = 'farm_intel_farmer_profile';
const STORAGE_KEY_PREFS = 'farm_intel_farmer_preferences';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [syncState, setSyncState] = useState<SyncState>('online');
  const [events, setEvents] = useState<FarmEvent[]>(INITIAL_DEMO_EVENTS);
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Persistent Profile & Preferences State
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_FARMER_PROFILE;
    } catch {
      return INITIAL_FARMER_PROFILE;
    }
  });

  const [preferences, setPreferences] = useState<FarmerPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      return saved ? JSON.parse(saved) : INITIAL_FARMER_PREFERENCES;
    } catch {
      return INITIAL_FARMER_PREFERENCES;
    }
  });

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

  const handleAddEvent = (newEvent: FarmEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    // If in offline mode, automatically transition to pending_sync to show visual offline sync queue!
    if (syncState === 'offline') {
      setSyncState('pending_sync');
    }
  };

  const handleResetData = () => {
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
  };

  // Determine root scale class based on preferences
  const scaleClass =
    preferences.displayScale === 'extra_large'
      ? 'text-[17px]'
      : preferences.displayScale === 'large'
      ? 'text-[15px]'
      : 'text-[14px]';

  // High contrast outdoor sunlight styling
  const highContrastClass = preferences.highContrastMode
    ? 'border-black text-black bg-white ring-1 ring-black/40'
    : '';

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 ${scaleClass} ${
        preferences.highContrastMode ? 'grayscale-25 contrast-115' : ''
      }`}
    >
      {/* Top Bar Navigation with Zone 3 Profile Avatar Trigger */}
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
      />

      {/* Offline Status Warning Banner if in Offline or Pending Sync mode */}
      {syncState === 'offline' && (
        <div className="bg-amber-100 text-amber-950 px-4 py-2 text-xs text-center border-b border-amber-200 font-medium">
          Offline Mode Active — Working locally without internet connection. Any newly logged records will be cached safely on device.
        </div>
      )}
      {syncState === 'pending_sync' && (
        <div className="bg-sky-100 text-sky-950 px-4 py-2 text-xs text-center border-b border-sky-200 font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-700" />
          <span>Local Changes Pending Sync — 1 record saved locally. Tap network indicator to simulate sync completion.</span>
        </div>
      )}

      {/* High Contrast Sunlight Mode notification banner */}
      {preferences.highContrastMode && (
        <div className="bg-slate-900 text-white px-4 py-1.5 text-xs text-center font-bold flex items-center justify-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>High-Contrast Sunlight Mode Active (Optimized for Outdoor Glare)</span>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {/* QA State Inspector Bar Toggle (for testing empty states, error recovery & personalization) */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 bg-white/70 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-700">Phase 0.5 Profile & Personalization</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-600">
              {profile.preferredName || profile.fullName} ({preferences.interactionMode} mode)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-emerald-800" />
              <span>Edit Profile & Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQaBar(!showQaBar)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              title="Toggle QA View State Simulator"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{showQaBar ? 'Hide QA Bar' : 'QA Simulator'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible QA Testing Toolbar */}
        {showQaBar && (
          <div className="mb-6 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-3 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Phase 0.5 Personalization & Edge State Simulator
              </span>
              <button
                type="button"
                onClick={handleResetData}
                className="text-[11px] text-slate-300 hover:text-white underline"
              >
                Reset All To Initial Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Edge Views */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  View States (Req #14, #15):
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
                    Empty State (Req #14)
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
                    Error State (Req #15)
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
                        highContrastMode: !preferences.highContrastMode,
                      })
                    }
                    className={`px-2.5 py-1 rounded font-medium ${
                      preferences.highContrastMode
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Sunlight Contrast: {preferences.highContrastMode ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSavePreferences({
                        ...preferences,
                        interactionMode:
                          preferences.interactionMode === 'simplified'
                            ? 'standard'
                            : 'simplified',
                      })
                    }
                    className={`px-2.5 py-1 rounded font-medium ${
                      preferences.interactionMode === 'simplified'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Mode: {preferences.interactionMode}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSavePreferences({
                        ...preferences,
                        unitLand:
                          preferences.unitLand === 'bigha' ? 'acres' : 'bigha',
                      })
                    }
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Unit: {preferences.unitLand}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render View based on QA simulator or active tab */}
        {qaViewMode === 'empty' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <EmptyState
              title="Your farm memory starts here"
              description="No crop cycles or farm events have been recorded yet. Log your first field activity or register a plot to begin your farm journey."
              actionLabel="Record First Farm Activity"
              onAction={() => {
                setQaViewMode('standard');
                setIsQuickRecordOpen(true);
              }}
            />
          </div>
        ) : qaViewMode === 'error' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <ErrorState
              title="Field synchronization temporary failure"
              message="Something went wrong while communicating with remote servers. Your saved information is safe on local device memory."
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
              />
            )}

            {activeTab === 'record' && (
              <RecordScreen
                plots={DEMO_PLOTS}
                cropCycles={DEMO_CROP_CYCLES}
                events={events}
                preferences={preferences}
                onAddEvent={handleAddEvent}
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
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation (Visible on screen < md) */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Global Quick Record Modal */}
      <QuickRecordModal
        isOpen={isQuickRecordOpen}
        onClose={() => setIsQuickRecordOpen(false)}
        plots={DEMO_PLOTS}
        cropCycles={DEMO_CROP_CYCLES}
        onAddEvent={handleAddEvent}
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
    </div>
  );
}
