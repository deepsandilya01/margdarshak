import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { TechIdentifier, StatusPill } from '@/components/feedback/StatusPill';
import { EvidenceBadge } from '@/features/evidence/components/EvidenceBadge';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function DiscoveryResults() {
  const location = useLocation();
  const answers = (location.state ?? {}) as Record<string, string>;
  const { standards } = useStandards();

  const relevantStandards = answers.category
    ? standards.filter(s => s.tags.some(t => answers.category?.toLowerCase().includes(t.toLowerCase())) || s.status === 'mandatory_qco').slice(0, 4)
    : standards.slice(0, 4);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/discover" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-h1 font-serif-hero text-primary tracking-tight mt-2 mb-2">Regulatory Discovery Results</h1>
          <p className="text-[13px] text-on-surface-variant">Based on your inputs: {answers.category ?? 'All categories'} · {answers.environment ?? 'Any environment'}</p>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
            <h3 className="text-[14px] font-semibold text-primary mb-4">Refine Results</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Status</p>
                {['All', 'Mandatory QCO', 'Active Standard'].map(f => (
                  <label key={f} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="radio" name="status" defaultChecked={f === 'All'} className="accent-[#00162d]" />
                    <span className="text-[13px] text-on-surface">{f}</span>
                  </label>
                ))}
              </div>
              <hr className="border-surface-container-low" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Division</p>
                {['ETD (Electrotechnical)', 'PCD (Consumer)', 'MTD (Metal)', 'FAD (Food)'].map(d => (
                  <label key={d} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#00162d]" />
                    <span className="text-[13px] text-on-surface">{d}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-9 space-y-3">
          {relevantStandards.length === 0 ? (
            <EmptyState icon="search_off" title="No standards found" description="Try adjusting your inputs in the discovery flow." />
          ) : (
            relevantStandards.map(s => (
              <div key={s.id} className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-5 hover:border-outline-variant transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TechIdentifier code={s.code} size="md" />
                      <StatusPill status={s.status} size="sm" />
                      {s.evidence && <EvidenceBadge status={s.evidence.status} compact />}
                    </div>
                    <h3 className="text-[16px] font-semibold text-primary">{s.title}</h3>
                    <p className="text-[13px] text-on-surface-variant leading-5">{s.description.slice(0, 120)}…</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[12px] text-on-surface-variant">{s.division}</span>
                      <span className="px-2 py-0.5 rounded bg-[var(--tech-id-bg)] font-mono text-[12px] text-[var(--tech-id-text)]">{s.accreditedLabs} labs</span>
                      {s.mandatoryUnder && (
                        <span className="px-2 py-0.5 rounded bg-[var(--status-verify-bg)] font-mono text-[12px] text-[var(--status-verify-text)]">Mandatory under {s.mandatoryUnder}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      to={`/standards/${s.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors"
                    >
                      <span>View Standard</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                    <Link
                      to="/workspace"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/30 text-primary text-[14px] font-medium hover:bg-surface-container-low transition-colors text-center"
                    >
                      Start Compliance
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
