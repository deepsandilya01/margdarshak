import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TechIdentifier, StatusPill } from '@/components/feedback/StatusPill';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Link } from 'react-router-dom';

export default function ComparisonWorkspace() {
  const { comparisonItems, removeFromComparison, clearComparison } = useWorkspace();

  if (comparisonItems.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-8 py-16">
        <EmptyState
          icon="compare_arrows"
          title="Comparison Workspace is Empty"
          description="Add standards, QCOs, or labs to the comparison tray to view them side-by-side."
          action={<Link to="/standards" className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">Browse Standards</Link>}
        />
      </div>
    );
  }

  // Get all unique attribute keys across all items
  const allKeys = Array.from(
    new Set(comparisonItems.flatMap(item => Object.keys(item.attributes || {})))
  );

  const exportCsv = () => {
    const rows = [
      ['Attribute', ...comparisonItems.map(item => item.label)],
      ...allKeys.map(key => [key, ...comparisonItems.map(item => item.attributes?.[key] ?? '')]),
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bis-sathi-comparison.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary">
            <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
            <span>Technical Analysis</span>
          </div>
          <h1 className="text-headline-lg text-primary tracking-tight">Comparison Workspace</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearComparison}
            className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant text-[14px] font-medium hover:bg-surface-container-low transition-colors"
          >
            Clear All
          </button>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-surface-container-low border-b border-r border-outline-variant/30 min-w-[200px] w-1/5 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                Attribute
              </th>
              {comparisonItems.map(item => (
                <th key={item.id} className="p-4 bg-surface border-b border-outline-variant/30 min-w-[250px] relative group">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <TechIdentifier code={item.label} size="sm" />
                      <button
                        onClick={() => removeFromComparison(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#ffdad6] text-on-surface-variant hover:text-[var(--status-verify-text)] transition-all absolute top-2 right-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <span className="text-[14px] font-semibold text-primary leading-5">{item.title}</span>
                    <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${
                      item.type === 'standard' ? 'bg-[var(--tech-id-bg)] text-[var(--tech-id-text)] border-[var(--tech-id-border)]' :
                      item.type === 'qco' ? 'bg-[var(--status-verify-bg)] text-[var(--status-verify-text)] border-[var(--status-verify-border)]' :
                      'bg-[var(--status-compliant-bg)] text-[var(--status-compliant-text)] border-[var(--status-compliant-border)]'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key, i) => (
              <tr key={key} className={i % 2 === 0 ? 'bg-background' : 'bg-surface'}>
                <td className="p-4 border-r border-outline-variant/30 text-[13px] font-medium text-on-surface-variant bg-surface-container-low/50">
                  {key}
                </td>
                {comparisonItems.map(item => {
                  const val = item.attributes?.[key];
                  return (
                    <td key={`${item.id}-${key}`} className="p-4 text-[13px] text-on-surface border-b border-outline-variant/30">
                      {key.toLowerCase() === 'status' && val ? (
                         <StatusPill status={val.toLowerCase() as any} size="sm" />
                      ) : (
                        val ?? <span className="text-[#94a3b8] italic">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
