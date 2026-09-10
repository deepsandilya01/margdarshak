import React, { useEffect, useRef, useState } from 'react';
import { EvidenceDrawer } from '../../components/shared/EvidenceBadge';
import type { Evidence } from '../../types/evidence';

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type ResearchState = 'idle' | 'understanding' | 'standards' | 'applicability' | 'complete';

const commands = [
  { tag: 'STANDARDS', color: 'var(--primary)', text: 'Which standards apply to EV batteries?' },
  { tag: 'TESTING', color: 'var(--secondary)', text: 'What testing is required for IS 1293?' },
  { tag: 'QCO', color: 'var(--accent-green)', text: 'Explain the Toys QCO requirements.' },
  { tag: 'LABS', color: 'var(--primary)', text: 'Find NABL labs for Solar Inverters.' },
];

const dossierSections = [
  { id: 'product', number: '01', title: 'Product Understanding', copy: 'The query concerns a secondary lithium battery pack intended for an electric vehicle application.', citation: 'IS 16046-2 §1' },
  { id: 'standard', number: '02', title: 'Applicable Standard', copy: 'IS 16046 (Part 2):2018 defines the safety requirements for secondary lithium cells and batteries used in vehicle applications.', citation: 'IS 16046-2 §4.3' },
  { id: 'applicability', number: '03', title: 'Why It May Apply', copy: 'The product falls within the MeitY Compulsory Registration Order Phase V scope. Registration is required before market entry.', citation: 'CRO Phase V · Schedule I' },
  { id: 'requirements', number: '04', title: 'Core Requirements', copy: 'Thermal abuse, overcharge, forced discharge, short circuit, crush, and altitude simulation tests must be completed against the prescribed clauses.', citation: 'IS 16046-2 §7' },
  { id: 'testing', number: '05', title: 'Testing Pathway', copy: 'Use a NABL-accredited laboratory whose scope covers the relevant battery standard and retain the final report with the CRS application.', citation: 'NABL Scope TC-4782' },
  { id: 'certification', number: '06', title: 'Certification', copy: 'The applicable route is Scheme II, CRS Registration. The submission should include product specifications, test reports, and the required BIS declarations.', citation: 'CRS Scheme II' },
  { id: 'next', number: '07', title: 'Next Steps', copy: 'Confirm laboratory scope, complete the test plan, compile the technical dossier, and submit the registration through the BIS portal.', citation: 'BIS Portal · manakonline.in' },
  { id: 'evidence', number: '08', title: 'Evidence Register', copy: 'Primary references are available in the context rail. Select a citation marker to inspect its source record.', citation: 'Evidence index' },
];

const evidenceRecords: Record<string, Evidence> = {
  'IS 16046-2 §1': { id: 'EV-001', status: 'Verified', source: 'BIS Official Website', document: 'IS 16046 (Part 2):2018', section: 'Clause 1 — Scope', revision: 'First Edition (2018)' },
  'IS 16046-2 §4.3': { id: 'EV-002', status: 'Verified', source: 'BIS Official Website', document: 'IS 16046 (Part 2):2018', section: 'Clause 4.3 — Safety Requirements', revision: 'First Edition (2018)' },
  'CRO Phase V · Schedule I': { id: 'EV-003', status: 'Verified', source: 'MeitY Gazette Notification', document: 'CRO Phase V Notification', section: 'Schedule I — Covered Products', revision: '2022 Amendment' },
  'IS 16046-2 §7': { id: 'EV-004', status: 'Verified', source: 'BIS Official Website', document: 'IS 16046 (Part 2):2018', section: 'Clause 7 — Tests', revision: 'First Edition (2018)' },
  'NABL Scope TC-4782': { id: 'EV-005', status: 'Source-backed', source: 'NCET Laboratory, Bengaluru', document: 'NABL Scope TC-4782', section: 'ETD Battery Testing Scope', revision: 'Current scope' },
  'CRS Scheme II': { id: 'EV-006', status: 'Source-backed', source: 'BIS Certification Portal', document: 'CRS Scheme II Registration Guide', section: 'Application Requirements', revision: 'Current guidance' },
  'BIS Portal · manakonline.in': { id: 'EV-007', status: 'Source-backed', source: 'BIS Online Portal', document: 'CRS Application Workflow', section: 'Registration Submission', revision: 'Current workflow' },
  'Evidence index': { id: 'EV-008', status: 'Verified', source: 'BIS-SATHI Evidence Register', document: 'Compiled source index', section: 'Dossier references', revision: '11 September 2026' },
};

