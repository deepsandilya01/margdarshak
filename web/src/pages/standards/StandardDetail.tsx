import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { useLanguage } from '@/hooks/useLanguage';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useLabs } from '@/features/laboratories/hooks/useLabs';
import { StatusPill, TechIdentifier } from '@/components/feedback/StatusPill';
import { EvidenceBadge, EvidenceDrawer } from '@/features/evidence/components/EvidenceBadge';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { Standard } from '@/features/standards/hooks/useStandards';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview', icon: 'info' },
  { id: 'scope', label: 'Scope & Applicability', icon: 'rule' },
  { id: 'clauses', label: 'Key Clauses', icon: 'format_list_numbered' },
  { id: 'testing', label: 'Testing Requirements', icon: 'biotech' },
  { id: 'labs', label: 'Accredited Labs', icon: 'science' },
  { id: 'related', label: 'Related QCOs', icon: 'gavel' },
];

export default function StandardDetail() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useStandards();
  const { labs } = useLabs({ standardId: id });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToComparison, isInComparison, saveItem, unsaveItem, isSaved } = useWorkspace();
  const [activeTab, setActiveTab] = useState('overview');
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const standard = id ? getById(id) : null;

  if (!standard) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon="menu_book"
          title="Standard not found"
          description="The standard you're looking for doesn't exist in our database."
          action={<Link to="/standards" className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">Back to Standards</Link>}
        />
      </div>
    );
  }

  const saved = isSaved(standard.id);
  const inCompare = isInComparison(standard.id);

  return (
    <>
      <EvidenceDrawer
        evidence={standard.evidence}
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
      />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-[13px] mb-6" aria-label="Breadcrumb">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Home</Link>
          <span className="text-[#94a3b8] mx-1">/</span>
          <Link to="/standards" className="text-on-surface-variant hover:text-primary transition-colors">{t('standards.title')}</Link>
          <span className="text-[#94a3b8] mx-1">/</span>
          <span className="text-on-surface font-semibold">{standard.code}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <TechIdentifier code={standard.code} size="lg" />
              <StatusPill status={standard.status} />
              {standard.evidence && (
                <EvidenceBadge status={standard.evidence.status} onClick={() => setEvidenceOpen(true)} />
              )}
            </div>
            <h1 className="text-h1 font-serif-hero text-primary tracking-tight">{standard.title}</h1>
            <p className="text-body-fluid text-on-surface-variant max-w-3xl">{standard.description}</p>
            <div className="tricolor-bar max-w-[120px] mb-2" />
            <div className="flex flex-wrap items-center gap-3 text-[13px]">
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px]">category</span>
                {standard.divisionName}
              </span>
              {standard.concordance && (
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px]">link</span>
                  Concordance: {standard.concordance}
                </span>
              )}
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px]">science</span>
                {standard.accreditedLabs} Accredited Labs
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => saved ? unsaveItem(standard.id) : saveItem({ id: standard.id, type: 'standard', label: standard.code, title: standard.title })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors border ${saved ? 'bg-surface-container text-secondary border-[var(--tech-id-border)]' : 'bg-surface text-primary border-outline-variant/30 hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{saved ? 'bookmark' : 'bookmark_border'}</span>
              {saved ? t('standard.saved') : t('standard.save')}
            </button>
            <button
              onClick={() => addToComparison({ id: standard.id, type: 'standard', label: standard.code, title: standard.title, attributes: { Division: standard.division, Status: standard.status, Labs: String(standard.accreditedLabs), Scheme: standard.certificationScheme ?? 'N/A' } })}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors border ${inCompare ? 'bg-[#ffdbd0] text-[#f36330] border-[#ffb59d]' : 'bg-surface text-primary border-outline-variant/30 hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              {t('standard.add_compare')}
            </button>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              {t('standard.start_compliance')}
            </Link>
          </div>
        </div>

        {/* Key info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Year', value: String(standard.year), icon: 'calendar_today' },
            { label: 'HS Code', value: standard.hsCode, icon: 'qr_code' },
            { label: 'Certification', value: standard.certificationScheme ?? 'N/A', icon: 'verified' },
            { label: 'Ministry', value: standard.ministry ?? 'Voluntary', icon: 'account_balance' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-surface rounded-xl border border-outline-variant/30 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-[14px]">{icon}</span>
                {label}
              </div>
              <p className="font-mono font-medium text-[13px] text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs
          tabs={DETAIL_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          className="mb-5"
        />

        {/* Tab content */}
        <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-[16px] font-semibold text-primary mb-2">About This Standard</h3>
                <p className="text-[14px] text-on-surface-variant leading-6">{standard.description}</p>
              </div>
              {standard.mandatoryUnder && (
                <div className="p-4 rounded-xl bg-[var(--tech-id-bg)] border border-[var(--tech-id-border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[var(--tech-id-text)] text-[18px]">gavel</span>
                    <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--tech-id-text)]">Mandatory Under</span>
                  </div>
                  <p className="font-mono text-[14px] font-medium text-[var(--tech-id-text)]">{standard.mandatoryUnder}</p>
                </div>
              )}
              <div>
                <h3 className="text-[15px] font-semibold text-primary mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {standard.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface-container-low font-mono text-[12px] text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-semibold text-primary">Scope of Application</h3>
              <p className="text-[14px] text-on-surface-variant leading-6">{standard.scope}</p>
            </div>
          )}

          {activeTab === 'clauses' && (
            <div className="space-y-3">
              <h3 className="text-[16px] font-semibold text-primary mb-3">Key Clauses</h3>
              <div className="space-y-2">
                {standard.clauses.map(clause => (
                  <div key={clause.number} className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <TechIdentifier code={`§ ${clause.number}`} size="md" />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-on-surface">{clause.title}</p>
                    </div>
                    {clause.mandatory && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--status-verify-bg)] text-[var(--status-verify-text)] border border-[var(--status-verify-border)] text-[11px] font-semibold uppercase tracking-wide">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-semibold text-primary">Testing Protocols</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {standard.testingProtocols.map(protocol => (
                  <div key={protocol} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                    <span className="text-[14px] text-on-surface">{protocol}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-primary">Accredited Laboratories ({labs.length})</h3>
                <Link to={`/laboratories?standardId=${standard.id}`} className="text-[13px] text-secondary hover:underline">{t('common.view_all')}</Link>
              </div>
              {labs.length === 0 ? (
                <EmptyState icon="science" title="No labs found for this standard" description="Check the laboratory finder for more options." />
              ) : (
                <div className="space-y-2">
                  {labs.map(lab => (
                    <div key={lab.id} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                      <div>
                        <TechIdentifier code={lab.accreditationNumber} size="sm" />
                        <p className="text-[14px] font-medium text-on-surface mt-1">{lab.name}</p>
                        <p className="text-[12px] text-on-surface-variant">{lab.city}, {lab.state} · {lab.turnaroundDays} days turnaround</p>
                      </div>
                      <Link
                        to={`/laboratories/${lab.id}`}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors shrink-0"
                      >
                        View Lab
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div className="space-y-4">
              <h3 className="text-[16px] font-semibold text-primary">Related Quality Control Orders</h3>
              {standard.relatedQCOs.length === 0 ? (
                <EmptyState icon="gavel" title="No mandatory QCOs" description="This standard has no directly linked Quality Control Orders." />
              ) : (
                <div className="space-y-2">
                  {standard.relatedQCOs.map(qcoId => (
                    <Link
                      key={qcoId}
                      to={`/qco/${qcoId}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">gavel</span>
                        <TechIdentifier code={qcoId} size="md" />
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_forward</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
