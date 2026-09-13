import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Props {
  query: string;
}

const comparisonData = [
  {
    attr: 'Scope',
    a: 'General purpose portable lithium cells and batteries.',
    b: 'Secondary lithium cells and batteries for EV applications.',
    diff: 'IS 16046 applies to general electronics, IS 17387 is strictly for EVs.',
  },
  {
    attr: 'Testing Requirements',
    a: 'Basic thermal and electrical abuse tests.',
    b: 'Rigorous vibration, shock, and extended thermal propagation tests.',
    diff: 'EV standard requires severe mechanical and thermal propagation testing.',
  },
  {
    attr: 'Certification Route',
    a: 'Scheme II (CRS)',
    b: 'Scheme II (CRS) with additional safety declarations.',
    diff: 'Similar route, higher documentation burden for EVs.',
  },
];

export function ComparisonWorkspace({ query }: Props) {
  return (
    <View style={{ gap: 20 }}>
      {/* Header */}
      <View style={{ gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)', paddingBottom: 20 }}>
        <Text className="font-mono text-[10px] font-bold tracking-[0.2em] text-secondary">COMPARISON WORKSPACE</Text>
        <Text className="text-[22px] font-bold text-primary leading-tight">"{query}"</Text>
      </View>

      {/* Column headers */}
      <View
        className="bg-surface-container-low border border-outline-variant rounded-xl p-3"
        style={{ flexDirection: 'row', gap: 8 }}
      >
        <Text className="font-mono text-[10px] font-bold text-on-surface-variant flex-1">ATTRIBUTE</Text>
        <Text className="font-mono text-[10px] font-bold text-primary" style={{ width: 90 }}>IS 16046</Text>
        <Text className="font-mono text-[10px] font-bold text-secondary" style={{ width: 90 }}>IS 17387</Text>
      </View>

      {/* Comparison rows */}
      {comparisonData.map((row, i) => (
        <View
          key={i}
          className="bg-surface border border-outline-variant rounded-2xl overflow-hidden"
          style={{ gap: 0 }}
        >
          {/* Attribute label */}
          <View className="bg-surface-container-low px-4 py-2">
            <Text className="font-mono text-[11px] font-bold text-on-surface">{row.attr}</Text>
          </View>

          {/* Values */}
          <View style={{ flexDirection: 'row', gap: 0 }}>
            <View style={{ flex: 1, padding: 12, borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.06)' }}>
              <Text className="font-mono text-[9px] font-bold text-primary mb-1">IS 16046</Text>
              <Text className="text-[12px] text-on-surface-variant leading-5">{row.a}</Text>
            </View>
            <View style={{ flex: 1, padding: 12 }}>
              <Text className="font-mono text-[9px] font-bold text-secondary mb-1">IS 17387</Text>
              <Text className="text-[12px] text-on-surface-variant leading-5">{row.b}</Text>
            </View>
          </View>

          {/* Difference */}
          <View className="bg-primary/5 border-t border-outline-variant px-4 py-3">
            <Text className="font-mono text-[9px] font-bold text-primary mb-1">DIFFERENCE</Text>
            <Text className="text-[12px] text-on-surface leading-5">{row.diff}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