export default function AISathiWorkspace() {
  const [researchState, setResearchState] = useState<ResearchState>('idle');
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsVoiceSupported(Boolean(SpeechRecognition));
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]?.transcript ?? '').join(' ').trim();
      if (transcript) setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleResearch = (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || researchState === 'understanding' || researchState === 'standards' || researchState === 'applicability') return;
    setQuery(text);
    setInput('');
    setResearchState('understanding');
    window.setTimeout(() => setResearchState('standards'), 900);
    window.setTimeout(() => setResearchState('applicability'), 1800);
    window.setTimeout(() => setResearchState('complete'), 2800);
  };

  const resetResearch = () => {
    setResearchState('idle');
    setQuery('');
    setInput('');
  };

  const isLoading = researchState !== 'idle' && researchState !== 'complete';

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background text-on-surface">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Toggle research history" className="-ml-1.5 rounded-md p-1.5 text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-low lg:hidden" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <span className="material-symbols-outlined">{isHistoryOpen ? 'close' : 'history'}</span>
          </button>
          <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-primary">AI SATHI <span className="text-on-surface-variant">/ RESEARCH TERMINAL</span></span>
        </div>
        <button type="button" onClick={resetResearch} className="flex items-center gap-1.5 border border-outline-variant bg-surface-container-low px-3 py-1.5 text-[11px] font-semibold text-on-surface transition-colors duration-150 hover:border-primary hover:text-primary">
          <span className="material-symbols-outlined text-[15px]">add</span><span className="hidden sm:inline">New Research</span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <aside className={`absolute inset-y-0 left-0 z-20 flex w-full max-w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface transition-transform duration-150 ease-out lg:relative lg:translate-x-0 ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="border-b border-outline-variant px-4 py-4">
            <label className="flex items-center gap-2 border-b border-outline-variant pb-2 focus-within:border-primary">
              <span className="font-mono text-[15px] text-primary">/</span>
              <input aria-label="Search research history" placeholder="search history" className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-on-surface outline-none placeholder:text-on-surface-variant" />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
            <div className="mb-2 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant">RECENT RESEARCH</div>
            <div>
              {[
                ['STANDARDS', 'IS 16046 Testing Protocols', '2h', 'var(--primary)'],
                ['QCO', 'Toys QCO Penalty', '1d', 'var(--secondary)'],
                ['LABS', 'Solar Inverter Certification', '3d', 'var(--accent-green)'],
              ].map(([tag, label, time, color], index) => (
                <button type="button" key={label} className={`group flex w-full items-center gap-2 border-b border-outline-variant/50 border-l-2 px-2 py-3 text-left transition-colors duration-150 hover:bg-surface-container-low ${index === 0 ? 'border-l-[var(--primary)] bg-surface-container-low/60' : 'border-l-transparent'}`}>
                  <span className="font-mono text-[8px] font-bold" style={{ color }}>{tag}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{label}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant">{time}</span>
                </button>
              ))}
            </div>
            <div className="mb-2 mt-8 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant">SAVED REPORTS</div>
            <div>
              {[
                ['DOSSIER', 'EV Battery Dossier', 'DRAFT', 'var(--secondary)'],
                ['PATHWAY', 'Medical Device Pathway', 'VERIFIED', 'var(--accent-green)'],
              ].map(([tag, label, status, color]) => (
                <button type="button" key={label} className="group flex w-full items-center gap-2 border-b border-outline-variant/50 border-l-2 border-l-transparent px-2 py-3 text-left transition-colors duration-150 hover:border-l-[var(--primary)] hover:bg-surface-container-low">
                  <span className="font-mono text-[8px] font-bold" style={{ color }}>{tag}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{label}</span>
                  <span className="font-mono text-[8px] text-on-surface-variant">{status}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {isHistoryOpen && <button type="button" aria-label="Close history" className="absolute inset-0 z-10 bg-surface/60 lg:hidden" onClick={() => setIsHistoryOpen(false)} />}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface">
          {researchState === 'idle' && (
            <div className="h-full overflow-y-auto px-5 py-10 sm:px-10 lg:px-14 lg:py-16">
              <div className="mx-auto max-w-4xl">
                <div className="max-w-3xl">
                  <div className="mb-5 font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">REGULATORY INTELLIGENCE / NODE 00</div>
                  <h1 className="max-w-2xl font-serif-hero text-[42px] leading-[0.95] tracking-tight text-primary sm:text-[60px]">What do you want<br />to understand?</h1>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-outline-variant py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">
                    <span>22,481 standards indexed</span><span className="text-secondary">·</span><span>1,486 QCO mandates</span><span className="text-secondary">·</span><span>824 labs mapped</span><span className="text-secondary">·</span><span>updated 12m ago</span>
                  </div>
                </div>

                <div className={`relative mt-10 border border-outline-variant bg-surface-container-low/40 shadow-[0_5px_16px_rgba(15,23,42,0.05)] transition-colors duration-150 ${isListening ? 'research-listening' : ''}`}>
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-transparent" />
                  <div className="flex min-h-[72px] items-center gap-2 px-3 py-2">
                    <span className="pl-1 font-mono text-lg text-primary">›</span>
                    <input autoFocus value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === 'Enter' && handleResearch()} placeholder="enter product, standard, or compliance question" className="min-w-0 flex-1 bg-transparent py-3 font-mono text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/70" />
                    <div className="flex shrink-0 items-center gap-1 border-l border-outline-variant pl-2">
                      <button type="button" aria-label="Attach reference" className="flex h-9 w-9 items-center justify-center text-on-surface-variant transition-colors duration-150 hover:text-primary"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                      {isVoiceSupported && <button type="button" aria-label={isListening ? 'Stop voice input' : 'Start voice input'} onClick={handleVoiceToggle} className={`flex h-9 w-9 items-center justify-center text-on-surface-variant transition-colors duration-150 hover:text-primary ${isListening ? 'text-primary' : ''}`}><span className="material-symbols-outlined text-[18px]">mic</span></button>}
                      <button type="button" aria-label="Run research" onClick={() => handleResearch()} disabled={!input.trim()} className={`flex h-9 w-9 items-center justify-center transition-colors duration-150 ${input.trim() ? 'bg-primary text-on-primary' : 'text-on-surface-variant/50'}`}><span className="material-symbols-outlined text-[18px]">arrow_upward</span></button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 max-w-3xl border-t border-outline-variant">
                  <div className="flex items-center justify-between py-3 font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant"><span>QUICK COMMANDS</span><span>PRESS ENTER TO RUN</span></div>
                  {commands.map(command => <button type="button" key={command.tag} onClick={() => handleResearch(command.text)} className="group flex w-full items-center gap-4 border-t border-outline-variant/70 border-l-2 border-l-transparent px-2 py-3.5 text-left transition-colors duration-150 hover:border-l-[var(--primary)] hover:bg-surface-container-low"><span className="w-20 shrink-0 font-mono text-[9px] font-bold" style={{ color: command.color }}>{command.tag}</span><span className="flex-1 text-[13px] text-on-surface">{command.text}</span><span className="font-mono text-[15px] text-on-surface-variant opacity-0 transition-opacity duration-150 group-hover:opacity-100">↵</span></button>)}
                </div>
              </div>
            </div>
          )}

          {isLoading && <LoadingDossier query={query} state={researchState} />}
          {researchState === 'complete' && <Dossier query={query} onEvidence={setSelectedEvidence} />}

          {researchState !== 'idle' && (
            <div className="border-t border-outline-variant bg-surface px-4 py-3 sm:px-8">
              <div className="mx-auto flex max-w-4xl items-center gap-2 border border-outline-variant bg-surface-container-low/40 px-2">
                <span className="font-mono text-lg text-primary">›</span>
                <input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === 'Enter' && handleResearch()} placeholder="ask a follow-up question" className="min-w-0 flex-1 bg-transparent py-3 font-mono text-[12px] outline-none placeholder:text-on-surface-variant" />
                {isVoiceSupported && <button type="button" aria-label="Start voice input" onClick={handleVoiceToggle} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[18px]">mic</span></button>}
                <button type="button" aria-label="Run follow-up research" onClick={() => handleResearch()} disabled={!input.trim() || isLoading} className={`flex h-8 w-8 items-center justify-center ${input.trim() && !isLoading ? 'bg-primary text-on-primary' : 'text-on-surface-variant/50'}`}><span className="material-symbols-outlined text-[17px]">arrow_upward</span></button>
              </div>
            </div>
          )}
        </main>

        {(isLoading || researchState === 'complete') && <ContextRail onEvidence={setSelectedEvidence} />}
      </div>

      <EvidenceDrawer evidence={selectedEvidence} isOpen={Boolean(selectedEvidence)} onClose={() => setSelectedEvidence(null)} />
    </div>
  );
}

function LoadingDossier({ query, state }: { query: string; state: ResearchState }) {
  const activeIndex = state === 'understanding' ? 0 : state === 'standards' ? 1 : 2;
  return <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10 lg:px-14"><div className="mx-auto max-w-4xl"><DossierHeader query={query} loading /><div className="grid gap-6 lg:grid-cols-[150px_1fr]"><IndexRail activeIndex={activeIndex} /><div className="space-y-8">{dossierSections.slice(0, 5).map((section, index) => <section key={section.id} className="border-t border-outline-variant pt-4"><div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-[10px] text-on-surface-variant">{section.number}</span><h2 className="font-serif-hero text-[23px] text-primary">{section.title}</h2></div><div className={`h-3 ${index <= activeIndex ? 'animate-pulse bg-surface-container-high' : 'bg-surface-container-low'}`} /><div className="mt-2 h-3 w-4/5 bg-surface-container-low" /></section>)}</div></div></div></div>;
}

function Dossier({ query, onEvidence }: { query: string; onEvidence: (evidence: Evidence) => void }) {
  return <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10 lg:px-14"><div className="mx-auto max-w-5xl"><DossierHeader query={query} /><div className="grid gap-8 lg:grid-cols-[150px_1fr]"><IndexRail activeIndex={0} /><div className="min-w-0 space-y-10">{dossierSections.map(section => <section id={section.id} key={section.id} className="result-section scroll-mt-5 border-t border-outline-variant pt-4"><div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-[10px] text-on-surface-variant">{section.number}</span><h2 className="font-serif-hero text-[24px] leading-tight text-primary">{section.title}</h2></div><p className="max-w-3xl text-[14px] leading-7 text-on-surface-variant">{section.copy} <Citation label={section.citation} onEvidence={onEvidence} /></p>{section.id === 'requirements' && <div className="mt-5 border border-outline-variant"><div className="grid grid-cols-[1fr_auto] border-b border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-[9px] font-bold tracking-[0.12em] text-on-surface-variant"><span>REQUIRED TEST</span><span>STATUS</span></div>{['Thermal abuse', 'Overcharge', 'Short circuit'].map(test => <div key={test} className="grid grid-cols-[1fr_auto] border-b border-outline-variant/70 px-3 py-3 text-[12px]"><span>{test}</span><span className="font-mono text-[10px] text-status-compliant-text">REQUIRED</span></div>)}</div>}</section>)}</div></div></div></div>;
}

function DossierHeader({ query, loading = false }: { query: string; loading?: boolean }) {
  return <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant pb-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 font-mono text-[9px] font-bold tracking-[0.18em] text-secondary">COMPILED REGULATORY DOSSIER</div><div className="font-serif-hero text-[24px] leading-tight text-on-surface">“{query}”</div></div><div className="flex shrink-0 items-center gap-2"><span className={`border px-2 py-1 font-mono text-[9px] font-bold tracking-[0.1em] ${loading ? 'border-secondary/30 text-secondary' : 'border-status-compliant-border bg-status-compliant-bg text-status-compliant-text'}`}>{loading ? 'RESEARCHING' : 'RESEARCH COMPLETE'}</span><button type="button" aria-label="Save research" className="border border-outline-variant p-1.5 text-on-surface-variant hover:border-primary hover:text-primary"><span className="material-symbols-outlined text-[17px]">bookmark_add</span></button><button type="button" aria-label="Add to workspace" className="border border-outline-variant p-1.5 text-on-surface-variant hover:border-primary hover:text-primary"><span className="material-symbols-outlined text-[17px]">playlist_add</span></button><button type="button" aria-label="Compare research" className="border border-outline-variant p-1.5 text-on-surface-variant hover:border-primary hover:text-primary"><span className="material-symbols-outlined text-[17px]">compare_arrows</span></button><button type="button" aria-label="Generate report" className="border border-outline-variant p-1.5 text-on-surface-variant hover:border-primary hover:text-primary"><span className="material-symbols-outlined text-[17px]">description</span></button></div></div>;
}

function IndexRail({ activeIndex }: { activeIndex: number }) {
  return <nav className="hidden lg:block"><div className="sticky top-5 space-y-1 border-l border-outline-variant pl-3">{dossierSections.map((section, index) => <a key={section.id} href={`#${section.id}`} className={`group block border-l-2 py-1.5 pl-2 transition-colors duration-150 ${index === activeIndex ? 'border-l-primary text-primary' : 'border-l-transparent text-on-surface-variant hover:border-l-primary hover:text-primary'}`}><span className="block font-mono text-[9px] font-bold">{section.number}</span><span className="block text-[10px] leading-4">{section.title}</span></a>)}</div></nav>;
}

