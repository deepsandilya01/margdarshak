import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TechIdentifier } from '@/components/feedback/StatusPill';

export default function ComparisonTray() {
  const { comparisonItems, removeFromComparison, clearComparison, isTrayOpen, setTrayOpen } = useWorkspace();

  if (comparisonItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="max-w-[1440px] mx-auto px-0 sm:px-8 pb-0 sm:pb-4 flex justify-end pointer-events-auto">
        {/* Collapsed tab */}
        {!isTrayOpen ? (
          <button
            onClick={() => setTrayOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:rounded-t-2xl bg-primary text-white text-[14px] font-semibold shadow-[0_-4px_16px_rgba(0,0,0,0.1)] sm:shadow-lg hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
            Comparing {comparisonItems.length} items
            <span className="w-5 h-5 rounded-full bg-secondary font-mono text-[11px] flex items-center justify-center font-bold">{comparisonItems.length}</span>
            <span className="material-symbols-outlined text-[18px]">expand_less</span>
          </button>
        ) : (
          <div className="w-full sm:max-w-3xl bg-primary sm:rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.15)] sm:shadow-xl sm:border-t sm:border-secondary/30 flex flex-col max-h-[50vh]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 gap-3 sm:gap-0">
              <div className="flex items-center justify-between sm:justify-start gap-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                  <span className="font-semibold text-[14px]">Comparison Tray ({comparisonItems.length} / 4)</span>
                </div>
                {/* Mobile close button */}
                <button
                  onClick={() => setTrayOpen(false)}
                  className="sm:hidden p-1.5 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/compare"
                  className="flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg bg-secondary text-white text-[13px] font-medium hover:bg-[#0039b5] transition-colors"
                >
                  Open Comparison
                </Link>
                <button
                  onClick={clearComparison}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 text-[13px] hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
                {/* Desktop close button */}
                <button
                  onClick={() => setTrayOpen(false)}
                  className="hidden sm:block p-1.5 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 overflow-x-auto">
              {comparisonItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 shrink-0 max-w-[200px] sm:max-w-[240px]">
                  <TechIdentifier code={item.label} size="sm" />
                  <span className="text-white/80 text-[12px] truncate">{item.title}</span>
                  <button
                    onClick={() => removeFromComparison(item.id)}
                    className="text-white/50 hover:text-white transition-colors shrink-0 ml-auto"
                    aria-label={`Remove ${item.label}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
              {comparisonItems.length < 4 && (
                <div className="flex items-center gap-2 border-2 border-dashed border-white/20 rounded-xl px-4 py-2 text-white/40 text-[12px] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add item
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
