import React from 'react';
import { Sprout, Plus } from 'lucide-react';
import { AppLanguage } from '../../types/profile';
import { getTranslations } from '../../i18n/translations';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  language?: AppLanguage;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  language = 'Telugu',
}) => {
  const t = getTranslations(language);
  const displayTitle = title ?? t.common.emptyTitle;
  const displayDesc = description ?? t.common.emptyDesc;
  const displayAction = actionLabel ?? t.common.emptyAction;

  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
        {icon || <Sprout className="w-7 h-7 stroke-[1.75]" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{displayTitle}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{displayDesc}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 text-white text-sm font-medium rounded-lg hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{displayAction}</span>
        </button>
      )}
    </div>
  );
};
