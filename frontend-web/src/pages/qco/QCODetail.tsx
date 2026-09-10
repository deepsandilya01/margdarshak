import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQCOs } from '../../hooks/useQCOs';
import { useLanguage } from '../../hooks/useLanguage';
import { StatusPill, TechIdentifier } from '../../components/shared/StatusPill';
import { EvidenceBadge } from '../../components/shared/EvidenceBadge';
import { EmptyState } from '../../components/shared/EmptyState';

export default function QCODetail() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useQCOs();
  const { t } = useLanguage();

  const qco = id ? getById(id) : null;

  if (!qco) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <EmptyState icon="gavel" title="QCO not found" description="This QCO does not exist in our database." action={<Link to="/qco" className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">Back to QCOs</Link>} />
      </div>
    );
  }

  const statusMap = { active: 'active', draft: 'draft', amended: 'under_revision' } as const;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-6">
      <nav className="flex items-center gap-1 text-[13px] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="text-on-surface-variant hover:text-primary">Home</Link>
        <span className="text-[#94a3b8] mx-1">/</span>
        <Link to="/qco" className="text-on-surface-variant hover:text-primary">{t('qco.title')}</Link>
        <span className="text-[#94a3b8] mx-1">/</span>
        <span className="text-on-surface font-semibold">{qco.code}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <TechIdentifier code={qco.code} size="lg" />
          <StatusPill status={statusMap[qco.status]} size="sm" />
          {qco.evidence && <EvidenceBadge status={qco.evidence.status} />}
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">{qco.title}</h1>
        <p className="text-body-md text-on-surface-variant">{qco.description}</p>
      </div>

      {/* Key facts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Ministry', value: qco.ministry_short, icon: 'account_balance' },
          { label: 'Gazette Reference', value: qco.gazetteRef.split(',')[0], icon: 'article' },
          { label: 'Effective Date', value: qco.effectiveDate, icon: 'event' },
          { label: 'Certification Path', value: qco.certificationPath.split(' ')[0], icon: 'verified' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-surface rounded-xl border border-outline-variant/30 p-4">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-[14px]">{icon}</span>
              {label}
            </div>
            <p className="font-mono text-[13px] font-medium text-primary">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Applicability</h3>
            <p className="text-[14px] text-on-surface-variant leading-6">{qco.applicability}</p>
          </div>
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Exemptions</h3>
            <ul className="space-y-1.5">
              {qco.exemptions.map(e => (
                <li key={e} className="flex items-start gap-2 text-[14px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-[#94a3b8] mt-0.5 shrink-0">remove_circle</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Penalty Provisions</h3>
            <p className="text-[14px] text-on-surface-variant leading-6 p-4 bg-[var(--status-verify-bg)] rounded-xl border border-[var(--status-verify-border)]">{qco.penaltyProvisions}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
            <h3 className="text-[14px] font-semibold text-primary mb-3">Covered Standards</h3>
            <div className="space-y-2">
              {qco.coveredStandardCodes.map(code => (
                <Link key={code} to={`/standards/${code}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                  <TechIdentifier code={code} size="sm" />
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-primary-container rounded-2xl p-5 text-white">
            <h3 className="text-[14px] font-semibold text-white mb-2">Testing Requirements</h3>
            <p className="text-[13px] text-[#7a93b5] leading-5 mb-4">{qco.testingRequirements}</p>
            <Link to="/laboratories" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-primary text-[13px] font-medium hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[16px]">science</span>
              Find Testing Labs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
