import React from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { TrustStatus, EventSource } from '../../types/farm';

interface TrustIndicatorProps {
  status: TrustStatus;
  source?: EventSource;
  size?: 'sm' | 'md';
  showDetails?: boolean;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  status,
  source,
  size = 'sm',
  showDetails = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle2,
          label: 'Farmer Confirmed',
          textColor: 'text-emerald-700',
          dotColor: 'bg-emerald-600',
          description: 'Verified by farmer entry or invoice',
        };
      case 'estimated':
        return {
          icon: Sparkles,
          label: 'Estimated',
          textColor: 'text-amber-700',
          dotColor: 'bg-amber-500',
          description: 'Calculated approximation based on field averages',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending Verification',
          textColor: 'text-amber-700',
          dotColor: 'bg-amber-400',
          description: 'Awaiting farmer confirmation or receipt review',
        };
      case 'conflicting':
        return {
          icon: AlertTriangle,
          label: 'Conflicting Data',
          textColor: 'text-rose-700',
          dotColor: 'bg-rose-500',
          description: 'Discrepancy detected with previous records',
        };
      case 'demo':
        return {
          icon: Sparkles,
          label: 'Demo Data',
          textColor: 'text-sky-700',
          dotColor: 'bg-sky-500',
          description: 'Demonstration simulation; not real-world data',
        };
      case 'unknown':
      default:
        return {
          icon: HelpCircle,
          label: 'Unknown / Not Recorded',
          textColor: 'text-slate-600',
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
      case 'farmer_confirmed':
        return 'Farmer confirmed';
      case 'verified_document':
        return 'Verified voucher';
      case 'ai_extracted':
        return 'Extracted from note';
      case 'ai_estimated':
        return 'Model estimate';
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
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-500 font-normal">{sourceLabel}</span>
        </>
      )}
      {showDetails && (
        <span className="text-slate-400 font-normal">({config.description})</span>
      )}
    </div>
  );
};
