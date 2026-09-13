import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HallmarkingPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#d97706]">
          <span className="material-symbols-outlined text-[15px]">diamond</span>
          <span>Precious Metals Integrity</span>
        </div>
        <h1 className="text-headline-lg text-primary tracking-tight">Hallmarking & Gold Quality</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/3 bg-[var(--status-pending-bg)] p-6 rounded-xl border border-[var(--status-pending-border)] text-center">
           <span className="material-symbols-outlined text-[48px] text-[#d97706] mb-3">verified</span>
           <h3 className="text-[18px] font-semibold text-[var(--status-pending-text)] mb-2">HUID (Hallmark Unique Identification)</h3>
           <p className="text-[13px] text-[#92400e]">
             A six-digit alphanumeric code engraved on every piece of jewelry to ensure traceability and authenticity.
           </p>
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <h3 className="text-[16px] font-semibold text-primary">Mandatory Hallmarking</h3>
          <p className="text-[14px] text-on-surface-variant leading-6">
            Gold hallmarking is now mandatory for jewellers in specified districts across India. The government has phased out older hallmarking standards to ensure consumers receive pure gold.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="font-mono text-[14px] font-bold text-secondary mb-1">14K, 18K, 20K, 22K, 23K, 24K</div>
              <div className="text-[12px] text-on-surface-variant">Permitted Gold Grades</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="font-mono text-[14px] font-bold text-secondary mb-1">AHC Registration</div>
              <div className="text-[12px] text-on-surface-variant">Assaying & Hallmarking Centers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verify HUID Tool Placeholder */}
      <div className="bg-primary-container rounded-2xl p-8 text-white text-center max-w-3xl mx-auto shadow-md">
        <span className="material-symbols-outlined text-[32px] text-[#afc8ed] mb-3">qr_code_scanner</span>
        <h3 className="text-[20px] font-semibold mb-2">Verify HUID Number</h3>
        <p className="text-[14px] text-[#7a93b5] mb-6">Enter the 6-digit HUID code from your jewelry to verify its purity and the AHC details.</p>
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <input
            type="text"
            placeholder="e.g. A1B2C3"
            maxLength={6}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center font-mono text-[16px] tracking-widest outline-none focus:border-white/50 uppercase text-white placeholder:text-white/30"
          />
          <button className="px-6 py-3 bg-secondary hover:bg-[#0039b5] text-white rounded-xl font-semibold transition-colors">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
