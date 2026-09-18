import React from 'react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'search_off', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">{icon}</span>
      </div>
      <h3 className="text-[16px] font-semibold leading-6 text-on-surface tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-[14px] leading-5 text-on-surface-variant max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  inline?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading data. Please try again.',
  onRetry,
  className,
  inline = false,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center text-center',
        inline ? 'py-8 px-4' : 'py-16 px-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-xl bg-[#ffdad6] flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-[28px] text-[#ba1a1a]">error_outline</span>
      </div>
      <h3 className="text-[16px] font-semibold text-on-surface mb-1">{title}</h3>
      <p className="text-[14px] text-on-surface-variant max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-outline-variant text-primary text-[14px] font-medium hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Try again
        </button>
      )}
    </div>
  );
}
