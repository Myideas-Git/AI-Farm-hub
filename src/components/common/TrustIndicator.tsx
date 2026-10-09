import React from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  FileText,
} from 'lucide-react';
import { EventSource, RecordStatus, TrustStatus } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

interface TrustIndicatorProps {
  status?: RecordStatus | TrustStatus;
  source?: EventSource;
  size?: 'sm' | 'md';
  showDetails?: boolean;
  language?: AppLanguage;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  status = 'unknown',
  source,
  size = 'sm',
  showDetails = false,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);

  const getStatusConfig = () => {
    switch (status) {
      case 'farmer_confirmed':
      case 'confirmed':
        return {
          icon: CheckCircle2,
          label: t.trustIndicators.farmerConfirmed,
          textColor: 'text-emerald-700 dark:text-emerald-400',
          dotColor: 'bg-emerald-600',
          description: t.statuses.farmer_confirmed,
        };
      case 'pending_confirmation':
      case 'pending':
        return {
          icon: Clock,
          label: t.trustIndicators.pendingConfirmation,
          textColor: 'text-amber-800 dark:text-amber-300',
          dotColor: 'bg-amber-500',
          description: t.statuses.pending_confirmation,
        };
      case 'draft':
        return {
          icon: FileText,
          label: t.trustIndicators.draft,
          textColor: 'text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-400',
          description: t.statuses.draft,
        };
      case 'conflicting':
        return {
          icon: AlertTriangle,
          label: t.trustIndicators.conflicting,
          textColor: 'text-rose-700 dark:text-rose-400',
          dotColor: 'bg-rose-500',
          description: t.statuses.conflicting,
        };
      case 'demo':
        return {
          icon: Sparkles,
          label: t.trustIndicators.demoRecord,
          textColor: 'text-sky-800 dark:text-sky-300',
          dotColor: 'bg-sky-500',
          description: t.statuses.demo,
        };
      case 'demo_incomplete':
        return {
          icon: Sparkles,
          label: t.trustIndicators.demoIncomplete,
          textColor: 'text-indigo-800 dark:text-indigo-300',
          dotColor: 'bg-indigo-400',
          description: t.statuses.demo_incomplete,
        };
      case 'estimated':
        return {
          icon: Sparkles,
          label: t.trustIndicators.estimated,
          textColor: 'text-amber-700 dark:text-amber-400',
          dotColor: 'bg-amber-500',
          description: t.statuses.estimated,
        };
      case 'unknown':
      default:
        return {
          icon: HelpCircle,
          label: t.trustIndicators.unknown,
          textColor: 'text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-400',
          description: t.statuses.unknown,
        };
    }
  };

  const getSourceLabel = (src?: EventSource) => {
    if (!src) return null;
    return t.sources[src] || null;
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
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">{sourceLabel}</span>
        </>
      )}
      {showDetails && (
        <span className="text-slate-400 font-normal text-[11px]">({config.description})</span>
      )}
    </div>
  );
};
