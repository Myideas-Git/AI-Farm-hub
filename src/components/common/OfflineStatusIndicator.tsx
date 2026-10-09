import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SyncState } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

interface OfflineStatusIndicatorProps {
  currentSyncState: SyncState;
  pendingCount?: number;
  onStateChange?: (state: SyncState) => void;
  language?: AppLanguage;
}

export const OfflineStatusIndicator: React.FC<OfflineStatusIndicatorProps> = ({
  currentSyncState,
  pendingCount = 1,
  onStateChange,
  language = 'Telugu',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = getTranslations(language);

  const getStatusDisplay = () => {
    switch (currentSyncState) {
      case 'online':
        return {
          icon: Wifi,
          label: t.sync.onlineLabel,
          detail: t.sync.onlineDetail,
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'offline':
        return {
          icon: WifiOff,
          label: t.sync.offlineLabel,
          detail: t.sync.offlineDetail,
          color: 'text-amber-800 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
          dot: 'bg-amber-600',
        };
      case 'pending_sync':
        return {
          icon: RefreshCw,
          label: t.sync.pendingSyncLabel,
          detail: `${pendingCount} ${t.sync.pendingSyncDetail}`,
          color: 'text-sky-800 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-300',
          dot: 'bg-sky-600 animate-pulse',
        };
      case 'sync_completed':
        return {
          icon: CheckCircle2,
          label: t.sync.syncCompletedLabel,
          detail: t.sync.syncCompletedDetail,
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-600',
        };
    }
  };

  const current = getStatusDisplay();
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${current.color} hover:shadow-xs min-h-[36px]`}
        title={t.sync.modalTitle}
        aria-expanded={isOpen}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${current.dot}`} />
        <Icon className={`w-3.5 h-3.5 ${currentSyncState === 'pending_sync' ? 'animate-spin' : ''}`} />
        <span className="whitespace-nowrap font-medium">{current.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-1.5 w-72 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 text-xs text-slate-700 dark:text-slate-300 animate-fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{t.sync.modalTitle}</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold bg-amber-50 dark:bg-amber-950 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {t.sync.simulationBadge}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-3 leading-relaxed text-[11px]">
              {t.sync.simulationNote}
            </p>
            <div className="space-y-1">
              {(
                [
                  { state: 'online', label: `${t.sync.onlineLabel} (${t.sync.onlineDetail})` },
                  { state: 'offline', label: `${t.sync.offlineLabel} (${t.sync.offlineDetail})` },
                  { state: 'pending_sync', label: `${t.sync.pendingSyncLabel} (${t.sync.pendingSyncDetail})` },
                  { state: 'sync_completed', label: `${t.sync.syncCompletedLabel} (${t.sync.syncCompletedDetail})` },
                ] as const
              ).map((item) => (
                <button
                  key={item.state}
                  type="button"
                  onClick={() => {
                    onStateChange?.(item.state);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors text-xs flex items-center justify-between min-h-[32px] ${
                    currentSyncState === item.state
                      ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {currentSyncState === item.state && (
                    <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold shrink-0 ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