function Citation({ label, onEvidence }: { label: string; onEvidence: (evidence: Evidence) => void }) {
  const evidence = evidenceRecords[label];
  return <button type="button" onClick={() => evidence && onEvidence(evidence)} className="ml-1 inline font-mono text-[10px] text-primary underline decoration-primary/40 underline-offset-2 transition-colors duration-150 hover:text-secondary">[{label}]</button>;
}

function ContextRail({ onEvidence }: { onEvidence: (evidence: Evidence) => void }) {
  return <aside className="hidden w-72 shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest xl:flex"><div className="border-b border-outline-variant px-5 py-4"><div className="font-mono text-[10px] font-bold tracking-[0.16em] text-primary">EVIDENCE REGISTER</div><div className="mt-1 text-[11px] text-on-surface-variant">Sources linked to this dossier</div></div><div className="space-y-0 overflow-y-auto px-4 py-4">{Object.entries(evidenceRecords).map(([label, evidence]) => <button type="button" key={label} onClick={() => onEvidence(evidence)} className="w-full border-b border-outline-variant/70 border-l-2 border-l-transparent px-2 py-3 text-left transition-colors duration-150 hover:border-l-primary hover:bg-surface"><div className="mb-1 font-mono text-[9px] font-bold text-primary">[{label}]</div><div className="text-[12px] font-medium text-on-surface">{evidence.document}</div><div className="mt-1 text-[10px] text-on-surface-variant">{evidence.source}</div></button>)}</div></aside>;
}
