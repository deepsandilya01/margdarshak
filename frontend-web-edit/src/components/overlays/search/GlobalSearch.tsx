import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { useQCOs } from '@/features/qco/hooks/useQCOs';
import { useLabs } from '@/features/laboratories/hooks/useLabs';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_QUERIES = [
  { label: 'IS 1293:2019 (Plugs)', icon: 'electrical_services', path: '/standards/IS-1293-2019' },
  { label: 'Electric Vehicles (IS 17017)', icon: 'electric_bolt', path: '/standards/IS-17017-P1-2018' },
  { label: 'Packaged Drinking Water', icon: 'water_drop', path: '/standards/IS-14543-2016' },
  { label: 'Solar Inverters (IS 11933)', icon: 'solar_power', path: '/standards/IS-11933-2023' },
  { label: 'Toys Safety QCO', icon: 'smart_toy', path: '/qco/QCO-DPIIT-2020-Toys' },
  { label: 'Gold Jewelry Hallmark', icon: 'diamond', path: '/hallmarking' },
];

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { standards } = useStandards({ search: query || undefined });
  const { qcos } = useQCOs({ search: query || undefined });
  const { labs } = useLabs({ search: query || undefined });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    return {
      standards: standards.slice(0, 3),
      qcos: qcos.slice(0, 2),
      labs: labs.slice(0, 2),
    };
  }, [query, standards, qcos, labs]);

  const hasResults = results && (results.standards.length + results.qcos.length + results.labs.length) > 0;

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4"
      >
        <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-[0_12px_24px_-4px_rgba(15,23,42,0.12)] overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-container-low">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">manage_search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search IS Code, QCO, Lab, product…"
              className="flex-1 text-[15px] text-on-surface placeholder:text-on-surface-variant bg-transparent outline-none"
              aria-label="Global search input"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <kbd className="px-2 py-1 bg-surface-container-low text-on-surface-variant font-mono text-[11px] rounded shadow-sm shrink-0">ESC</kbd>
          </div>

          {/* Results / Default state */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant px-2 mb-2">Popular Queries</p>
                  <div className="grid grid-cols-2 gap-1">
                    {POPULAR_QUERIES.map(q => (
                      <button
                        key={q.path}
                        onClick={() => handleSelect(q.path)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-[13px] text-on-surface hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-secondary transition-colors">{q.icon}</span>
                        <span className="truncate">{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-surface-container-low pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant px-2 mb-2">Quick Access</p>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: 'Standards', icon: 'menu_book', path: '/standards' },
                      { label: 'QCOs', icon: 'gavel', path: '/qco' },
                      { label: 'Laboratories', icon: 'science', path: '/laboratories' },
                      { label: 'AI Sathi', icon: 'auto_awesome', path: '/ai-sathi' },
                      { label: 'Workspace', icon: 'space_dashboard', path: '/workspace' },
                      { label: 'Resources', icon: 'library_books', path: '/resources' },
                    ].map(item => (
                      <button
                        key={item.path}
                        onClick={() => handleSelect(item.path)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span className="text-[11px] font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : !hasResults ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-[32px] text-[#c4c6ce] block mb-2">search_off</span>
                <p className="text-[14px] font-medium text-on-surface">No results found</p>
                <p className="text-[13px] text-on-surface-variant">Try a different search term</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {/* Standards */}
                {results!.standards.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant px-3 py-2">Standards</p>
                    {results!.standards.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSelect(`/standards/${s.id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">menu_book</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-[13px] text-[var(--tech-id-text)]">{s.code}</span>
                          </div>
                          <p className="text-[12px] text-on-surface-variant truncate">{s.shortTitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-[14px] text-[#c4c6ce] group-hover:text-on-surface-variant">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* QCOs */}
                {results!.qcos.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant px-3 py-2">Quality Control Orders</p>
                    {results!.qcos.map(q => (
                      <button
                        key={q.id}
                        onClick={() => handleSelect(`/qco/${q.id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">gavel</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono font-medium text-[13px] text-[var(--tech-id-text)]">{q.code}</div>
                          <p className="text-[12px] text-on-surface-variant truncate">{q.shortTitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-[14px] text-[#c4c6ce] group-hover:text-on-surface-variant">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Labs */}
                {results!.labs.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant px-3 py-2">Laboratories</p>
                    {results!.labs.map(l => (
                      <button
                        key={l.id}
                        onClick={() => handleSelect(`/laboratories/${l.id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">science</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono font-medium text-[13px] text-[var(--tech-id-text)]">{l.accreditationNumber}</div>
                          <p className="text-[12px] text-on-surface-variant truncate">{l.name}</p>
                        </div>
                        <span className="material-symbols-outlined text-[14px] text-[#c4c6ce] group-hover:text-on-surface-variant">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-surface-container-low bg-background">
            <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-high rounded font-mono">↵</kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-high rounded font-mono">↑↓</kbd> Navigate</span>
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant">
              {query && hasResults ? `${results!.standards.length + results!.qcos.length + results!.labs.length} results` : ''}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
