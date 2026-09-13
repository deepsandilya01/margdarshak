import React, { useEffect, useRef, useState } from 'react';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useSearchParams } from 'react-router-dom';
import { EvidenceDrawer } from '@/features/evidence/components/EvidenceBadge';
import type { Evidence } from '@/features/evidence/types/evidence';
import { parseIntent, type QueryIntent } from '@/features/ai-sathi/utils/intentEngine';
import KnowledgeAnswer from '@/features/ai-sathi/components/layouts/KnowledgeAnswer';
import ProcessGuide from '@/features/ai-sathi/components/layouts/ProcessGuide';
import ApplicabilityAnalysis from '@/features/ai-sathi/components/layouts/ApplicabilityAnalysis';
import ComparisonWorkspace from '@/features/ai-sathi/components/layouts/ComparisonWorkspace';
import gsap from 'gsap';
import { chatService } from '@/features/ai-sathi/services/chatService';
import type { LanguageCode } from '@/core/apiConfig';

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

type ResearchState = 'idle' | 'understanding' | 'complete';

const speechLocales: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN',
  kn: 'kn-IN', gu: 'gu-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN', as: 'as-IN',
};

const suggestionKeys = [
  'general',
  'certification',
  'standards',
  'qco',
  'labs',
  'consumer'
];

