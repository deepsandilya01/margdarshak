import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ApplicabilityAnalysis({ query }: { query: string }) {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.aa-stagger', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: container });

  const analysisData = {
    product: 'Secondary lithium battery pack for EV applications.',
    standards: ['IS 16046 (Part 2) : 2018', 'IS 17387 : 2020'],
    reason: 'The product falls under the MeitY Compulsory Registration Order Phase V scope. Registration is mandatory before market entry.',
    status: 'CONFIRMED',
    qcoStatus: 'ACTIVE',
    testing: 'Thermal abuse, overcharge, forced discharge, short circuit tests are required.',
    certification: 'Scheme II - CRS Registration',
  };

  return (
    <div ref={container} className="space-y-8 max-w-4xl pb-10">
      <div className="aa-stagger space-y-2 border-b border-outline-variant pb-6">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">APPLICABILITY ANALYSIS</div>
        <h1 className="font-serif-hero text-[32px] sm:text-[40px] leading-tight text-primary">"{query}"</h1>
      </div>

      <div className="aa-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Card */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">PRODUCT UNDERSTANDING</span>
            <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
          </div>
          <p className="text-[14px] text-on-surface font-medium leading-relaxed">{analysisData.product}</p>
        </div>

        {/* Standard Card */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">APPLICABLE STANDARDS</span>
            <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysisData.standards.map(std => (
              <span key={std} className="px-2.5 py-1 rounded-md bg-surface-container font-mono text-[12px] font-semibold text-primary">{std}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Applicability Reason (AI Insight) */}
      <div className="aa-stagger glossy-card bg-surface p-6 rounded-2xl border border-outline-variant/50 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
          <h3 className="font-mono text-[11px] font-bold tracking-[0.15em] text-secondary">AI INSIGHT: APPLICABILITY</h3>
        </div>
        <p className="text-[15px] leading-relaxed text-on-surface">{analysisData.reason}</p>
        
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-outline-variant/50 pt-5">
          <div>
            <div className="font-mono text-[9px] text-on-surface-variant mb-1">REGULATORY STATUS</div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-compliant-bg text-status-compliant-text font-mono text-[10px] font-bold tracking-wider border border-status-compliant-border">
              <span className="w-1.5 h-1.5 rounded-full bg-status-compliant-dot" />
              {analysisData.status}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] text-on-surface-variant mb-1">QCO STATUS</div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-pending-bg text-status-pending-text font-mono text-[10px] font-bold tracking-wider border border-status-pending-border">
              <span className="w-1.5 h-1.5 rounded-full bg-status-pending-dot" />
              {analysisData.qcoStatus}
            </div>
          </div>
        </div>
      </div>

      <div className="aa-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Testing */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">TESTING REQUIREMENTS</span>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">{analysisData.testing}</p>
          <button className="text-[11px] font-mono font-bold text-primary hover:underline mt-2 flex items-center gap-1">
            VIEW TESTING PROTOCOLS <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Certification */}
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-sm space-y-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">CERTIFICATION PATHWAY</span>
          <p className="text-[13px] text-on-surface-variant leading-relaxed font-semibold">{analysisData.certification}</p>
          <button className="text-[11px] font-mono font-bold text-primary hover:underline mt-2 flex items-center gap-1">
            VIEW PROCESS GUIDE <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
