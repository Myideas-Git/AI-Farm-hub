import React from 'react';
import {
  User,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Receipt,
  Navigation,
  CloudSun,
  FlaskConical,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { EventSource, RecordStatus, TrustStatus } from '../../types/farm';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

export interface EvidenceBadgeProps {
  source?: EventSource;
  status?: RecordStatus | TrustStatus;
  isEstimate?: boolean;
  language?: AppLanguage;
  size?: 'xs' | 'sm' | 'md';
  showDetails?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  source = 'farmer_reported',
  status,
  isEstimate = false,
  language = 'Telugu',
  size = 'sm',
  showDetails = false,
}) => {
  const t = getTranslations(language);

  // Check if this item is an estimate (must never be presented as fact)
  const isAiEstimate = source === 'ai_estimated' || isEstimate || status === 'estimated';

  const eb = t.evidenceBadges;

  const getConfig = () => {
    if (isAiEstimate) {
      return {
        label: t.sources.ai_estimated,
        icon: AlertTriangle,
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 border-dashed',
        textColor: 'text-amber-900 dark:text-amber-200',
        dotColor: 'bg-amber-500',
        sublabel: t.timeline.notFactDisclaimer,
        tooltip: t.timeline.estimateNotice,
      };
    }

    switch (source) {
      case 'farmer_reported':
        return {
          label: t.sources.farmer_reported,
          icon: User,
          badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
          textColor: 'text-slate-700 dark:text-slate-300',
          dotColor: 'bg-slate-500',
          sublabel: eb.farmerReportedSub,
          tooltip: eb.farmerReportedTip,
        };
      case 'farmer_confirmed':
        return {
          label: t.sources.farmer_confirmed,
          icon: CheckCircle2,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800',
          textColor: 'text-emerald-800 dark:text-emerald-300',
          dotColor: 'bg-emerald-600',
          sublabel: eb.farmerConfirmedSub,
          tooltip: eb.farmerConfirmedTip,
        };
      case 'ai_extracted':
        return {
          label: t.sources.ai_extracted,
          icon: Sparkles,
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
          textColor: 'text-indigo-800 dark:text-indigo-300',
          dotColor: 'bg-indigo-500',
          sublabel: eb.awaitingReviewSub,
          tooltip: eb.awaitingReviewTip,
        };
      case 'receipt_verified':
        return {
          label: t.sources.receipt_verified,
          icon: Receipt,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700',
          textColor: 'text-emerald-900 dark:text-emerald-300',
          dotColor: 'bg-emerald-600',
          sublabel: eb.receiptAttachedSub,
          tooltip: eb.receiptAttachedTip,
        };
      case 'gps_captured':
        return {
          label: t.sources.gps_captured,
          icon: Navigation,
          badgeBg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
          textColor: 'text-teal-800 dark:text-teal-300',
          dotColor: 'bg-teal-500',
          sublabel: eb.gpsCapturedSub,
          tooltip: eb.gpsCapturedTip,
        };
      case 'weather_data':
        return {
          label: t.sources.weather_data,
          icon: CloudSun,
          badgeBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
          textColor: 'text-sky-800 dark:text-sky-300',
          dotColor: 'bg-sky-500',
          sublabel: eb.weatherStationSub,
          tooltip: eb.weatherStationTip,
        };
      case 'soil_report':
        return {
          label: t.sources.soil_report,
          icon: FlaskConical,
          badgeBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
          textColor: 'text-purple-800 dark:text-purple-300',
          dotColor: 'bg-purple-500',
          sublabel: eb.soilLabReportSub,
          tooltip: eb.soilLabReportTip,
        };
      case 'farmer_voice':
        return {
          label: t.sources.farmer_voice,
          icon: User,
          badgeBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
          textColor: 'text-sky-800 dark:text-sky-300',
          dotColor: 'bg-sky-500',
          sublabel: eb.voiceCapturedSub,
          tooltip: eb.voiceCapturedTip,
        };
      case 'camera_product':
        return {
          label: t.sources.camera_product,
          icon: FileText,
          badgeBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
          textColor: 'text-sky-800 dark:text-sky-300',
          dotColor: 'bg-sky-500',
          sublabel: eb.cameraProductSub,
          tooltip: eb.cameraProductTip,
        };
      case 'verified_document':
        return {
          label: t.sources.verified_document,
          icon: CheckCircle2,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700',
          textColor: 'text-emerald-900 dark:text-emerald-200',
          dotColor: 'bg-emerald-700',
          sublabel: eb.verifiedDocSub,
          tooltip: eb.verifiedDocTip,
        };
      default:
        return {
          label: t.sources[source] || source.replace(/_/g, ' '),
          icon: HelpCircle,
          badgeBg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
          textColor: 'text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-400',
          sublabel: eb.systemSub,
          tooltip: eb.systemTip,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[10px] gap-1'
      : size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1.5'
      : 'px-2.5 py-1 text-sm gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${sizeClasses} ${config.badgeBg} ${config.textColor}`}
      title={config.tooltip}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} aria-hidden="true" />
      <Icon className={size === 'xs' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span className="font-semibold">{config.label}</span>
      {isAiEstimate && (
        <span className="text-[10px] uppercase font-bold tracking-tight text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1 rounded ml-0.5">
          {t.trustIndicators.estimated}
        </span>
      )}
      {showDetails && config.sublabel && (
        <span className="text-[10px] opacity-75 font-normal ml-0.5">· {config.sublabel}</span>
      )}
    </span>
  );
};