export default function AISathiWorkspace() {
  const { t, i18n } = useTranslation('aiSathi');
  const [searchParams] = useSearchParams();
  const [researchState, setResearchState] = useState<ResearchState>('idle');
  const [queryIntent, setQueryIntent] = useState<QueryIntent | null>(null);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsVoiceSupported(Boolean(SpeechRecognition));
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLocales[i18n.language] || 'en-IN';
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0]?.transcript ?? '').join(' ').trim();
      if (transcript) setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [i18n.language]);

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

  const handleResearch = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || researchState === 'understanding') return;
    
    setQuery(text);
    setInput('');
    setResearchState('understanding');
    
    let response;
    try {
      response = await chatService.ask({
        message: text,
        language: i18n.language as LanguageCode,
        sessionId: 'local-ai-sathi-session',
        context: { source: 'ai-sathi-workspace' },
      });
    } catch {
      setResearchState('idle');
      return;
    }

    const intent = parseIntent(text);
    setQueryIntent(intent);

    setTimeout(() => {
      setResearchState(response.status === 'success' ? 'complete' : 'idle');
    }, 300);
  };

  const resetResearch = () => {
    setResearchState('idle');
    setQueryIntent(null);
    setQuery('');
    setInput('');
  };

  useEffect(() => {
    const resumedQuery = searchParams.get('q');
    if (resumedQuery && researchState === 'idle') setInput(resumedQuery);
  }, [researchState, searchParams]);

  const renderActiveWorkspace = () => {
    if (!queryIntent) return null;
    
    switch (queryIntent) {
      case 'GENERAL':
      case 'EXPLANATION':
      case 'CONSUMER':
        return <KnowledgeAnswer query={query} />;
      case 'HOW_TO':
      case 'CERTIFICATION':
      case 'HALLMARKING':
        return <ProcessGuide query={query} />;
      case 'COMPARISON':
        return <ComparisonWorkspace query={query} />;
      case 'PRODUCT_APPLICABILITY':
      case 'QCO':
      case 'TESTING':
      case 'LAB':
      case 'COMPLIANCE':
      default:
        return <ApplicabilityAnalysis query={query} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background text-on-surface">
      {/* HEADER */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-4 sm:px-6 shadow-sm z-30 relative">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Toggle research history" className="-ml-1.5 rounded-md p-1.5 text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-low lg:hidden" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <span className="material-symbols-outlined">{isHistoryOpen ? 'close' : 'menu'}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">auto_awesome</span>
            <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-primary">AI SATHI <span className="text-on-surface-variant hidden sm:inline">/ BIS INTELLIGENCE ASSISTANT</span></span>
          </div>
        </div>
        <button type="button" onClick={resetResearch} className="flex items-center gap-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-low px-4 py-2 text-[12px] font-semibold text-primary transition-colors duration-150 hover:border-primary hover:bg-surface-container shadow-sm">
          <span className="material-symbols-outlined text-[16px]">add</span><span className="hidden sm:inline">New Research</span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - RESEARCH HISTORY */}
        <aside className={`absolute inset-y-0 left-0 z-20 flex w-full max-w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface transition-transform duration-150 ease-out lg:relative lg:translate-x-0 ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="border-b border-outline-variant px-4 py-4 bg-surface-container-lowest">
            <label className="flex items-center gap-2 border-b border-outline-variant/60 pb-2 focus-within:border-primary">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
              <input aria-label={t('history.search')} placeholder={t('history.search')} className="min-w-0 flex-1 bg-transparent text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/70" />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
            <div className="mb-2 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant">{t('history.recent')}</div>
            <div>
              {[
                ['GENERAL', 'What is BIS?', '1h'],
                ['APPLICABILITY', 'EV Battery Standards', '2h'],
                ['QCO', 'Toys QCO Requirements', '1d'],
              ].map(([tag, label, time], index) => (
                <button type="button" key={label} className="group flex w-full flex-col gap-1 border-b border-outline-variant/40 px-2 py-3 text-left transition-colors duration-150 hover:bg-surface-container-low rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[8px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded">{tag}</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">{time}</span>
                  </div>
                  <span className="min-w-0 w-full truncate text-[13px] font-medium text-on-surface">{label}</span>
                </button>
              ))}
            </div>
            
            <div className="mb-2 mt-8 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant">{t('history.saved')}</div>
            <div>
              {[
                { title: 'IS 16046 Compliance Plan', icon: 'topic' },
                { title: 'Solar PV Lab Comparison', icon: 'compare_arrows' },
              ].map((item, index) => (
                <button type="button" key={item.title} className="group flex w-full items-center gap-3 border-b border-outline-variant/40 px-2 py-3 text-left transition-colors duration-150 hover:bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-[16px] text-secondary">{item.icon}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-on-surface">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {isHistoryOpen && <button type="button" aria-label="Close history" className="absolute inset-0 z-10 bg-surface/60 lg:hidden backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)} />}

        {/* MAIN CONTENT AREA */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background relative">
          
          {/* IDLE COMMAND CENTER */}
          {researchState === 'idle' && (
            <div className="h-full overflow-y-auto px-4 py-8 sm:px-8 lg:px-16 lg:py-16 flex flex-col">
              <div className="my-auto w-full max-w-3xl flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/50 border border-secondary/20 mb-6">
                  <span className="material-symbols-outlined text-[16px] text-secondary animate-pulse">auto_awesome</span>
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-secondary">BIS INTELLIGENCE ASSISTANT</span>
                </div>
                
                <h1 className="font-serif-hero text-[36px] sm:text-[48px] md:text-[56px] leading-[1.1] tracking-tight text-primary mb-4">
                  {t('hero.title')}
                </h1>
                
                <p className="text-[15px] sm:text-[16px] text-on-surface-variant max-w-xl mb-10">
                  {t('hero.subtitle')}
                </p>

                {/* PREMIUM GLOSSY INPUT */}
                <div className={`w-full relative glossy-card bg-surface/80 backdrop-blur-md rounded-2xl border border-outline-variant/50 shadow-lg shadow-primary/5 transition-all duration-300 focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/50 overflow-hidden ${isListening ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
                  <div className="flex min-h-[64px] items-center gap-3 px-4 py-2">
                    <span className="material-symbols-outlined text-[24px] text-secondary shrink-0">search</span>
                    <input 
                      ref={inputRef}
                      autoFocus 
                      value={input} 
                      onChange={event => setInput(event.target.value)} 
                      onKeyDown={event => event.key === 'Enter' && handleResearch()} 
                      placeholder={t('hero.placeholder')} 
                      className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-on-surface outline-none placeholder:text-on-surface-variant/60 font-medium" 
                    />
                    
                    <div className="flex shrink-0 items-center gap-1.5 pl-2">
                      {input && (
                        <button type="button" onClick={() => setInput('')} className="flex h-10 w-10 items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                      {isVoiceSupported && (
                        <button type="button" aria-label={isListening ? 'Stop voice input' : 'Start voice input'} onClick={handleVoiceToggle} className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 ${isListening ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                          <span className="material-symbols-outlined text-[20px]">mic</span>
                        </button>
                      )}
                      <button 
                        type="button" 
                        aria-label="Run research" 
                        onClick={() => handleResearch()} 
                        disabled={!input.trim()} 
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${input.trim() ? 'bg-primary text-on-primary shadow-md hover:brightness-110' : 'bg-surface-container text-on-surface-variant/40'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* SUGGESTION CHIPS */}
                <div className="w-full mt-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] flex-1 bg-outline-variant/30" />
                    <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-on-surface-variant">{t('suggestions.title')}</span>
                    <div className="h-[1px] flex-1 bg-outline-variant/30" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {suggestionKeys.map((key) => (
                      <button 
                        key={key}
                        onClick={() => handleResearch(t(`suggestions.${key}.text`))}
                        className="group flex flex-col items-start gap-1 p-3 rounded-xl bg-surface border border-outline-variant/40 shadow-sm hover:border-primary/40 hover:bg-surface-container-lowest transition-all duration-200 text-left max-w-[280px]"
                      >
                        <span className="font-mono text-[9px] font-bold text-secondary">{t(`suggestions.${key}.category`)}</span>
                        <span className="text-[13px] text-on-surface font-medium leading-tight group-hover:text-primary transition-colors">{t(`suggestions.${key}.text`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {researchState === 'understanding' && (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-surface-container rounded-full" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                <span className="material-symbols-outlined text-[28px] text-secondary">auto_awesome</span>
              </div>
              <div className="text-center space-y-2">
                <h2 className="font-serif-hero text-[24px] text-primary">{t('states.synthesizing')}</h2>
                <p className="text-[14px] text-on-surface-variant font-mono animate-pulse">{t('states.analyzing')}</p>
              </div>
            </div>
          )}

          {/* RESULTS STATE */}
          {researchState === 'complete' && (
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-5xl">
                {renderActiveWorkspace()}
              </div>
            </div>
          )}

          {/* BOTTOM CONTEXT BAR (When in research) */}
          {researchState === 'complete' && (
            <div className="border-t border-outline-variant/50 bg-surface/80 backdrop-blur-md px-4 py-3 sm:px-8 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
              <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center gap-4 justify-between">
                
                {/* Active Context Indicator */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container/50 text-secondary">
                    <span className="material-symbols-outlined text-[16px]">radar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant">{t('context.active')}</span>
                    <span className="text-[12px] font-semibold text-primary truncate max-w-[200px]">"{query}"</span>
                  </div>
                </div>

                {/* Follow-up input */}
                <div className="w-full sm:max-w-md relative flex items-center">
                  <input 
                    value={input} 
                    onChange={event => setInput(event.target.value)} 
                    onKeyDown={event => event.key === 'Enter' && handleResearch()} 
                    placeholder="Ask a follow-up question..." 
                    className="w-full bg-surface-container rounded-xl pl-4 pr-[104px] py-2.5 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all"
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <button type="button" aria-label="Attach file" className="flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
                      <span className="material-symbols-outlined text-[16px]">attach_file</span>
                    </button>
                    {isVoiceSupported && (
                      <button type="button" aria-label={isListening ? 'Stop voice input' : 'Start voice input'} onClick={handleVoiceToggle} className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${isListening ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
                        <span className="material-symbols-outlined text-[16px]">mic</span>
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleResearch()} 
                      disabled={!input.trim()} 
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${input.trim() ? 'bg-primary text-on-primary' : 'text-on-surface-variant/40'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* DYNAMIC RIGHT CONTEXT RAIL */}
        {researchState === 'complete' && (
          <aside className="hidden w-[300px] shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest xl:flex z-20 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
            <div className="border-b border-outline-variant/60 px-5 py-5 bg-surface/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                <div className="font-mono text-[10px] font-bold tracking-[0.16em] text-primary">{t('context.related')}</div>
              </div>
              <div className="mt-1.5 text-[11px] text-on-surface-variant leading-relaxed">{t('context.relatedDesc')}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Context Actions */}
              <div className="space-y-2">
                <div className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant pl-1">{t('context.actions')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-lowest transition-colors shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                    <span className="text-[10px] font-semibold">{t('context.save')}</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-lowest transition-colors shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    <span className="text-[10px] font-semibold">{t('context.report')}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Content based on intent */}
              {queryIntent === 'GENERAL' || queryIntent === 'HOW_TO' ? (
                <div className="space-y-3">
                  <div className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant pl-1">{t('context.nextSteps')}</div>
                  {[
                    { icon: 'search', title: 'Check Product Applicability' },
                    { icon: 'menu_book', title: 'Browse Standards Catalog' },
                  ].map(action => (
                    <button key={action.title} className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container-lowest text-left transition-colors group shadow-sm">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary">{action.icon}</span>
                      <span className="text-[12px] font-medium text-on-surface">{action.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant pl-1">{t('context.evidence')}</div>
                  {[
                    { doc: 'IS 16046 (Part 2):2018', source: 'BIS Official Website', type: 'STANDARD' },
                    { doc: 'CRO Phase V Notification', source: 'MeitY Gazette', type: 'GAZETTE' },
                  ].map((ev, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-status-compliant-bg/20 border border-status-compliant-border/30 hover:bg-status-compliant-bg/40 cursor-pointer transition-colors relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-compliant-dot" />
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] font-bold text-status-compliant-text px-1.5 py-0.5 rounded border border-status-compliant-border bg-status-compliant-bg">{ev.type}</span>
                        <span className="material-symbols-outlined text-[14px] text-status-compliant-dot opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                      </div>
                      <span className="text-[12px] font-semibold text-on-surface leading-tight mt-1">{ev.doc}</span>
                      <span className="text-[10px] text-on-surface-variant">{ev.source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
