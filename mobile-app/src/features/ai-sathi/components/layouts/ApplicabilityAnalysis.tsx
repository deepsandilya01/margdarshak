import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface Props {
  query: string;
  onNavigate?: (screen: string) => void;
}

const analysisData = {
  product: 'Secondary lithium battery pack for EV applications.',
  standards: ['IS 16046 (Part 2) : 2018', 'IS 17387 : 2020'],
  reason:
    'The product falls under the MeitY Compulsory Registration Order Phase V scope. Registration is mandatory before market entry.',
  status: 'CONFIRMED',
  qcoStatus: 'ACTIVE',
  testing: 'Thermal abuse, overcharge, forced discharge, short circuit tests are required.',
  certification: 'Scheme II - CRS Registration',
};

export function ApplicabilityAnalysis({ query, onNavigate }: Props) {
  return (
    <View style={{ gap: 20 }}>
      {/* Header */}
      <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)', paddingBottom: 20 }}>
        <Text className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">APPLICABILITY ANALYSIS</Text>
        <Text className="text-[22px] font-bold text-primary leading-tight">"{query}"</Text>
      </View>

      {/* Product + Standards row */}
      <View style={{ gap: 12 }}>
        {/* Product Understanding */}
        <View className="bg-surface border border-outline-variant rounded-2xl p-4" style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">PRODUCT UNDERSTANDING</Text>
            <Text className="text-primary text-[18px]">📦</Text>
          </View>
          <Text className="text-[14px] text-on-surface font-medium leading-5">{analysisData.product}</Text>
        </View>

        {/* Applicable Standards */}
        <View className="bg-surface border border-outline-variant rounded-2xl p-4" style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">APPLICABLE STANDARDS</Text>
            <Text className="text-primary text-[18px]">📖</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {analysisData.standards.map(std => (
              <Pressable
                key={std}
                onPress={() => onNavigate?.('Standards')}
                className="px-3 py-1.5 rounded-lg bg-surface-container"
              >
                <Text className="font-mono text-[12px] font-semibold text-primary">{std}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* AI Insight Card */}
      <View
        className="bg-surface border border-outline-variant rounded-2xl p-5"
        style={{ borderTopWidth: 3, borderTopColor: '#1a73e8', gap: 12 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text className="text-secondary text-[18px]">✨</Text>
          <Text className="font-mono text-[11px] font-bold tracking-[0.15em] text-secondary">AI INSIGHT: APPLICABILITY</Text>
        </View>
        <Text className="text-[14px] leading-6 text-on-surface">{analysisData.reason}</Text>

        {/* Status row */}
        <View style={{ flexDirection: 'row', gap: 24, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 12 }}>
          <View style={{ gap: 4 }}>
            <Text className="font-mono text-[9px] text-on-surface-variant">REGULATORY STATUS</Text>
            <View
              className="rounded px-2 py-0.5 border border-[#c3e6cb] bg-[#d4edda]"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#138808' }} />
              <Text className="font-mono text-[10px] font-bold text-[#155724]">{analysisData.status}</Text>
            </View>
          </View>
          <View style={{ gap: 4 }}>
            <Text className="font-mono text-[9px] text-on-surface-variant">QCO STATUS</Text>
            <View
              className="rounded px-2 py-0.5 border border-[#ffeeba] bg-[#fff3cd]"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b' }} />
              <Text className="font-mono text-[10px] font-bold text-[#856404]">{analysisData.qcoStatus}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Testing + Certification */}
      <View style={{ gap: 12 }}>
        <View className="bg-surface border border-outline-variant rounded-2xl p-4" style={{ gap: 8 }}>
          <Text className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">TESTING REQUIREMENTS</Text>
          <Text className="text-[13px] text-on-surface-variant leading-5">{analysisData.testing}</Text>
          <Pressable
            onPress={() => onNavigate?.('LabStack')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}
          >
            <Text className="font-mono text-[11px] font-bold text-primary">VIEW TESTING PROTOCOLS</Text>
            <ChevronRight size={12} color="#1a73e8" />
          </Pressable>
        </View>

        <View className="bg-surface border border-outline-variant rounded-2xl p-4" style={{ gap: 8 }}>
          <Text className="font-mono text-[10px] font-bold tracking-widest text-on-surface-variant">CERTIFICATION PATHWAY</Text>
          <Text className="text-[13px] font-semibold text-on-surface-variant">{analysisData.certification}</Text>
          <Pressable
            onPress={() => onNavigate?.('Certification')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}
          >
            <Text className="font-mono text-[11px] font-bold text-primary">VIEW PROCESS GUIDE</Text>
            <ChevronRight size={12} color="#1a73e8" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
