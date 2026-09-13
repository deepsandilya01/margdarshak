import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';

interface Props {
  query: string;
  onNavigate?: (screen: string) => void;
}

export function KnowledgeAnswer({ query, onNavigate }: Props) {
  const exploreTopics = ['ISI Mark', 'Certification', 'Standards', 'Hallmarking'];

  return (
    <View style={{ gap: 24 }}>
      {/* Header */}
      <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)', paddingBottom: 20 }}>
        <Text className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">AI SATHI ANSWER</Text>
        <Text className="text-[22px] font-bold text-primary leading-tight">"{query}"</Text>
      </View>

      {/* Main answer */}
      <Text className="text-[15px] leading-7 text-on-surface">
        The Bureau of Indian Standards (BIS) is the National Standards Body of India, functioning under the Ministry of Consumer Affairs, Food &amp; Public Distribution. It is responsible for the harmonious development of standardization, marking, and quality certification of goods.
      </Text>

      {/* Key Points */}
      <View style={{ gap: 12 }}>
        <Text className="font-mono text-[11px] font-bold tracking-[0.15em] text-on-surface-variant">KEY POINTS</Text>
        {[
          'Established by the BIS Act, 2016.',
          'Formulates Indian Standards (IS) for various products and processes.',
          'Operates product certification schemes (e.g., ISI mark, CRS registration).',
          'Manages hallmarking of precious metals like gold and silver.',
        ].map((point, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle2 size={16} color="#138808" style={{ marginTop: 2 }} />
            <Text className="text-[14px] text-on-surface leading-6 flex-1">{point}</Text>
          </View>
        ))}
      </View>

      {/* Why it matters */}
      <View
        className="bg-surface-container-low border border-outline-variant rounded-xl p-5"
        style={{ borderLeftWidth: 3, borderLeftColor: '#138808' }}
      >
        <Text className="font-mono text-[11px] font-bold tracking-[0.15em] text-secondary mb-2">WHY IT MATTERS</Text>
        <Text className="text-[13px] text-on-surface-variant leading-6">
          BIS ensures traceability and accountability in manufacturing, protecting consumers from substandard products. Without BIS certification, many critical products (like electronics and toys) cannot legally be sold in India under active Quality Control Orders (QCOs).
        </Text>
      </View>

      {/* Explore more */}
      <View style={{ gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', paddingTop: 20 }}>
        <Text className="font-mono text-[11px] font-bold tracking-[0.15em] text-on-surface-variant">EXPLORE MORE</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {exploreTopics.map(topic => (
            <Pressable
              key={topic}
              onPress={() => onNavigate?.('Standards')}
              className="px-4 py-2 bg-surface border border-outline-variant rounded-lg"
            >
              <Text className="text-[13px] font-medium text-primary">{topic}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
