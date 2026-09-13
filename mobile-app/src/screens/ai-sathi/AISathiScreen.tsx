import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useWorkspace } from '@/context/WorkspaceContext';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  History,
  X,
  Bookmark,
  BookmarkCheck,
  FileText,
  Search,
  ChevronRight,
  Radar,
} from 'lucide-react-native';
import { chatService } from '@/features/ai-sathi/services/chatService';
import { parseIntent, type QueryIntent } from '@/features/ai-sathi/utils/intentEngine';
import { KnowledgeAnswer } from '@/features/ai-sathi/components/layouts/KnowledgeAnswer';
import { ProcessGuide } from '@/features/ai-sathi/components/layouts/ProcessGuide';
import { ApplicabilityAnalysis } from '@/features/ai-sathi/components/layouts/ApplicabilityAnalysis';
import { ComparisonWorkspace } from '@/features/ai-sathi/components/layouts/ComparisonWorkspace';

type ResearchState = 'idle' | 'understanding' | 'complete';

interface ResearchHistoryEntry {
  id: string;
  tag: string;
  label: string;
  time: string;
  query: string;
}

const MOCK_HISTORY: ResearchHistoryEntry[] = [
  { id: 'h1', tag: 'GENERAL', label: 'What is BIS?', time: '1h', query: 'What is BIS?' },
  { id: 'h2', tag: 'APPLICABILITY', label: 'EV Battery Standards', time: '2h', query: 'Which standard applies to EV batteries?' },
  { id: 'h3', tag: 'QCO', label: 'Toys QCO Requirements', time: '1d', query: 'Does this product have a QCO? toys' },
];

const SAVED_WORKSPACES = [
  { title: 'IS 16046 Compliance Plan' },
  { title: 'Solar PV Lab Comparison' },
];

const EVIDENCE_DATA = [
  { doc: 'IS 16046 (Part 2):2018', source: 'BIS Official Website', type: 'STANDARD' },
  { doc: 'CRO Phase V Notification', source: 'MeitY Gazette', type: 'GAZETTE' },
];

const NEXT_STEPS = [
  { icon: '🔍', title: 'Check Product Applicability', screen: 'Standards' },
  { icon: '📚', title: 'Browse Standards Catalog', screen: 'Standards' },
];

const SUGGESTION_KEYS = ['general', 'certification', 'standards', 'qco', 'labs', 'consumer'] as const;

