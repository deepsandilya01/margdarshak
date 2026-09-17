import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { useLanguage } from '@/hooks/useLanguage';
import { useWorkspace } from '@/context/WorkspaceContext';
import { StatusPill, TechIdentifier } from '@/components/feedback/StatusPill';
import { EvidenceBadge, EvidenceDrawer } from '@/features/evidence/components/EvidenceBadge';
import { StandardsTableSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { Standard } from '@/features/standards/hooks/useStandards';

type FilterStatus = 'all' | 'mandatory_qco' | 'active' | 'superseded' | 'under_revision';

export default function StandardsExplorer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToComparison, isInComparison, saveItem, unsaveItem, isSaved } = useWorkspace();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [evidenceOpen, setEvidenceOpen] = useState<Standard['evidence'] | null>(null);

  const q = searchParams.get('q') ?? '';
  const { standards, isLoading } = useStandards({ search: q || undefined, status: filterStatus });

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: t('standards.filter_all'), value: 'all' },
    { label: t('standards.filter_mandatory'), value: 'mandatory_qco' },
    { label: t('standards.filter_electro'), value: 'active' },
  ];

  return (
    <>
      <EvidenceDrawer
        evidence={evidenceOpen}
        isOpen={!!evidenceOpen}
        onClose={() => setEvidenceOpen(null)}
      />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">dataset</span>
            <span>Indian Standards Registry v2025</span>
          </div>
          <h1 className="text-h1 font-serif-hero text-on-surface tracking-tight mt-2 mb-2">{t('standards.title')}</h1>
          <p className="text-body-fluid text-on-surface-variant max-w-3xl">{t('standards.subtitle')}</p>
        </div>

        {/* Search + filters row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          {/* Search input */}
          <div className="flex items-center gap-2 bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 w-full md:max-w-md focus-within:border-secondary focus-within:shadow-[0_0_0_3px_rgba(29,78,216,0.12)] transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              defaultValue={q}
              onChange={e => setSearchParams(e.target.value ? { q: e.target.value } : {})}
              placeholder="Search IS code, title, division…"
              className="flex-1 bg-transparent text-[14px] text-on-surface placeholder:text-on-surface-variant outline-none min-w-0"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center bg-surface-container-low rounded-xl p-0.5 gap-0.5 w-full md:w-auto">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  filterStatus === tab.value
                    ? 'bg-surface text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <StandardsTableSkeleton />
        ) : standards.length === 0 ? (
          <EmptyState
            icon="menu_book"
            title={t('search.no_results')}
            description={t('search.no_results_sub')}
            action={
              <button
                onClick={() => setSearchParams({})}
                className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="glossy-card bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  {[
                    t('standards.identifier'),
                    t('standards.title_col'),
                    t('standards.division'),
                    t('standards.legal_status'),
                    t('standards.lab_network'),
                    t('standards.actions'),
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`py-3 px-5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standards.map(s => {
                  const saved = isSaved(s.id);
                  const inCompare = isInComparison(s.id);
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-background transition-colors border-b border-surface-container-low last:border-0 cursor-pointer"
                      onClick={() => navigate(`/standards/${s.id}`)}
                    >
                      {/* Identifier */}
                      <td className="py-4 px-5 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-2 h-2 rounded-full ${s.status === 'mandatory_qco' ? 'bg-secondary' : s.status === 'superseded' ? 'bg-[#ba1a1a]' : 'bg-[var(--status-compliant-dot)]'}`} />
                          <TechIdentifier code={s.code} size="md" onClick={() => navigate(`/standards/${s.id}`)} />
                        </div>
                        {s.concordance && (
                          <span className="font-mono text-[11px] text-on-surface-variant">Concordance: {s.concordance}</span>
                        )}
                        {s.evidence && (
                          <div className="mt-1">
                            <EvidenceBadge
                              status={s.evidence.status}
                              compact
                              onClick={() => setEvidenceOpen(s.evidence)}
                            />
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-5 max-w-xs">
                        <span className="text-[15px] font-semibold text-primary block leading-5">{s.shortTitle}</span>
                        <span className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">{s.description.slice(0, 90)}…</span>
                      </td>

                      {/* Division */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[12px] text-on-surface-variant">{s.division}</span>
                      </td>

                      {/* Legal status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <StatusPill status={s.status} size="sm" />
                      </td>

                      {/* Lab network */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-mono text-[12px] text-primary font-medium">{s.accreditedLabs} Accredited Labs</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/standards/${s.id}`}
                            className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors"
                          >
                            {t('standards.view_scope')}
                          </Link>
                          <button
                            onClick={() => {
                              if (saved) unsaveItem(s.id);
                              else saveItem({ id: s.id, type: 'standard', label: s.code, title: s.title });
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-secondary bg-surface-container' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            title={saved ? 'Unsave' : 'Bookmark'}
                          >
                            <span className="material-symbols-outlined text-[17px]">{saved ? 'bookmark' : 'bookmark_border'}</span>
                          </button>
                          <button
                            onClick={() => addToComparison({ id: s.id, type: 'standard', label: s.code, title: s.title, attributes: { Division: s.division, Status: s.status, Labs: String(s.accreditedLabs), Scheme: s.certificationScheme ?? 'N/A' } })}
                            className={`p-1.5 rounded-lg transition-colors ${inCompare ? 'text-[#f36330] bg-[#ffdbd0]' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            title={inCompare ? 'In comparison' : 'Add to compare'}
                          >
                            <span className="material-symbols-outlined text-[17px]">compare_arrows</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Result count */}
        {!isLoading && standards.length > 0 && (
          <p className="mt-3 text-[12px] font-mono text-on-surface-variant">
            Showing {standards.length} {t('common.results')} {q && `for "${q}"`}
          </p>
        )}
      </div>
    </>
  );
}
