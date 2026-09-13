import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface Props {
  query: string;
  onNavigate?: (screen: string) => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Understand Product Requirement',
    desc: 'Determine if your product falls under mandatory certification (like CRO or QCO) by checking the HS code and BIS schedules.',
    action: 'Check Applicability',
    screen: 'Standards',
  },
  {
    num: '02',
    title: 'Identify Applicable Standard',
    desc: 'Find the exact Indian Standard (IS) that dictates the safety and testing requirements for your specific product category.',
    action: 'Search Standards',
    screen: 'Standards',
  },
  {
    num: '03',
    title: 'Complete Testing',
    desc: 'Submit product samples to a NABL-accredited or BIS-recognized laboratory for testing against the applicable standard.',
    action: 'Find Labs',
    screen: 'LabFinderStack',
  },
  {
    num: '04',
    title: 'Submit Application',
    desc: 'Compile the test report and required documents, and submit the application via the BIS Manakonline portal.',
    action: 'View Portal',
    screen: null,
  },
  {
    num: '05',
    title: 'Maintain Compliance',
    desc: 'Once granted, affix the ISI mark or CRS label correctly. Renew the licence periodically and undergo surveillance audits.',
    action: null,
    screen: null,
  },
];

export function ProcessGuide({ query, onNavigate }: Props) {
  return (
    <View style={{ gap: 24 }}>
      {/* Header */}
      <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)', paddingBottom: 20 }}>
        <Text className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">PROCESS GUIDE</Text>
        <Text className="text-[22px] font-bold text-primary leading-tight">"{query}"</Text>
      </View>

      {/* Steps */}
      <View style={{ gap: 16 }}>
        {STEPS.map((step, idx) => (
          <View key={step.num} style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
            {/* Number indicator */}
            <View
              className="bg-surface border-2 border-primary/20 rounded-2xl items-center justify-center"
              style={{ width: 48, height: 48, flexShrink: 0 }}
            >
              <Text className="font-mono text-[14px] font-bold text-primary">{step.num}</Text>
            </View>

            {/* Content */}
            <View className="flex-1 bg-surface border border-outline-variant rounded-2xl p-4" style={{ gap: 8 }}>
              <Text className="text-[15px] font-bold text-on-surface">{step.title}</Text>
              <Text className="text-[13px] text-on-surface-variant leading-5">{step.desc}</Text>
              {step.action && (
                <Pressable
                  onPress={() => step.screen && onNavigate?.(step.screen)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}
                >
                  <Text className="font-mono text-[11px] font-bold text-primary uppercase tracking-wider">
                    {step.action}
                  </Text>
                  <ChevronRight size={12} color="#1a73e8" />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Disclaimer note */}
      <View className="bg-surface-container p-4 rounded-xl border border-outline-variant" style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Text className="text-secondary text-[20px]" style={{ lineHeight: 24 }}>ℹ</Text>
        <Text className="text-[12px] text-on-surface-variant flex-1 leading-5">
          This is a generalized pathway. The exact timeline and requirements may vary depending on whether the product falls under Scheme I (ISI Mark) or Scheme II (CRS).
        </Text>
      </View>
    </View>
  );
}
