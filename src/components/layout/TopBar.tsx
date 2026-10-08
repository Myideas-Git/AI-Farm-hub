import React from 'react';
import { Plus } from 'lucide-react';
import { SyncState } from '../../types/farm';
import { FarmerProfile } from '../../types/profile';
import { OfflineStatusIndicator } from '../common/OfflineStatusIndicator';

export type NavTab = 'home' | 'my-farm' | 'record' | 'insights' | 'market';

interface TopBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  syncState: SyncState;
  onSyncStateChange: (state: SyncState) => void;
  onQuickRecordClick: () => void;
  profile: FarmerProfile;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  syncState,
  onSyncStateChange,
  onQuickRecordClick,
  profile,
  onOpenProfile,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'my-farm', label: 'My Farm' },
    { id: 'record', label: 'Record' },
    { id: 'insights', label: 'Insights' },
    { id: 'market', label: 'Market' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title (single text element wordmark) */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="text-left group flex items-center gap-2 focus:outline-hidden"
        >
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
            Farm Intelligence
          </span>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 tracking-wider">
            PHASE 0.5
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
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Sync Status + Profile Avatar Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <OfflineStatusIndicator
            currentSyncState={syncState}
            onStateChange={onSyncStateChange}
          />
          <button
            type="button"
            onClick={onQuickRecordClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors whitespace-nowrap min-h-[36px] sm:min-h-[40px] shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Record Activity</span>
            <span className="sm:hidden">Record</span>
          </button>

          {/* Profile Trigger */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors min-h-[36px] sm:min-h-[40px]"
            title="Farmer Profile & Personalization Settings"
            aria-label="Open Farmer Profile and Preferences"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {profile.avatarInitials}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-800 whitespace-nowrap">
              {profile.preferredName || profile.fullName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