export default function AISathiScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { t } = useTranslation(['aiSathi']);
  const { saveItem, savedItems } = useWorkspace();

  const [researchState, setResearchState] = useState<ResearchState>('idle');
  const [queryIntent, setQueryIntent] = useState<QueryIntent | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [input, setInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // Handle resume from route params
  useEffect(() => {
    const resumedQuery = route.params?.q;
    if (resumedQuery && researchState === 'idle') {
      setInput(resumedQuery);
    }
  }, [route.params?.q]);

  const handleResearch = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || researchState === 'understanding') return;

    setActiveQuery(text);
    setInput('');
    setResearchState('understanding');
    setIsSaved(false);
    setIsHistoryOpen(false);

    try {
      await chatService.ask({
        message: text,
        language: 'en',
        sessionId: 'mobile-ai-sathi-session',
        context: { source: 'ai-sathi-workspace' },
      });
    } catch {
      // continue with intent-based mock result
    }

    const intent = parseIntent(text);
    setQueryIntent(intent);

    setTimeout(() => {
      setResearchState('complete');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 300);
  };

  const resetResearch = () => {
    setResearchState('idle');
    setQueryIntent(null);
    setActiveQuery('');
    setInput('');
    setIsSaved(false);
  };

  const handleSave = () => {
    saveItem({
      id: `research-${Date.now()}`,
      type: 'research',
      label: queryIntent || 'Research',
      title: activeQuery,
    });
    setIsSaved(true);
  };

  const handleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInput('How do I apply for ISI Mark?');
        setIsListening(false);
      }, 2000);
    }
  };

  const renderActiveWorkspace = () => {
    if (!queryIntent) return null;
    const nav = (screen: string) => navigation.navigate(screen);

    switch (queryIntent) {
      case 'GENERAL':
      case 'EXPLANATION':
      case 'CONSUMER':
        return <KnowledgeAnswer query={activeQuery} onNavigate={nav} />;
      case 'HOW_TO':
      case 'CERTIFICATION':
      case 'HALLMARKING':
        return <ProcessGuide query={activeQuery} onNavigate={nav} />;
      case 'COMPARISON':
        return <ComparisonWorkspace query={activeQuery} />;
      default:
        return <ApplicabilityAnalysis query={activeQuery} onNavigate={nav} />;
    }
  };

  const getIntentTag = (intent: QueryIntent | null) => {
    if (!intent) return 'RESEARCH';
    const map: Record<QueryIntent, string> = {
      GENERAL: 'GENERAL',
      EXPLANATION: 'EXPLANATION',
      HOW_TO: 'PROCESS GUIDE',
      PRODUCT_APPLICABILITY: 'APPLICABILITY',
      QCO: 'QCO',
      TESTING: 'TESTING',
      LAB: 'LABORATORY',
      CERTIFICATION: 'CERTIFICATION',
      HALLMARKING: 'HALLMARKING',
      CONSUMER: 'CONSUMER',
      COMPARISON: 'COMPARISON',
      EVIDENCE: 'EVIDENCE',
      COMPLIANCE: 'COMPLIANCE',
      REPORT: 'REPORT',
    };
    return map[intent] ?? 'RESEARCH';
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* ─── WORKSPACE SUB-HEADER ─────────────────────────── */}
      <View
        className="bg-surface border-b border-outline-variant shadow-sm"
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 }}
      >
        {/* History toggle */}
        <Pressable
          onPress={() => setIsHistoryOpen(true)}
          accessibilityLabel="Toggle research history"
          className="w-9 h-9 rounded-lg items-center justify-center bg-surface-container-low"
        >
          <History size={18} color="#5f6368" />
        </Pressable>

        {/* Title pill */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="#e65c00" />
          <Text className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary">
            AI SATHI
          </Text>
          <Text className="font-mono text-[11px] text-on-surface-variant">/ BIS INTELLIGENCE ASSISTANT</Text>
        </View>

        {/* New Research */}
        <Pressable
          onPress={resetResearch}
          accessibilityLabel="New Research"
          className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low"
        >
          <Plus size={14} color="#1a73e8" />
          <Text className="font-mono text-[11px] font-bold text-primary">New</Text>
        </Pressable>
      </View>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      {researchState === 'idle' && (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, alignItems: 'center', paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identity pill */}
          <View
            className="flex-row items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/20 bg-secondary/10 mb-6"
          >
            <Sparkles size={14} color="#e65c00" />
            <Text className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#e65c00]">BIS INTELLIGENCE ASSISTANT</Text>
          </View>

          {/* Hero */}
          <Text className="text-[28px] font-bold text-primary text-center mb-3">
            {t('aiSathi:hero.title')}
          </Text>
          <Text className="text-[14px] text-on-surface-variant text-center max-w-xs mb-8 leading-6">
            {t('aiSathi:hero.subtitle')}
          </Text>

          {/* Premium Input */}
          <View
            className="w-full bg-surface rounded-2xl border border-outline-variant shadow-sm mb-10"
            style={{ flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
          >
            <Search size={20} color="#9aa0a6" />
            <TextInput
              className="flex-1 text-[15px] font-medium text-on-surface"
              placeholder={t('aiSathi:hero.placeholder')}
              placeholderTextColor="#9aa0a6"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleResearch()}
              returnKeyType="search"
              autoFocus={false}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {input.length > 0 && (
                <Pressable onPress={() => setInput('')} className="w-9 h-9 rounded-full items-center justify-center">
                  <X size={16} color="#5f6368" />
                </Pressable>
              )}
              <Pressable onPress={handleMic} className={`w-9 h-9 rounded-full items-center justify-center ${isListening ? 'bg-primary/10' : ''}`}>
                {isListening ? <MicOff size={18} color="#ba1a1a" /> : <Mic size={18} color="#5f6368" />}
              </Pressable>
              <Pressable
                onPress={() => handleResearch()}
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-full items-center justify-center ${input.trim() ? 'bg-primary' : 'bg-surface-container'}`}
              >
                <Send size={16} color={input.trim() ? '#fff' : '#aaa'} />
              </Pressable>
            </View>
          </View>
          {isListening && (
            <Text className="text-[12px] text-[#ba1a1a] font-bold mb-4">Listening...</Text>
          )}

          {/* Suggestion chips */}
          <View className="w-full" style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />
              <Text className="font-mono text-[10px] font-bold tracking-[0.15em] text-on-surface-variant">
                {t('aiSathi:suggestions.title')}
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />
            </View>

            <View style={{ gap: 10 }}>
              {SUGGESTION_KEYS.map(key => (
                <Pressable
                  key={key}
                  onPress={() => handleResearch(t(`aiSathi:suggestions.${key}.text`))}
                  className="bg-surface border border-outline-variant rounded-xl p-4"
                  style={{ gap: 4 }}
                >
                  <Text className="font-mono text-[9px] font-bold text-secondary">
                    {t(`aiSathi:suggestions.${key}.category`)}
                  </Text>
                  <Text className="text-[14px] font-medium text-on-surface">
                    {t(`aiSathi:suggestions.${key}.text`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {researchState === 'understanding' && (
        <View className="flex-1 items-center justify-center p-8" style={{ gap: 20 }}>
          <View style={{ width: 72, height: 72, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#1a73e8" style={{ position: 'absolute' }} />
            <Sparkles size={24} color="#e65c00" />
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text className="text-[22px] font-bold text-primary text-center">
              {t('aiSathi:states.synthesizing')}
            </Text>
            <Text className="font-mono text-[13px] text-on-surface-variant text-center">
              {t('aiSathi:states.analyzing')}
            </Text>
          </View>
        </View>
      )}

      {researchState === 'complete' && (
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
        >
          {/* Result type tag */}
          <View className="flex-row items-center gap-2 mb-5" style={{ flexWrap: 'wrap' }}>
            <View className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <Text className="font-mono text-[9px] font-bold text-primary">{getIntentTag(queryIntent)}</Text>
            </View>
            <Text className="font-mono text-[9px] text-on-surface-variant">Research complete</Text>
          </View>

          {/* Workspace result */}
          {renderActiveWorkspace()}

          {/* ─── Related Intelligence (right-rail equivalent) ─ */}
          <View className="mt-8 bg-surface border border-outline-variant rounded-2xl overflow-hidden">
            <View className="bg-surface-container-low px-5 py-4 border-b border-outline-variant">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Radar size={16} color="#e65c00" />
                <Text className="font-mono text-[10px] font-bold tracking-[0.16em] text-primary">
                  {t('aiSathi:context.related')}
                </Text>
              </View>
              <Text className="text-[11px] text-on-surface-variant mt-1">
                {t('aiSathi:context.relatedDesc')}
              </Text>
            </View>

            <View className="p-4" style={{ gap: 16 }}>
              {/* Actions */}
              <View style={{ gap: 8 }}>
                <Text className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant">
                  {t('aiSathi:context.actions')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={isSaved ? undefined : handleSave}
                    className={`flex-1 flex-col items-center justify-center gap-1.5 p-3 rounded-xl border ${isSaved ? 'bg-secondary/10 border-secondary/30' : 'bg-surface border-outline-variant'}`}
                    accessibilityLabel={isSaved ? 'Saved' : 'Save research'}
                  >
                    {isSaved ? (
                      <BookmarkCheck size={20} color="#138808" />
                    ) : (
                      <Bookmark size={20} color="#1a73e8" />
                    )}
                    <Text className={`text-[11px] font-semibold ${isSaved ? 'text-[#138808]' : 'text-primary'}`}>
                      {isSaved ? 'Saved' : t('aiSathi:context.save')}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => navigation.navigate('ReportsStack')}
                    className="flex-1 flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-outline-variant bg-surface"
                    accessibilityLabel="Generate Report"
                  >
                    <FileText size={20} color="#1a73e8" />
                    <Text className="text-[11px] font-semibold text-primary">{t('aiSathi:context.report')}</Text>
                  </Pressable>
                </View>
              </View>

              {/* Evidence or Next Steps based on intent */}
              {queryIntent === 'GENERAL' || queryIntent === 'HOW_TO' ? (
                <View style={{ gap: 8 }}>
                  <Text className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant">
                    {t('aiSathi:context.nextSteps')}
                  </Text>
                  {NEXT_STEPS.map(action => (
                    <Pressable
                      key={action.title}
                      onPress={() => navigation.navigate(action.screen)}
                      className="flex-row items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant"
                    >
                      <Text style={{ fontSize: 18 }}>{action.icon}</Text>
                      <Text className="text-[13px] font-medium text-on-surface flex-1">{action.title}</Text>
                      <ChevronRight size={16} color="#5f6368" />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  <Text className="font-mono text-[9px] font-bold tracking-widest text-on-surface-variant">
                    {t('aiSathi:context.evidence')}
                  </Text>
                  {EVIDENCE_DATA.map((ev, i) => (
                    <Pressable
                      key={i}
                      onPress={() => setIsEvidenceOpen(true)}
                      accessibilityLabel={`View evidence: ${ev.doc}`}
                      className="rounded-xl border border-[#c3e6cb] bg-[#d4edda]/20 p-3.5"
                      style={{ borderLeftWidth: 3, borderLeftColor: '#138808', gap: 4 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View className="rounded px-1.5 py-0.5 bg-[#d4edda] border border-[#c3e6cb]">
                          <Text className="font-mono text-[8px] font-bold text-[#155724]">{ev.type}</Text>
                        </View>
                        <ChevronRight size={12} color="#138808" />
                      </View>
                      <Text className="text-[12px] font-semibold text-on-surface">{ev.doc}</Text>
                      <Text className="text-[10px] text-on-surface-variant">{ev.source}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* ─── FOLLOW-UP / CONTEXT BAR (when complete) ───────── */}
      {researchState === 'complete' && (
        <View
          className="bg-surface/90 border-t border-outline-variant"
          style={{ paddingHorizontal: 16, paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 12 : 10, gap: 8 }}
        >
          {/* Active context */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Radar size={14} color="#e65c00" />
            <Text className="font-mono text-[9px] font-bold text-on-surface-variant tracking-widest">
              {t('aiSathi:context.active')}
            </Text>
            <Text className="text-[12px] font-semibold text-primary flex-1" numberOfLines={1}>
              "{activeQuery}"
            </Text>
          </View>

          {/* Follow-up input */}
          <View
            className="bg-surface-container rounded-xl border border-outline-variant"
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, gap: 8 }}
          >
            <TextInput
              className="flex-1 text-[13px] text-on-surface"
              placeholder="Ask a follow-up question..."
              placeholderTextColor="#9aa0a6"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleResearch()}
              returnKeyType="send"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Pressable
                onPress={handleMic}
                className={`w-7 h-7 rounded-lg items-center justify-center ${isListening ? 'bg-primary/10' : ''}`}
                accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff size={15} color="#ba1a1a" /> : <Mic size={15} color="#5f6368" />}
              </Pressable>
              <Pressable
                onPress={() => handleResearch()}
                disabled={!input.trim()}
                className={`w-7 h-7 rounded-lg items-center justify-center ${input.trim() ? 'bg-primary' : 'opacity-40'}`}
                accessibilityLabel="Send"
              >
                <Send size={14} color={input.trim() ? '#fff' : '#aaa'} />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ─── HISTORY DRAWER (Modal) ───────────────────────── */}
      <Modal
        visible={isHistoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHistoryOpen(false)}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Drawer */}
          <View
            className="bg-surface"
            style={{ width: Math.min(300, Dimensions.get('window').width * 0.85), flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 0 }}
          >
            {/* Drawer header */}
            <View
              className="border-b border-outline-variant bg-surface-container-lowest"
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}
            >
              <View
                className="flex-1 flex-row items-center gap-2 border-b border-outline-variant/60 pb-2"
              >
                <Search size={14} color="#5f6368" />
                <TextInput
                  className="flex-1 text-[13px] text-on-surface"
                  placeholder={t('aiSathi:history.search')}
                  placeholderTextColor="#9aa0a6"
                />
              </View>
              <Pressable onPress={() => setIsHistoryOpen(false)} accessibilityLabel="Close history">
                <X size={20} color="#5f6368" />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 20 }}>
              {/* Recent */}
              <Text className="font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant mb-2 px-2">
                {t('aiSathi:history.recent')}
              </Text>
              {MOCK_HISTORY.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setIsHistoryOpen(false);
                    handleResearch(item.query);
                  }}
                  className="border-b border-outline-variant/40 px-2 py-3"
                  style={{ gap: 4 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View className="bg-primary/5 border border-primary/10 rounded px-1.5 py-0.5">
                      <Text className="font-mono text-[8px] font-bold text-primary">{item.tag}</Text>
                    </View>
                    <Text className="font-mono text-[9px] text-on-surface-variant">{item.time}</Text>
                  </View>
                  <Text className="text-[13px] font-medium text-on-surface">{item.label}</Text>
                </Pressable>
              ))}

              {/* Saved */}
              <Text className="font-mono text-[9px] font-bold tracking-[0.18em] text-on-surface-variant mb-2 px-2 mt-8">
                {t('aiSathi:history.saved')}
              </Text>
              {SAVED_WORKSPACES.map(item => (
                <Pressable
                  key={item.title}
                  className="border-b border-outline-variant/40 px-2 py-3 flex-row items-center gap-3"
                >
                  <Bookmark size={14} color="#e65c00" />
                  <Text className="text-[13px] font-medium text-on-surface flex-1">{item.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Backdrop */}
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
            onPress={() => setIsHistoryOpen(false)}
            accessibilityLabel="Close history"
          />
        </View>
      </Modal>

      {/* ─── EVIDENCE DRAWER (Modal) ──────────────────────── */}
      <Modal
        visible={isEvidenceOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEvidenceOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={() => setIsEvidenceOpen(false)}
          accessibilityLabel="Close evidence"
        />
        <View
          className="bg-surface rounded-t-3xl"
          style={{ maxHeight: '60%' }}
        >
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' }} />
          </View>

          {/* Header */}
          <View
            className="border-b border-outline-variant"
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 10 }}
          >
            <Text className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary flex-1">
              VERIFIED EVIDENCE
            </Text>
            <Pressable onPress={() => setIsEvidenceOpen(false)} accessibilityLabel="Close evidence">
              <X size={20} color="#5f6368" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
            {EVIDENCE_DATA.map((ev, i) => (
              <View
                key={i}
                className="rounded-xl border border-[#c3e6cb] bg-[#d4edda]/30 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: '#138808', gap: 6 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View className="rounded px-2 py-0.5 bg-[#d4edda] border border-[#c3e6cb]">
                    <Text className="font-mono text-[9px] font-bold text-[#155724]">{ev.type}</Text>
                  </View>
                </View>
                <Text className="text-[14px] font-semibold text-on-surface">{ev.doc}</Text>
                <Text className="text-[12px] text-on-surface-variant">{ev.source}</Text>
              </View>
            ))}

            <View className="bg-surface-container rounded-xl p-4 mt-2">
              <Text className="text-[12px] text-on-surface-variant text-center">
                Evidence is sourced from official BIS, gazette, and ministry documents. Verify with official portals for the latest updates.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
