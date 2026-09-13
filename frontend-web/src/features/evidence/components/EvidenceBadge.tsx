import React from 'react';
import { clsx } from 'clsx';

type EvidenceStatus =
  | 'verified'
  | 'source_backed'
  | 'partial'
  | 'needs_verification'
  | 'Verified'
  | 'Source-backed'
  | 'Partial'
  | 'Needs Verification';

type EvidenceStatusKey = keyof typeof statusConfig;

const normalizeEvidenceStatus = (status: string): EvidenceStatusKey => {
  const normalized = status.toLowerCase().replace(/[-\s]+/g, '_');

  switch (normalized) {
    case 'verified':
      return 'verified';
    case 'source_backed':
      return 'source_backed';
    case 'partial':
      return 'partial';
    case 'needs_verification':
      return 'needs_verification';
    default:
      return 'verified';
  }
};

const statusConfig: Record<'verified' | 'source_backed' | 'partial' | 'needs_verification', {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  icon: string;
}> = {
  verified: {
    label: 'Verified',
    bg: 'var(--status-compliant-bg)',
    text: 'var(--status-compliant-text)',
    border: 'var(--status-compliant-border)',
    dot: 'var(--status-compliant-dot)',
    icon: 'verified',
  },
  source_backed: {
    label: 'Source-backed',
    bg: '#eff6ff',
    text: '#1d4ed8',
    border: '#bfdbfe',
    dot: '#3b82f6',
    icon: 'link',
  },
  partial: {
    label: 'Partial',
    bg: 'var(--status-pending-bg)',
    text: 'var(--status-pending-text)',
    border: 'var(--status-pending-border)',
    dot: 'var(--status-pending-dot)',
    icon: 'info',
  },
  needs_verification: {
    label: 'Needs Verification',
    bg: 'var(--status-verify-bg)',
    text: 'var(--status-verify-text)',
    border: 'var(--status-verify-border)',
    dot: 'var(--status-verify-dot)',
    icon: 'warning',
  },
};

interface EvidenceBadgeProps {
  status: EvidenceStatus | string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  compact?: boolean;
}

export function EvidenceBadge({ status, onClick, className, compact = false }: EvidenceBadgeProps) {
  const cfg = statusConfig[normalizeEvidenceStatus(String(status))];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold leading-4 tracking-wide uppercase transition-all',
        'hover:opacity-80 focus-visible:outline focus-visible:outline-2',
        !onClick && 'cursor-default',
        className
      )}
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
      }}
      aria-label={`Evidence status: ${cfg.label}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      {!compact && (
        <>
          <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
          <span>{cfg.label}</span>
        </>
      )}
    </button>
  );
}

// ---- Evidence Drawer ----
interface EvidenceData {
  status: EvidenceStatus;
  source: string;
  document: string;
  section: string;
  revision: string;
  sourceUrl?: string;
}

interface EvidenceDrawerProps {
  evidence: EvidenceData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ evidence, isOpen, onClose }: EvidenceDrawerProps) {
  if (!isOpen || !evidence) return null;

  const cfg = statusConfig[normalizeEvidenceStatus(String(evidence.status))];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Evidence details"
        className={clsx(
          'fixed z-[100] bg-surface flex flex-col overflow-hidden transition-transform duration-300',
          // Mobile: Bottom sheet
          'bottom-0 left-0 right-0 w-full rounded-t-2xl max-h-[85vh] shadow-[0_-8px_24px_rgba(0,0,0,0.12)]',
          // Desktop: Slide-in right drawer
          'sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[400px] sm:max-h-none sm:rounded-none sm:border-l sm:border-outline-variant/30 sm:shadow-[var(--shadow-l3)]'
        )}
      >
        {/* Mobile Handle */}
        <div className="flex w-full justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
          <div className="h-1.5 w-12 rounded-full bg-outline-variant/50" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pb-4 pt-2 sm:py-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">description</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Evidence Source</p>
              <EvidenceBadge status={evidence.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
            aria-label="Close evidence drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: cfg.text }}>
              Verification Status
            </p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{ color: cfg.text }}>{cfg.icon}</span>
              <span className="text-[14px] font-semibold" style={{ color: cfg.text }}>{cfg.label}</span>
            </div>
          </div>

          {[
            { label: 'Source', value: evidence.source, icon: 'public' },
            { label: 'Document', value: evidence.document, icon: 'article' },
            { label: 'Section / Clause', value: evidence.section, icon: 'format_list_numbered' },
            { label: 'Revision / Edition', value: evidence.revision, icon: 'history' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">{icon}</span>
                {label}
              </div>
              <p className="text-[13px] sm:text-[14px] text-on-surface font-mono bg-surface-container-low px-3 py-2 rounded-lg break-words">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/30 flex items-center gap-3 bg-surface-container-lowest">
          {evidence.sourceUrl ? (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg border border-outline-variant text-primary text-[14px] font-medium hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              View Source
            </a>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg border border-outline-variant/50 text-on-surface-variant text-[14px] font-medium">
              Source URL unavailable
            </span>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
