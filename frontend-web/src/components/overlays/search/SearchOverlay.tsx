import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animate In
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(panelRef.current, 
        { y: -20, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(panelRef.current, { y: -10, opacity: 0, scale: 0.98, duration: 0.2, ease: 'power2.in', onComplete: onClose });
  };

  const handleSearch = () => {
    if (query.trim()) {
      handleClose();
      navigate(`/standards?q=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-start justify-center md:pt-[10vh] md:px-4 bg-background/80 backdrop-blur-md">
      <div className="absolute inset-0 hidden md:block" onClick={handleClose} />
      
      <div ref={panelRef} className="relative w-full h-full md:h-auto md:max-w-3xl bg-surface md:rounded-2xl shadow-2xl md:border border-outline-variant/30 overflow-hidden flex flex-col md:max-h-[80vh]">
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-outline-variant/30 bg-surface focus-within:bg-surface-container-lowest transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">search</span>
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') handleClose();
            }}
            placeholder="Search standards, QCOs, labs, or products..."
            className="flex-1 bg-transparent border-none outline-none text-[16px] md:text-[18px] text-on-surface placeholder:text-on-surface-variant font-medium focus:ring-0"
          />
          <button onClick={handleClose} className="w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[24px] md:text-[20px]">close</span>
          </button>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3 px-2">Recent Searches</div>
                <div className="space-y-1">
                  {['IS 16046 (Batteries)', 'Toys Safety QCO', 'NABL Labs in Delhi'].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-outline">history</span>
                      <span className="text-[14px] font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3 px-2">Categories</div>
                <div className="space-y-1">
                  {['Electronics & IT', 'Automotive & EV', 'Chemicals & Polymers'].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-secondary">category</span>
                      <span className="text-[14px] font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-3 px-2">Suggested Results</div>
              <div className="space-y-2">
                {[
                  { title: `IS 1293 for ${query}`, type: 'Standard', desc: 'Plugs and socket-outlets of rated voltage up to and including 250 volts.' },
                  { title: `${query} Testing Protocol`, type: 'QCO Mandate', desc: 'Mandatory testing requirements for compliance verification.' },
                  { title: `Labs authorized for ${query}`, type: 'Laboratory', desc: 'View NABL-accredited facilities capable of executing tests.' }
                ].map((res, i) => (
                  <button key={i} onClick={handleSearch} className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low text-left transition-colors border border-transparent hover:border-outline-variant">
                    <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">
                      {res.type === 'Standard' ? 'menu_book' : res.type === 'Laboratory' ? 'science' : 'gavel'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-primary">{res.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">{res.type}</span>
                      </div>
                      <div className="text-[12px] text-on-surface-variant">{res.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer shortcuts */}
        <div className="border-t border-outline-variant px-6 py-3 flex items-center gap-4 bg-surface-container-lowest text-[11px] font-mono text-on-surface-variant">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container border border-outline-variant rounded text-on-surface">↵</kbd> to search</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container border border-outline-variant rounded text-on-surface">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
