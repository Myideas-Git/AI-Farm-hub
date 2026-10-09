import React from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  FileText,
  UserCheck,
  FileCheck2,
} from 'lucide-react';
import { EventSource, RecordStatus, TrustStatus } from '../../types/farm';

interface TrustIndicatorProps {
  status?: RecordStatus | TrustStatus;
  source?: EventSource;
  size?: 'sm' | 'md';
  showDetails?: boolean;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  status = 'unknown',
  source,
  size = 'sm',
  showDetails = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'farmer_confirmed':
      case 'confirmed':
        return {
          icon: CheckCircle2,
          label: 'Farmer Confirmed',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          dotColor: 'bg-emerald-600',
          description: 'Explicitly verified and confirmed by farmer',
        };
      case 'pending_confirmation':
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending Farmer Confirmation',
          textColor: 'text-amber-800 dark:text-amber-300',
          dotColor: 'bg-amber-500',
          description: 'AI extracted or draft; awaiting farmer confirmation',
        };
      case 'draft':
        return {
          icon: FileText,
          label: 'Draft',
          textColor: 'text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-400',
          description: 'Unsaved or work-in-progress entry',
        };
      case 'conflicting':
        return {
          icon: AlertTriangle,
          label: 'Conflicting Information',
          textColor: 'text-rose-700 dark:text-rose-400',
          dotColor: 'bg-rose-500',
          description: 'Discrepancy detected with previous farm entries',
        };
      case 'demo':
        return {
          icon: Sparkles,
          label: 'Demo Record',
          textColor: 'text-sky-800 dark:text-sky-300',
          dotColor: 'bg-sky-500',
          description: 'Sample data for testing; not an actual farm activity',
        };
      case 'demo_incomplete':
        return {
          icon: Sparkles,
          label: 'Demo — Incomplete Information',
          textColor: 'text-indigo-800 dark:text-indigo-300',
          dotColor: 'bg-indigo-400',
          description: 'Sample record with missing plot or quantity',
        };
      case 'estimated':
        return {
          icon: Sparkles,
          label: 'Estimated',
          textColor: 'text-amber-700 dark:text-amber-400',
          dotColor: 'bg-amber-500',
          description: 'Calculated approximation',
        };
      case 'unknown':
      default:
        return {
          icon: HelpCircle,
          label: 'Unknown / Not Recorded',
          textColor: 'text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-400',
          description: 'Information not recorded. Preserved without assumption.',
        };
    }
  };

  const getSourceLabel = (src?: EventSource) => {
    if (!src) return null;
    switch (src) {
      case 'farmer_reported':
        return 'Farmer reported';
      case 'ai_extracted':
        return 'AI extracted';
      case 'farmer_confirmed':
        return 'Farmer confirmed';
      case 'verified_document':
        return 'Verified document';
      case 'demo_data':
        return 'Demo data';
      case 'unknown':
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const sourceLabel = getSourceLabel(source);

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-medium ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${config.textColor}`}
      title={`${config.label} — ${config.description}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`}
        aria-hidden="true"
      />
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
      <span>{config.label}</span>
      {sourceLabel && (
        <>
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">{sourceLabel}</span>
        </>
      )}
      {showDetails && (
        <span className="text-slate-400 font-normal text-[11px]">({config.description})</span>
      )}
    </div>
  );
};
