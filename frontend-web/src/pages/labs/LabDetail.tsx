import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLabs } from '../../hooks/useLabs';
import { useLanguage } from '../../hooks/useLanguage';
import { TechIdentifier, StatusPill } from '../../components/shared/StatusPill';
import { EmptyState } from '../../components/shared/EmptyState';

export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useLabs();
  const { t } = useLanguage();

  const lab = id ? getById(id) : null;

  if (!lab) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <EmptyState icon="science" title="Laboratory not found" action={<Link to="/laboratories" className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">Back to Labs</Link>} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-6">
      <nav className="flex items-center gap-1 text-[13px] mb-6">
        <Link to="/" className="text-on-surface-variant hover:text-primary">Home</Link>
        <span className="text-[#94a3b8] mx-1">/</span>
        <Link to="/laboratories" className="text-on-surface-variant hover:text-primary">Laboratories</Link>
        <span className="text-[#94a3b8] mx-1">/</span>
        <span className="text-on-surface font-semibold">{lab.accreditationNumber}</span>
      </nav>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <TechIdentifier code={lab.accreditationNumber} size="lg" />
            <StatusPill status={lab.nablStatus === 'Accredited' ? 'accredited' : 'expired'} />
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-primary text-[12px] font-medium">{lab.type}</span>
          </div>
          <h1 className="text-headline-lg text-primary tracking-tight">{lab.name}</h1>
          <p className="text-body-md text-on-surface-variant">{lab.description}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {lab.onlineBooking && (
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
              {t('labs.book_test')}
            </button>
          )}
          <a href={`mailto:${lab.email}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/30 text-primary text-[14px] font-medium hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            {t('labs.contact')}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'City', value: lab.city, icon: 'location_city' },
          { label: 'State', value: lab.state, icon: 'map' },
          { label: 'Turnaround', value: `${lab.turnaroundDays} days`, icon: 'schedule' },
          { label: 'Valid Until', value: lab.validUntil, icon: 'event' },
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
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Testing Disciplines</h3>
            <div className="flex flex-wrap gap-2">
              {lab.disciplines.map(d => <span key={d} className="px-3 py-1.5 rounded-lg bg-surface-container-low font-mono text-[13px] text-on-surface-variant">{d}</span>)}
            </div>
          </div>
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Accredited For</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lab.accreditedFor.map(item => (
                <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                  <span className="text-[13px] text-on-surface">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-3">Standards Scope</h3>
            <div className="flex flex-wrap gap-2">
              {lab.testingScopes.map(scope => <TechIdentifier key={scope} code={scope} size="md" />)}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
            <h3 className="text-[14px] font-semibold text-primary mb-3">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-[13px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] mt-0.5 shrink-0">location_on</span>
                {lab.address}
              </p>
              <p className="text-[13px] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] shrink-0">phone</span>
                {lab.phone}
              </p>
              <p className="text-[13px] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] shrink-0">mail</span>
                {lab.email}
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
            <p className="text-[12px] font-mono text-on-surface-variant mb-3">Accreditation valid: {lab.lastRenewal} → {lab.validUntil}</p>
            <a href={lab.nabl_scope_url} className="inline-flex items-center gap-2 text-[13px] text-secondary hover:underline">
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              {t('labs.view_scope')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
