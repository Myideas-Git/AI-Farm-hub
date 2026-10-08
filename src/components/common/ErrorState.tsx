import React from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showSupportNote?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Your saved information is safe. No farm records were lost.',
  onRetry,
  showSupportNote = true,
}) => {
  return (
    <div className="p-6 md:p-8 bg-amber-50/60 border border-amber-200/80 rounded-2xl max-w-lg mx-auto text-center my-6">
      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3.5">
        <ShieldAlert className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{message}</p>
      {showSupportNote && (
        <div className="text-xs text-slate-500 bg-white/70 py-2 px-3 rounded-lg border border-amber-100 mb-5">
          Local device storage preserved offline cache securely.
        </div>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors min-h-[40px]"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
