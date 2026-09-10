import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const RESOURCES = [
  { type: 'Guide', icon: 'menu_book', title: 'BIS Certification Schemes — Complete Guide for Manufacturers', desc: 'A comprehensive guide to Scheme I (ISI Mark Licence), Scheme II (CRS Registration), and Scheme X (Self-Declaration).', date: '2025', size: '2.4 MB', tags: ['certification', 'scheme'] },
  { type: 'FAQ', icon: 'quiz', title: 'Frequently Asked Questions — QCO Mandatory Compliance', desc: 'Answers to common questions about mandatory Quality Control Orders, exemption criteria, and penalty provisions.', date: '2025', size: '0.8 MB', tags: ['QCO', 'FAQ'] },
  { type: 'Circular', icon: 'article', title: 'BIS Circular No. 2025-ETD-14: Revision to IS 1293 Scope', desc: 'Circular notifying the expanded scope of IS 1293:2019 to include Type 11 and Type 13 socket adaptors.', date: 'Jun 2025', size: '0.4 MB', tags: ['circular', 'electrical'] },
  { type: 'Gazette Notification', icon: 'policy', title: 'MeitY CRO Phase VI — New Product Categories Added', desc: 'Draft gazette notification expanding the Compulsory Registration Order to include smartwatch chargers and wireless charging pads.', date: 'Jul 2025', size: '1.2 MB', tags: ['MeitY', 'CRO', 'draft'] },
  { type: 'Guide', icon: 'menu_book', title: 'NABL Laboratory Accreditation — How to Apply and Prepare', desc: 'Step-by-step guide for testing laboratories seeking NABL accreditation in the Electrotechnical discipline.', date: '2024', size: '3.1 MB', tags: ['NABL', 'accreditation', 'labs'] },
];

const TYPE_COLORS: Record<string, string> = {
  'Guide': 'bg-[var(--status-compliant-bg)] text-[var(--status-compliant-text)] border-[var(--status-compliant-border)]',
  'FAQ': 'bg-[#eff6ff] text-secondary border-[#bfdbfe]',
  'Circular': 'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-[var(--status-pending-border)]',
  'Gazette Notification': 'bg-[var(--tech-id-bg)] text-[var(--tech-id-text)] border-[var(--tech-id-border)]',
};

export default function ResourcesLibrary() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">library_books</span>
          <span>Knowledge Repository</span>
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">{t('resources.title')}</h1>
        <p className="text-body-md text-on-surface-variant">{t('resources.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5 bg-surface-container-low rounded-xl p-1 w-fit">
        {['All', 'Guide', 'Circular', 'Gazette Notification', 'FAQ'].map(f => (
          <button key={f} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${f === 'All' ? 'bg-surface text-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {f}
          </button>
        ))}
      </div>



      <div className="space-y-3">
        {RESOURCES.map(r => (
          <div key={r.title} className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm p-5 hover:border-outline-variant transition-all">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">{r.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${TYPE_COLORS[r.type] ?? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'}`}>
                      {r.type}
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant">{r.date}</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">{r.size}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-primary mb-1">{r.title}</h3>
                  <p className="text-[13px] text-on-surface-variant leading-5">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {r.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[11px] text-on-surface-variant">{tag}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant text-[13px] font-medium hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  {t('resources.view')}
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  {t('resources.download')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
