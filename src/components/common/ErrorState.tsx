import React from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showSupportNote?: boolean;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Storage or Loading Issue',
  message = 'Your saved information is safe. Local device memory preserved offline data.',
  onRetry,
  showSupportNote = true,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="p-6 md:p-8 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl max-w-lg mx-auto text-center my-6">
      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center mx-auto mb-3.5">
        <ShieldAlert className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{message}</p>
      {showSupportNote && (
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900 py-2 px-3 rounded-lg border border-amber-200 dark:border-amber-900 mb-5">
          Local device storage preserved offline cache securely.
        </div>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors min-h-[40px]"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
};
