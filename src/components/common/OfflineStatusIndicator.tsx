import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SyncState } from '../../types/farm';

interface OfflineStatusIndicatorProps {
  currentSyncState: SyncState;
  pendingCount?: number;
  onStateChange?: (state: SyncState) => void;
}

export const OfflineStatusIndicator: React.FC<OfflineStatusIndicatorProps> = ({
  currentSyncState,
  pendingCount = 1,
  onStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusDisplay = () => {
    switch (currentSyncState) {
      case 'online':
        return {
          icon: Wifi,
          label: 'Online',
          detail: 'Cloud synced',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'offline':
        return {
          icon: WifiOff,
          label: 'Offline Mode',
          detail: 'Local memory active',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'pending_sync':
        return {
          icon: RefreshCw,
          label: 'Pending Sync',
          detail: `${pendingCount} record queued`,
          color: 'text-sky-800 bg-sky-50 border-sky-200',
          dot: 'bg-sky-600 animate-pulse',
        };
      case 'sync_completed':
        return {
          icon: CheckCircle2,
          label: 'Sync Completed',
          detail: 'All records backed up',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
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
        title="Simulate offline / online sync states (Phase 0 Prototype)"
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
          <div className="absolute right-0 mt-1.5 w-72 p-3 bg-white border border-slate-200 rounded-lg shadow-lg z-50 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Network Sync State</span>
              <span className="text-[10px] text-slate-400 font-mono">PHASE 0 SIMULATION</span>
            </div>
            <p className="text-slate-500 mb-2.5 leading-relaxed text-[11px]">
              The platform is designed to operate seamlessly in fields with zero connectivity. Switch states to inspect offline behavior:
            </p>
            <div className="space-y-1">
              {(
                [
                  { state: 'online', label: 'Online (Connected)' },
                  { state: 'offline', label: 'Offline (Field Memory Active)' },
                  { state: 'pending_sync', label: 'Pending Sync (Queued locally)' },
                  { state: 'sync_completed', label: 'Sync Completed (Synced)' },
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
                      ? 'bg-slate-100 font-semibold text-slate-900'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentSyncState === item.state && (
                    <span className="text-emerald-700 text-[11px]">Active</span>
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
