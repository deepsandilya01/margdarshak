import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQCOs } from '../../hooks/useQCOs';
import { useLanguage } from '../../hooks/useLanguage';
import { StatusPill, TechIdentifier } from '../../components/shared/StatusPill';
import { EvidenceBadge, EvidenceDrawer } from '../../components/shared/EvidenceBadge';
import { EmptyState } from '../../components/shared/EmptyState';
import type { QCO } from '../../hooks/useQCOs';

export default function QCOExplorer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'amended'>('all');
  const [evidenceOpen, setEvidenceOpen] = useState<QCO['evidence'] | null>(null);

  const q = searchParams.get('q') ?? '';
  const { qcos } = useQCOs({ search: q || undefined, status: filterStatus });

  return (
    <>
      <EvidenceDrawer evidence={evidenceOpen} isOpen={!!evidenceOpen} onClose={() => setEvidenceOpen(null)} />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">gavel</span>
            <span>Mandatory Quality Control Orders</span>
          </div>
          <h1 className="text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">{t('qco.title')}</h1>
          <p className="text-body-fluid text-on-surface-variant max-w-3xl">{t('qco.subtitle')}</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 w-full md:max-w-md focus-within:border-secondary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              defaultValue={q}
              onChange={e => setSearchParams(e.target.value ? { q: e.target.value } : {})}
              placeholder="Search QCO, ministry, title…"
              className="flex-1 bg-transparent text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none min-w-0"
            />
          </div>
          <div className="flex flex-wrap items-center bg-surface-container-low rounded-xl p-0.5 gap-0.5 w-full md:w-auto">
            {(['all', 'active', 'draft', 'amended'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${filterStatus === s ? 'bg-surface text-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>



        {qcos.length === 0 ? (
          <EmptyState icon="gavel" title="No QCOs found" description="Try adjusting your search or filters." />
        ) : (
          <div className="space-y-3">
            {qcos.map(qco => (
              <div
                key={qco.id}
                className="glossy-card bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-5 hover:border-outline-variant transition-all cursor-pointer"
                onClick={() => navigate(`/qco/${qco.id}`)}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TechIdentifier code={qco.code} size="md" />
                      <StatusPill status={qco.status === 'active' ? 'active' : qco.status === 'draft' ? 'draft' : 'under_revision'} size="sm" />
                      {qco.evidence && <EvidenceBadge status={qco.evidence.status} compact onClick={e => { e?.stopPropagation(); setEvidenceOpen(qco.evidence); }} />}
                    </div>
                    <h3 className="text-[16px] font-semibold text-primary">{qco.title}</h3>
                    <p className="text-[13px] text-on-surface-variant leading-5">{qco.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[12px] text-on-surface-variant">{qco.ministry_short}</span>
                      <span className="px-2 py-0.5 rounded bg-[var(--tech-id-bg)] font-mono text-[12px] text-[var(--tech-id-text)]">GSR: {qco.gazetteRef.split(',')[0]}</span>
                      <span className="px-2 py-0.5 rounded bg-[var(--status-compliant-bg)] font-mono text-[12px] text-[var(--status-compliant-text)]">Effective: {qco.effectiveDate}</span>
                    </div>
                  </div>
                  <Link
                    to={`/qco/${qco.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors shrink-0"
                    onClick={e => e.stopPropagation()}
                  >
                    <span>View QCO</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
