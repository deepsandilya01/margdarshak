import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ProcessGuide({ query }: { query: string }) {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.pg-stagger', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, { scope: container });

  const steps = [
    { num: '01', title: 'Understand Product Requirement', desc: 'Determine if your product falls under mandatory certification (like CRO or QCO) by checking the HS code and BIS schedules.', action: 'Check Applicability' },
    { num: '02', title: 'Identify Applicable Standard', desc: 'Find the exact Indian Standard (IS) that dictates the safety and testing requirements for your specific product category.', action: 'Search Standards' },
    { num: '03', title: 'Complete Testing', desc: 'Submit product samples to a NABL-accredited or BIS-recognized laboratory for testing against the applicable standard.', action: 'Find Labs' },
    { num: '04', title: 'Submit Application', desc: 'Compile the test report and required documents, and submit the application via the BIS Manakonline portal.', action: 'View Portal' },
    { num: '05', title: 'Maintain Compliance', desc: 'Once granted, affix the ISI mark or CRS label correctly. Renew the licence periodically and undergo surveillance audits.', action: null },
  ];

  return (
    <div ref={container} className="space-y-8 max-w-3xl pb-10">
      <div className="pg-stagger space-y-2 border-b border-outline-variant pb-6">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">PROCESS GUIDE</div>
        <h1 className="font-serif-hero text-[32px] sm:text-[40px] leading-tight text-primary">"{query}"</h1>
      </div>

      <div className="space-y-6 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-surface-container-high hidden sm:block" />

        {steps.map((step) => (
          <div key={step.num} className="pg-stagger flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-10">
            {/* Number indicator */}
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-surface border-2 border-primary/20 flex items-center justify-center shadow-sm">
              <span className="font-mono text-[16px] font-bold text-primary">{step.num}</span>
            </div>

            {/* Content card */}
            <div className="flex-1 glossy-card bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-sm space-y-2 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-[16px] font-bold text-on-surface">{step.title}</h3>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                {step.desc}
              </p>
              {step.action && (
                <div className="pt-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold text-primary uppercase tracking-wider transition-colors border border-outline-variant/30">
                    <span>{step.action}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pg-stagger pt-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary-container/30 border border-secondary/20">
          <span className="material-symbols-outlined text-secondary text-[24px]">info</span>
          <p className="text-[12px] text-on-surface-variant">
            This is a generalized pathway. The exact timeline and requirements may vary depending on whether the product falls under Scheme I (ISI Mark) or Scheme II (CRS).
          </p>
        </div>
      </div>
    </div>
  );
}
