import React from 'react';
import { clsx } from 'clsx';

type StatusType = 'mandatory_qco' | 'active' | 'superseded' | 'under_revision' | 'compliant' | 'pending' | 'draft' | 'amended' | 'accredited' | 'expired';

const statusConfig: Record<StatusType, {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}> = {
  mandatory_qco: {
    label: 'Mandatory QCO in Force',
    bg: 'var(--tech-id-bg)',
    text: 'var(--tech-id-text)',
    border: 'var(--tech-id-border)',
    dot: 'var(--tech-id-text)',
  },
  active: {
    label: 'Active Standard',
    bg: 'var(--status-compliant-bg)',
    text: 'var(--status-compliant-text)',
    border: 'var(--status-compliant-border)',
    dot: 'var(--status-compliant-dot)',
  },
  superseded: {
    label: 'Superseded',
    bg: '#fafafa',
    text: '#64748b',
    border: '#e2e8f0',
    dot: '#94a3b8',
  },
  under_revision: {
    label: 'Under Revision',
    bg: 'var(--status-pending-bg)',
    text: 'var(--status-pending-text)',
    border: 'var(--status-pending-border)',
    dot: 'var(--status-pending-dot)',
  },
  compliant: {
    label: 'Compliant',
    bg: 'var(--status-compliant-bg)',
    text: 'var(--status-compliant-text)',
    border: 'var(--status-compliant-border)',
    dot: 'var(--status-compliant-dot)',
  },
  pending: {
    label: 'Pending',
    bg: 'var(--status-pending-bg)',
    text: 'var(--status-pending-text)',
    border: 'var(--status-pending-border)',
    dot: 'var(--status-pending-dot)',
  },
  draft: {
    label: 'Draft',
    bg: '#f8fafc',
    text: '#64748b',
    border: '#e2e8f0',
    dot: '#94a3b8',
  },
  amended: {
    label: 'Under Amendment',
    bg: 'var(--status-pending-bg)',
    text: 'var(--status-pending-text)',
    border: 'var(--status-pending-border)',
    dot: 'var(--status-pending-dot)',
  },
  accredited: {
    label: 'Accredited',
    bg: 'var(--status-compliant-bg)',
    text: 'var(--status-compliant-text)',
    border: 'var(--status-compliant-border)',
    dot: 'var(--status-compliant-dot)',
  },
  expired: {
    label: 'Expired',
    bg: 'var(--status-verify-bg)',
    text: 'var(--status-verify-text)',
    border: 'var(--status-verify-border)',
    dot: 'var(--status-verify-dot)',
  },
};

interface StatusPillProps {
  status: StatusType;
  customLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusPill({ status, customLabel, size = 'md', className }: StatusPillProps) {
  const cfg = statusConfig[status];
  const label = customLabel ?? cfg.label;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] leading-[16px] tracking-wide' : 'px-2.5 py-1 text-[12px] leading-[16px] tracking-wide',
        className
      )}
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
      {label}
    </span>
  );
}

// ---- Technical Identifier Chip ----
interface TechIdentifierProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function TechIdentifier({ code, size = 'md', className, onClick }: TechIdentifierProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px] leading-[14px]',
    md: 'px-2 py-0.5 text-[12px] leading-[16px]',
    lg: 'px-2.5 py-1 text-[14px] leading-[20px]',
  };

  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={clsx(
        'inline-flex items-center gap-1 font-mono font-medium rounded border font-variant-numeric-tabular',
        'bg-[var(--tech-id-bg)] text-[var(--tech-id-text)] border-[var(--tech-id-border)]',
        onClick && 'cursor-pointer hover:bg-[#e0f2fe] transition-colors',
        sizeClasses[size],
        className
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {code}
    </Tag>
  );
}
