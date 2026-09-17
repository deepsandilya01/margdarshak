import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ComparisonWorkspace({ query }: { query: string }) {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.cw-stagger', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: container });

  const comparisonData = [
    { attr: 'Scope', a: 'General purpose portable lithium cells and batteries.', b: 'Secondary lithium cells and batteries for EV applications.', diff: 'IS 16046 applies to general electronics, IS 17387 is strictly for EVs.' },
    { attr: 'Testing Requirements', a: 'Basic thermal and electrical abuse tests.', b: 'Rigorous vibration, shock, and extended thermal propagation tests.', diff: 'EV standard requires severe mechanical and thermal propagation testing.' },
    { attr: 'Certification Route', a: 'Scheme II (CRS)', b: 'Scheme II (CRS) with additional safety declarations.', diff: 'Similar route, higher documentation burden for EVs.' },
  ];

  return (
    <div ref={container} className="space-y-8 max-w-5xl pb-10">
      <div className="cw-stagger space-y-2 border-b border-outline-variant pb-6">
        <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">COMPARISON WORKSPACE</div>
        <h1 className="font-serif-hero text-[32px] sm:text-[40px] leading-tight text-primary">"{query}"</h1>
      </div>

      <div className="cw-stagger bg-surface border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/50">
                <th className="p-4 font-mono text-[11px] font-bold tracking-widest text-on-surface-variant w-1/4">ATTRIBUTE</th>
                <th className="p-4 font-mono text-[11px] font-bold tracking-widest text-primary w-1/4">IS 16046 (Part 2)</th>
                <th className="p-4 font-mono text-[11px] font-bold tracking-widest text-secondary w-1/4">IS 17387</th>
                <th className="p-4 font-mono text-[11px] font-bold tracking-widest text-on-surface-variant w-1/4">KEY DIFFERENCE</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 text-[13px] font-semibold text-on-surface">{row.attr}</td>
                  <td className="p-4 text-[13px] text-on-surface-variant leading-relaxed">{row.a}</td>
                  <td className="p-4 text-[13px] text-on-surface-variant leading-relaxed">{row.b}</td>
                  <td className="p-4 text-[12px] font-medium text-primary bg-primary/5 leading-relaxed">{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-outline-variant/30">
          {comparisonData.map((row, i) => (
            <div key={i} className="p-5 space-y-4">
              <h3 className="font-mono text-[11px] font-bold tracking-widest text-on-surface">{row.attr}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-[9px] text-primary mb-1">IS 16046 (Part 2)</div>
                  <p className="text-[12px] text-on-surface-variant">{row.a}</p>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-secondary mb-1">IS 17387</div>
                  <p className="text-[12px] text-on-surface-variant">{row.b}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="font-mono text-[9px] font-bold text-primary block mb-1">DIFFERENCE</span>
                <p className="text-[12px] text-on-surface">{row.diff}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
