import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function KnowledgeAnswer({ query }: { query: string }) {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.ka-stagger', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: container });

  return (
    <div ref={container} className="space-y-8 max-w-3xl pb-10">
      <div className="ka-stagger space-y-2 border-b border-outline-variant pb-6">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">AI SATHI ANSWER</div>
        <h1 className="font-serif-hero text-[32px] sm:text-[40px] leading-tight text-primary">"{query}"</h1>
      </div>

      <div className="ka-stagger space-y-4">
        <p className="text-[16px] leading-relaxed text-on-surface">
          The Bureau of Indian Standards (BIS) is the National Standards Body of India, functioning under the Ministry of Consumer Affairs, Food & Public Distribution. It is responsible for the harmonious development of the activities of standardization, marking, and quality certification of goods.
        </p>
      </div>

      <div className="ka-stagger space-y-4 pt-4">
        <h3 className="font-mono text-[11px] font-bold tracking-[0.15em] text-on-surface-variant">KEY POINTS</h3>
        <ul className="space-y-3">
          {[
            'Established by the BIS Act, 2016.',
            'Formulates Indian Standards (IS) for various products and processes.',
            'Operates product certification schemes (e.g., ISI mark, CRS registration).',
            'Manages hallmarking of precious metals like gold and silver.'
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
              <span className="text-[14px] text-on-surface leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ka-stagger glossy-card bg-surface-container-low/40 border border-outline-variant/50 p-5 rounded-xl space-y-2 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
        <h3 className="font-mono text-[11px] font-bold tracking-[0.15em] text-secondary">WHY IT MATTERS</h3>
        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          BIS ensures traceability and accountability in manufacturing, protecting consumers from substandard products. Without BIS certification, many critical products (like electronics and toys) cannot legally be sold in India under active Quality Control Orders (QCOs).
        </p>
      </div>

      <div className="ka-stagger space-y-4 pt-6 border-t border-outline-variant/50">
        <h3 className="font-mono text-[11px] font-bold tracking-[0.15em] text-on-surface-variant">EXPLORE MORE</h3>
        <div className="flex flex-wrap gap-3">
          {['ISI Mark', 'Certification', 'Standards', 'Hallmarking'].map(topic => (
            <button key={topic} className="px-4 py-2 bg-surface border border-outline-variant/60 rounded-lg text-[13px] font-medium text-primary hover:bg-surface-container-low hover:border-primary transition-colors shadow-sm">
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
