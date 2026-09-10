import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TranslatingText } from '../../components/shared/TranslatingText';
import { TechIdentifier } from '../../components/shared/StatusPill';
import { EvidenceBadge } from '../../components/shared/EvidenceBadge';
import mockReports from '../../data/reports.json';
import type { Report } from '../../types/report';

export default function ReportPreview() {
  const { id } = useParams<{ id: string }>();
  const report = (mockReports as Report[]).find(r => r.id === id) || mockReports[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-bg-base min-h-[calc(100vh-64px)]">
      {/* Action Bar - Hidden on Print */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link to="/reports" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[14px] font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <TranslatingText text="Back to Reports" />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-on-surface hover:border-primary/50 transition-all font-medium text-[14px]"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <TranslatingText text="Print PDF" />
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all font-medium text-[14px]">
            <span className="material-symbols-outlined text-[18px]">share</span>
            <TranslatingText text="Share" />
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-surface sm:border border-outline-variant/30 sm:rounded-2xl sm:shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Report Header */}
        <div className="p-6 sm:p-10 border-b border-outline-variant/30 bg-surface-container-lowest">
          <div className="flex justify-between items-start mb-8">
            <img src="/logo.png" alt="BIS" className="h-12 w-auto object-contain grayscale opacity-80" />
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant mb-1">Report ID</p>
              <p className="text-[13px] font-mono font-medium text-on-surface bg-surface-container px-2 py-1 rounded">{report.id}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[11px] font-bold uppercase tracking-wider">
              {report.type}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
              report.status === 'Final' ? 'bg-status-verified/10 text-status-verified border-status-verified/20' : 'bg-status-pending-spec/10 text-status-pending-spec border-status-pending-spec/20'
            }`}>
              {report.status}
            </span>
          </div>
          
          <h1 className="text-h1 font-serif-hero text-on-surface mb-4 leading-tight">
            <TranslatingText text={report.name} />
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[13px] text-on-surface-variant">
            <div>
              <span className="block text-[10px] uppercase tracking-widest mb-1 opacity-70">Generated</span>
              <span className="font-medium text-on-surface">{new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            {report.productContext && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest mb-1 opacity-70">Product Context</span>
                <span className="font-medium text-on-surface"><TranslatingText text={report.productContext} /></span>
              </div>
            )}
          </div>
        </div>

        {/* Report Body */}
        <div className="p-6 sm:p-10">
          <div className="mb-10 p-5 bg-surface-container-low rounded-xl border-l-4 border-l-primary">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Executive Summary</h3>
            <p className="text-[15px] leading-relaxed text-on-surface">
              <TranslatingText text={report.summary} />
            </p>
          </div>

          <div className="space-y-8">
            {report.sections.map((section, idx) => (
              <div key={idx} className="print-break-inside-avoid">
                <h2 className="text-[18px] font-bold text-on-surface mb-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[12px] font-mono text-primary border border-outline-variant/30">
                    {idx + 1}
                  </span>
                  <TranslatingText text={section.heading} />
                </h2>
                <p className="text-[15px] leading-relaxed text-on-surface-variant pl-9">
                  <TranslatingText text={section.content} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence & References */}
        <div className="p-6 sm:p-10 border-t border-outline-variant/30 bg-surface-container-lowest print-break-inside-avoid">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Verified Evidence
              </h3>
              <ul className="space-y-3">
                {report.evidence.map(ev => (
                  <li key={ev.id} className="flex flex-col gap-1 p-3 bg-surface rounded-lg border border-outline-variant/30">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[13px] font-semibold text-on-surface">{ev.source}</span>
                      <EvidenceBadge status={ev.status} compact />
                    </div>
                    <span className="text-[12px] text-on-surface-variant">{ev.document}</span>
                    <span className="text-[11px] font-mono bg-surface-container-low w-fit px-1.5 py-0.5 rounded text-on-surface-variant">{ev.section}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                References
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.references.map(ref => (
                  <TechIdentifier key={ref} code={ref} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 text-center text-[11px] text-on-surface-variant/60 font-mono hidden print:block">
          Official BIS-SATHI Compliance Report • Generated {new Date().toISOString()} • Confidential
        </div>
      </motion.div>
    </div>
  );
}
