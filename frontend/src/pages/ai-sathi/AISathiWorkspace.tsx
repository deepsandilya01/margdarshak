import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useSearchParams } from 'react-router-dom';
import { parseIntent, type QueryIntent } from '@/features/ai-sathi/utils/intentEngine';
import KnowledgeAnswer from '@/features/ai-sathi/components/layouts/KnowledgeAnswer';
import ProcessGuide from '@/features/ai-sathi/components/layouts/ProcessGuide';
import ApplicabilityAnalysis from '@/features/ai-sathi/components/layouts/ApplicabilityAnalysis';
import ComparisonWorkspace from '@/features/ai-sathi/components/layouts/ComparisonWorkspace';
import { chatService, type ChatSession, type ChatMessage } from '@/features/ai-sathi/services/chatService';
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

const citationDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export default function AISathiWorkspace() {
  const { t, i18n } = useTranslation(['aiSathi']);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Real-time Chat State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [researchState, setResearchState] = useState<ResearchState>('idle');
  const [queryIntent, setQueryIntent] = useState<QueryIntent | null>(null);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [retryText, setRetryText] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Sessions
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
      setHistoryError(null);
    } catch (error) {
      console.error("Failed to load sessions", error);
      setHistoryError('Chat history is unavailable right now. You can still start a new chat.');
    }
  };

  const loadSessionHistory = async (sessionId: string) => {
    try {
      setActiveSessionId(sessionId);
      const data = await chatService.getSessionHistory(sessionId);
      setMessages(data);
      setHistoryError(null);
      
      if (data.length > 0) {
        // Find last user message to set context
        const lastUserMsg = [...data].reverse().find(m => m.role === 'user');
        if (lastUserMsg) {
          setQuery(lastUserMsg.content);
          setQueryIntent(parseIntent(lastUserMsg.content));
          setResearchState('complete');
        }
      }
    } catch (error) {
      console.error("Failed to load session history", error);
      setHistoryError('This conversation could not be loaded. You can start a new chat.');
      setActiveSessionId(null);
      setSearchParams(previous => {
        previous.delete('session');
        return previous;
      }, { replace: true });
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId && !activeSessionId) void loadSessionHistory(sessionId);
  }, [searchParams, activeSessionId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, researchState]);

  // Voice setup
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
    setRetryText(null);
    
    // Add optimistic user message
    const tempUserId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempUserId, role: 'user', content: text, createdAt: new Date().toISOString() }]);

    try {
      const response = await chatService.ask({
        message: text,
        language: i18n.language as LanguageCode,
        sessionId: activeSessionId || undefined,
        context: { source: 'ai-sathi-workspace' },
      });

      if (response.status === 'service_unavailable') {
        setMessages(prev => [...prev, {
          id: `temp-error-${Date.now()}`,
          role: 'assistant',
          content: 'The AI service is temporarily unavailable. Please try again.',
          createdAt: new Date().toISOString(),
        }]);
        setRetryText(text);
        setResearchState('complete');
        return;
      }
      
      const intent = parseIntent(text);
      setQueryIntent(intent);
      
      if (!activeSessionId && response.sessionId) {
        setActiveSessionId(response.sessionId);
        setSearchParams(previous => {
          previous.set('session', response.sessionId!);
          return previous;
        }, { replace: true });
        loadSessions(); // reload sidebar
      }

      setMessages(prev => [...prev, { 
        id: `temp-assistant-${Date.now()}`, 
        role: 'assistant', 
        content: response.answer.text, 
        status: response.status,
        citations: response.citations,
        evidence: response.evidence,
        createdAt: new Date().toISOString() 
      }]);

      setResearchState('complete');
    } catch (error: unknown) {
      let errorMsg = "I'm sorry, I couldn't process your request right now. Please try again.";
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status === 401) errorMsg = 'Your session has expired. Please log in again.';
        else if (status === 429) errorMsg = 'Too many requests. Please wait a moment and try again.';
        else if (status === 408) errorMsg = 'The request timed out. Please try a shorter question.';
        else if (status >= 500) errorMsg = 'The server encountered an error. Please try again later.';
      } else if (error instanceof Error && error.message.includes('Unable to reach')) {
        errorMsg = 'Unable to connect to the server. Please check your connection and try again.';
      }
      setMessages(prev => [...prev, { 
        id: `temp-error-${Date.now()}`, 
        role: 'assistant', 
        content: errorMsg, 
        createdAt: new Date().toISOString() 
      }]);
      setRetryText(text);
      setResearchState('complete');
    }
  };

  const resetResearch = () => {
    setResearchState('idle');
    setQueryIntent(null);
    setQuery('');
    setInput('');
    setActiveSessionId(null);
    setMessages([]);
    setHistoryError(null);
    setRetryText(null);
    setSearchParams(previous => {
      previous.delete('session');
      return previous;
    }, { replace: true });
    requestAnimationFrame(() => inputRef.current?.focus());
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
    <div className="flex h-full w-full overflow-hidden bg-background text-on-surface">
      
      {/* HISTORY SIDEBAR */}
      <aside className="w-[260px] flex-col border-r border-outline-variant bg-surface-container-lowest hidden lg:flex">
        <div className="p-4 border-b border-outline-variant/60 flex items-center justify-between">
          <span className="font-semibold text-[14px]">Chat History</span>
          <button onClick={resetResearch} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-primary" title="New Chat">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {historyError && (
            <div className="mx-3 mb-2 rounded-lg border border-error/20 bg-error/5 p-3 text-[12px] text-on-surface-variant">
              {historyError}
            </div>
          )}
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant text-[13px]">No recent chats</div>
          ) : (
            sessions.map(session => (
              <button 
                key={session.id} 
                onClick={() => loadSessionHistory(session.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface-container-low transition-colors ${activeSessionId === session.id ? 'bg-primary/5 border-r-2 border-primary' : ''}`}
              >
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">chat_bubble</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] truncate ${activeSessionId === session.id ? 'font-medium text-primary' : 'text-on-surface'}`}>
                    {session.title}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background relative">
          
          {/* IDLE COMMAND CENTER */}
          {researchState === 'idle' && (
            <div className="h-full overflow-y-auto px-4 py-8 sm:px-8 lg:px-16 lg:py-12 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-full max-w-4xl flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/50 border border-secondary/20 mb-6">
                  <span className="material-symbols-outlined text-[16px] text-secondary animate-pulse">auto_awesome</span>
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-secondary">BIS INTELLIGENCE ASSISTANT</span>
                </div>
                
                <h1 className="font-serif-hero text-[36px] sm:text-[48px] md:text-[56px] leading-tight tracking-tight text-primary mb-4">
                  {t('hero.title')}
                </h1>
                
                <p className="text-[15px] sm:text-[16px] font-medium text-on-surface max-w-xl mb-2">
                  {t('hero.subtitle')}
                </p>
                <p className="text-[14px] text-on-surface-variant max-w-2xl mb-8">
                  {t('hero.description')}
                </p>

                {/* PREMIUM GLOSSY INPUT */}
                <div className={`w-full max-w-3xl relative glossy-card bg-surface/80 backdrop-blur-md rounded-2xl border border-outline-variant/50 shadow-lg shadow-primary/5 transition-all duration-300 focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/50 overflow-hidden ${isListening ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
                  <form className="flex min-h-[64px] items-center gap-3 px-4 py-2" onSubmit={event => { event.preventDefault(); void handleResearch(); }}>
                    <span className="material-symbols-outlined text-[24px] text-secondary shrink-0">search</span>
                    <input 
                      ref={inputRef}
                      autoFocus 
                      value={input} 
                      onChange={event => setInput(event.target.value)} 
                      onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void handleResearch(); } }}
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
                        onClick={() => void handleResearch()} 
                        disabled={!input.trim()} 
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${input.trim() ? 'bg-primary text-on-primary shadow-md hover:brightness-110' : 'bg-surface-container text-on-surface-variant/40'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                      </button>
                    </div>
                  </form>
                </div>

                <section className="w-full max-w-3xl mt-10 text-left" aria-labelledby="ai-sathi-capabilities">
                  <h2 id="ai-sathi-capabilities" className="text-[11px] font-mono font-bold tracking-widest text-on-surface-variant uppercase mb-3">
                    {t('hero.capabilitiesTitle')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {(t('hero.capabilities', { returnObjects: true }) as unknown as string[]).map(capability => (
                      <div key={capability} className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="w-full max-w-3xl mt-8 rounded-xl border border-outline-variant/40 bg-surface/60 p-4 text-left" aria-label={t('hero.trustTitle')}>
                  <h2 className="text-[12px] font-semibold text-primary mb-1">{t('hero.trustTitle')}</h2>
                  <p className="text-[12px] leading-relaxed text-on-surface-variant">{t('hero.trustText')}</p>
                  <p className="text-[12px] leading-relaxed text-on-surface-variant mt-2">{t('hero.insufficientText')}</p>
                </section>

                <p className="max-w-3xl mt-5 text-[11px] leading-relaxed text-on-surface-variant/80">
                  {t('hero.disclaimer')}
                </p>
                <p className="mt-2 text-[12px] font-medium text-secondary">{t('hero.startPrompt')}</p>
                
                {/* SUGGESTIONS */}
                <div className="w-full mt-12 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4 opacity-70">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">bolt</span>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">QUICK EXPLORE</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                    {suggestionKeys.slice(0, 5).map((key) => (
                      <button 
                        key={key}
                        onClick={() => handleResearch(t(`suggestions.${key}.text`))}
                        className="px-4 py-2 rounded-full bg-surface border border-outline-variant/50 text-[13px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low hover:border-primary/30 transition-colors shadow-sm"
                      >
                        {t(`suggestions.${key}.category`)}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ACTIVE CHAT/RESULTS STATE */}
          {researchState !== 'idle' && (
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12 flex flex-col gap-8">
              
              {/* CHAT MESSAGES STREAM */}
              <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
                {messages.map((msg, index) => (
                  <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-on-primary rounded-tr-sm shadow-md' 
                        : 'bg-surface-container-low text-on-surface rounded-tl-sm border border-outline-variant/40'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="space-y-4">
                          {msg.status === 'insufficient_evidence' && (
                            <div className="rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 text-[12px] text-on-surface-variant">
                              This answer could not be verified from the available BIS documents or official web sources. Try rephrasing the question or check bis.gov.in.
                            </div>
                          )}
                          <div className="prose prose-sm max-w-none text-[14px] leading-relaxed prose-p:text-on-surface prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-on-surface prose-strong:font-bold prose-ul:my-2 prose-li:my-0">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            skipHtml
                            components={{
                              a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                          </div>
                          {msg.citations && msg.citations.length > 0 && (
                            <section aria-label="Sources" className="border-t border-outline-variant/40 pt-3">
                              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Sources</h3>
                              <div className="grid gap-2">
                                {msg.citations.map((citation, citationIndex) => (
                                  <a key={citation.id} href={citation.url || undefined} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-outline-variant/50 px-3 py-2 text-[12px] hover:border-primary/50">
                                    <span className="mr-2 font-semibold text-primary">[{citationIndex + 1}]</span>
                                    <span className="font-medium text-on-surface">{citation.title}</span>
                                    {citation.page ? <span className="ml-2 text-on-surface-variant">Page {citation.page}</span> : null}
                                    {citation.url ? <span className="mt-1 block truncate text-on-surface-variant">{citationDomain(citation.url)}</span> : null}
                                  </a>
                                ))}
                              </div>
                            </section>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {researchState === 'understanding' && (
                  <div className="flex w-full justify-start">
                    <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-5 py-4 border border-outline-variant/40 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                      <span className="text-[13px] text-on-surface-variant">AI SATHI is thinking...</span>
                    </div>
                  </div>
                )}
                {retryText && researchState === 'complete' && (
                  <button type="button" onClick={() => { const text = retryText; setRetryText(null); void handleResearch(text); }} className="self-start rounded-lg border border-primary/30 px-3 py-2 text-[13px] text-primary hover:bg-primary/5">
                    Retry
                  </button>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* RICH WORKSPACE removed per user request */}
            </div>
          )}

          {/* BOTTOM CONTEXT BAR (When in research) */}
          {researchState !== 'idle' && (
            <div className="border-t border-outline-variant/50 bg-surface/80 backdrop-blur-md px-4 py-3 sm:px-8 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
              <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-center gap-4 justify-between">
                
                {/* Follow-up input */}
                <form className="w-full relative flex items-center" onSubmit={event => { event.preventDefault(); void handleResearch(); }}>
                  <textarea 
                    rows={1}
                    value={input} 
                    onChange={event => setInput(event.target.value)} 
                    onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void handleResearch(); } }}
                    placeholder="Ask a follow-up question..." 
                    className="w-full max-h-32 resize-none overflow-y-auto bg-surface-container rounded-xl pl-4 pr-[104px] py-3 text-[14px] leading-relaxed text-on-surface outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all shadow-inner"
                    disabled={researchState === 'understanding'}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                    {isVoiceSupported && (
                      <button type="button" aria-label={isListening ? 'Stop voice input' : 'Start voice input'} onClick={handleVoiceToggle} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isListening ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
                        <span className="material-symbols-outlined text-[18px]">mic</span>
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => void handleResearch()} 
                      disabled={!input.trim() || researchState === 'understanding'} 
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${input.trim() && researchState !== 'understanding' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant/40'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
