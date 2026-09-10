import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

export default function CertificationPage() {
  const { t } = useLanguage();

  const schemes = [
    {
      id: 'scheme-I',
      name: 'Scheme-I (ISI Mark)',
      desc: 'Mandatory certification scheme for products affecting health, safety, and mass consumption (e.g., Cement, Steel, Electrical appliances).',
      badge: 'ISI Mark',
      icon: 'verified',
    },
    {
      id: 'scheme-II',
      name: 'Scheme-II (CRS)',
      desc: 'Compulsory Registration Scheme typically for Electronics & IT goods under MeitY orders.',
      badge: 'CRS Registration',
      icon: 'devices',
    },
    {
      id: 'scheme-IV',
      name: 'Scheme-IV (Grant of Certificate of Conformity)',
      desc: 'For specific products requiring certification without the standard mark usage.',
      badge: 'CoC',
      icon: 'assignment_turned_in',
    },
    {
      id: 'scheme-X',
      name: 'Scheme-X (Self-Declaration)',
      desc: 'Self-declaration of conformity for lower-risk products where manufacturer claims compliance.',
      badge: 'SDOC',
      icon: 'fact_check',
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">workspace_premium</span>
          <span>Compliance Frameworks</span>
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">Certification Schemes</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Explore the active certification schemes under the Bureau of Indian Standards (Conformity Assessment) Regulations, 2018.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schemes.map(s => (
          <div key={s.id} className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:border-outline-variant transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[18px] font-semibold text-primary">{s.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-[11px] font-mono tracking-wide">{s.badge}</span>
                </div>
                <p className="text-[14px] text-on-surface-variant leading-6 mb-4">{s.desc}</p>
                <Link
                  to="/workspace"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-secondary hover:text-[#0039b5] transition-colors"
                >
                  Start Application
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
