import React from 'react';
import { Plus } from 'lucide-react';
import { SyncState } from '../../types/farm';
import { FarmerProfile, AppLanguage } from '../../types/profile';
import { OfflineStatusIndicator } from '../common/OfflineStatusIndicator';
import { getTranslations } from '../../i18n/translations';

export type NavTab = 'home' | 'my-farm' | 'record' | 'insights' | 'market';

interface TopBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  syncState: SyncState;
  onSyncStateChange: (state: SyncState) => void;
  onQuickRecordClick: () => void;
  profile: FarmerProfile;
  onOpenProfile: () => void;
  language?: AppLanguage;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  syncState,
  onSyncStateChange,
  onQuickRecordClick,
  profile,
  onOpenProfile,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'my-farm', label: t.nav.myFarm },
    { id: 'record', label: t.nav.record },
    { id: 'insights', label: t.nav.insights },
    { id: 'market', label: t.nav.market },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="text-left group flex items-center gap-2 focus:outline-hidden"
        >
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
            {t.appName}
          </span>
          <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 tracking-wider">
            {t.phaseBadge}
          </span>
        </button>

        {/* Zone 2: 5 clean navigation links */}
        <nav
          className="hidden md:flex items-center gap-1 sm:gap-2"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors min-h-[40px] ${
                  isActive
                    ? 'text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Honest Sync Status + Profile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <OfflineStatusIndicator
            currentSyncState={syncState}
            onStateChange={onSyncStateChange}
            language={language}
          />

          <button
            type="button"
            onClick={onQuickRecordClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors shadow-xs min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actions.record}</span>
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-hidden min-h-[36px]"
            title={`${profile.preferredName || profile.fullName} — Settings`}
            aria-label="Profile and Settings"
          >
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden lg:inline-block max-w-[120px] truncate">
              {profile.preferredName || profile.fullName}
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {profile.avatarInitials || 'RK'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
