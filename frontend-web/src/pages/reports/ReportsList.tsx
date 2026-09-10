import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { TechIdentifier, StatusPill } from '../../components/shared/StatusPill';

export default function ReportsList() {
  const { t } = useLanguage();

  const REPORTS = [
    { id: 'REP-2025-001', type: 'Dossier Audit', product: 'EV Battery Pack', date: '10 Sep 2025', status: 'compliant' },
    { id: 'REP-2025-002', type: 'Lab Test Results', product: 'Smartwatch Charger', date: '05 Sep 2025', status: 'pending' },
    { id: 'REP-2025-003', type: 'QCO Gap Analysis', product: 'AC Motors', date: '22 Aug 2025', status: 'verify' },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <span className="material-symbols-outlined text-[15px]">summarize</span>
          <span>Documentation</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-headline-lg text-primary tracking-tight">Compliance Reports</h1>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Generate New Report
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              {['Report ID', 'Type & Product', 'Generated', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`py-3 px-5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant ${i === 4 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPORTS.map(r => (
              <tr key={r.id} className="hover:bg-background transition-colors border-b border-surface-container-low last:border-0">
                <td className="py-4 px-5 whitespace-nowrap">
                  <TechIdentifier code={r.id} size="md" />
                </td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-primary text-[14px]">{r.type}</div>
                  <div className="text-[12px] text-on-surface-variant">{r.product}</div>
                </td>
                <td className="py-4 px-5 whitespace-nowrap font-mono text-[12px] text-on-surface-variant">
                  {r.date}
                </td>
                <td className="py-4 px-5 whitespace-nowrap">
                  <StatusPill status={r.status as any} size="sm" customLabel={r.status === 'compliant' ? 'Verified' : r.status === 'pending' ? 'In Review' : 'Needs Fixes'} />
                </td>
                <td className="py-4 px-5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-[12px] transition-colors flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">print</span>
                      Print
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[16px]">more_vert</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
