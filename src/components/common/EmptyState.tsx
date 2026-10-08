import React from 'react';
import { Sprout, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your farm memory starts here',
  description = 'Add your first plot or crop cycle to begin capturing your field journey.',
  actionLabel = 'Record First Activity',
  onAction,
  icon,
}) => {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
        {icon || <Sprout className="w-7 h-7 stroke-[1.75]" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 text-white text-sm font-medium rounded-lg hover:bg-emerald-900 transition-colors shadow-xs min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
