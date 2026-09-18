import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useWorkspace } from '@/context/WorkspaceContext';
import { StatusPill, TechIdentifier } from '@/components/feedback/StatusPill';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function ComplianceWorkspace() {
  const { t } = useLanguage();
  const { savedItems, unsaveItem } = useWorkspace();
  const navigate = useNavigate();

  const JOURNEY_STEPS = [
    { step: 1, title: 'Regulatory Discovery', status: 'completed', icon: 'search' },
    { step: 2, title: 'Standard Identification', status: 'completed', icon: 'menu_book' },
    { step: 3, title: 'QCO Verification', status: 'completed', icon: 'gavel' },
    { step: 4, title: 'Lab Booking & Testing', status: 'in_progress', icon: 'science' },
    { step: 5, title: 'Certificate Application', status: 'not_started', icon: 'verified' },
    { step: 6, title: 'ISI Mark License', status: 'not_started', icon: 'badge' },
  ];

  // Using Tricolor Accent System for the journey progress
  const stepStatusColor = (status: string) => ({
    completed: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10 border-[var(--accent-green)]/20',
    in_progress: 'text-[var(--accent-saffron)] bg-[var(--accent-saffron)]/10 border-[var(--accent-saffron)]/20',
    not_started: 'text-on-surface-variant bg-surface-container border-outline-variant/30',
  })[status] ?? '';

  const stepIcon = (status: string) => ({
    completed: <span className="material-symbols-outlined text-[16px] text-[var(--accent-green)]">check_circle</span>,
    in_progress: <span className="material-symbols-outlined text-[16px] text-[var(--accent-saffron)] animate-pulse-dot">pending</span>,
    not_started: <span className="material-symbols-outlined text-[16px] text-on-surface-variant">radio_button_unchecked</span>,
  })[status] ?? null;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-300">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
          <span>Active Compliance Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 mb-2">
          <h1 className="text-h1 font-serif-hero text-on-surface tracking-tight">{t('workspace.title')}</h1>
          <button onClick={() => navigate('/discover')} className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-medium hover:bg-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t('workspace.new_journey')}
          </button>
        </div>
        <p className="text-body-fluid text-on-surface-variant max-w-3xl">{t('workspace.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active journey */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-h2 font-serif-hero text-on-surface">Active Journey</h2>

          {/* Journey header card */}
          <Link to="/workspace/CJ-2025-001" className="block bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-5 transition-colors duration-300 hover:border-primary/40">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <TechIdentifier code="JRN-2025-LI-0047" size="md" />
                <h3 className="text-[16px] font-semibold text-on-surface mt-1">EV Battery Pack — MeitY CRS Compliance</h3>
                <p className="text-[13px] text-on-surface-variant mt-0.5">IS 16046 (Part 2):2018 · Scheme II (CRS)</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusPill status="pending" size="sm" customLabel="In Progress" />
                <span className="font-mono text-[11px] text-on-surface-variant">Started: 12 Aug 2025</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[12px] font-mono text-on-surface-variant mb-1">
                <span>Progress</span>
                <span className="font-semibold text-on-surface">3 / 6 steps</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: '50%' }} />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {JOURNEY_STEPS.map((step) => (
                <div key={step.step} className={`flex items-center gap-3 p-3 rounded-xl border ${stepStatusColor(step.status)} transition-colors duration-300`}>
                  {stepIcon(step.status)}
                  <span className="font-mono text-[11px] font-medium shrink-0">Step {step.step}</span>
                  <span className="flex-1 text-[13px] font-medium">{step.title}</span>
                  <span className="material-symbols-outlined text-[16px] opacity-80">{step.icon}</span>
                </div>
              ))}
            </div>
          </Link>
        </div>

        {/* Sidebar: Saved items */}
        <div className="space-y-4">
          <h2 className="text-h2 font-serif-hero text-on-surface">{t('nav.saved')} ({savedItems.length})</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-4 transition-colors duration-300">
            {savedItems.length === 0 ? (
              <EmptyState icon="bookmark" title="No saved items yet" description="Bookmark standards, QCOs, and labs to see them here." />
            ) : (
              <div className="space-y-2">
                {savedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      {item.type === 'standard' ? 'menu_book' : item.type === 'qco' ? 'gavel' : 'science'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <TechIdentifier code={item.label} size="sm" />
                      <p className="text-[12px] text-on-surface-variant truncate mt-0.5">{item.title}</p>
                    </div>
                    <button
                      onClick={() => unsaveItem(item.id)}
                      className="p-1 rounded hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition-colors"
                      aria-label="Remove saved"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
