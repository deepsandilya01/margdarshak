import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { TechIdentifier, StatusPill } from '../../components/feedback/StatusPill';
import { ChevronLeft, ArrowRight, Filter, BookmarkPlus } from 'lucide-react-native';

export default function ProductResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const answers = (route.params?.answers ?? {}) as Record<string, string>;
  const { standards } = useStandards();
  
  const [filterVisible, setFilterVisible] = useState(false);

  const relevantStandards = answers.category
    ? standards.filter(s => s.tags.some(t => answers.category?.toLowerCase().includes(t.toLowerCase())) || s.status === 'mandatory_qco').slice(0, 4)
    : standards.slice(0, 4);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center gap-3">
        <Pressable onPress={() => navigation.goBack()} className="p-2 rounded-full hover:bg-surface-container">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[20px] font-bold text-primary">Discovery Results</Text>
          <Text className="text-[12px] text-on-surface-variant line-clamp-1">
            {answers.category ?? 'All categories'} Â· {answers.environment ?? 'Any env'}
          </Text>
        </View>
        <Pressable onPress={() => setFilterVisible(!filterVisible)} className="p-2 rounded-lg bg-surface-container-low border border-outline-variant">
          <Filter size={18} color="#1a73e8" />
        </Pressable>
      </View>

      <FlatList
        data={relevantStandards}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-[16px] text-on-surface-variant font-medium">No standards found.</Text>
            <Text className="text-[13px] text-on-surface-variant mt-2 text-center px-6">
              Try adjusting your inputs in the previous discovery step.
            </Text>
          </View>
        }
        renderItem={({ item: s }) => (
          <View className="bg-surface rounded-2xl p-5 mb-4 border border-outline-variant">
            <View className="flex-row justify-between mb-3">
              <TechIdentifier code={s.code} size="md" />
              <StatusPill status={s.status} size="sm" />
            </View>
            
            <Text className="text-[16px] font-semibold text-primary mb-2 leading-5">{s.shortTitle}</Text>
            <Text className="text-[13px] text-on-surface-variant leading-5 mb-4" numberOfLines={3}>
              {s.description}
            </Text>
            
            <View className="flex-row flex-wrap gap-2 mb-5">
              <View className="px-2 py-1 rounded bg-surface-container">
                <Text className="font-mono text-[11px] text-on-surface-variant">{s.division}</Text>
              </View>
              <View className="px-2 py-1 rounded bg-[#e8f0fe]">
                <Text className="font-mono text-[11px] text-[#1a73e8]">{s.accreditedLabs} labs</Text>
              </View>
              {s.mandatoryUnder && (
                <View className="px-2 py-1 rounded bg-[#ffedec]">
                  <Text className="font-mono text-[11px] text-[#9e1c15]">Mandatory: {s.mandatoryUnder}</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-2">
              <Pressable 
                onPress={() => navigation.navigate('StandardDetail', { id: s.id })}
                className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary rounded-xl"
              >
                <Text className="text-white font-semibold">View Standard</Text>
                <ArrowRight size={16} color="#ffffff" />
              </Pressable>
              
              <Pressable className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl items-center justify-center">
                <BookmarkPlus size={18} color="#1a73e8" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
