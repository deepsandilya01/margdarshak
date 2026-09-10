import React from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'pills', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={clsx('flex items-center border-b border-outline-variant/30 gap-0', className)} role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'inline-flex items-center gap-1.5 px-4 py-3 text-[14px] font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.id
                ? 'text-primary border-secondary font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-outline-variant'
            )}
          >
            {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-secondary text-[11px] font-bold leading-3">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center bg-surface-container-low rounded-xl p-0.5 gap-0',
        className
      )}
      role="tablist"
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all',
            activeTab === tab.id
              ? 'bg-surface text-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          )}
        >
          {tab.icon && <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={clsx(
              'px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-3',
              activeTab === tab.id ? 'bg-surface-container text-secondary' : 'bg-surface-container-high text-on-surface-variant'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
