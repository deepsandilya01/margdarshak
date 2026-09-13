import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { useWorkspace } from '@/context/WorkspaceContext';
import { StatusPill, TechIdentifier } from '../../components/feedback/StatusPill';

type FilterStatus = 'all' | 'mandatory_qco' | 'active' | 'superseded' | 'under_revision';

export default function StandardsExplorerScreen() {
  const { t } = useTranslation(['common', 'home']);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addToComparison, removeFromComparison, isInComparison, saveItem, unsaveItem, isSaved } = useWorkspace();
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState(route.params?.search || '');

  // Keep search query in sync if route params change
  React.useEffect(() => {
    if (route.params?.search !== undefined && route.params.search !== searchQuery) {
      setSearchQuery(route.params.search);
    }
  }, [route.params?.search]);

  const { standards, isLoading } = useStandards({ search: searchQuery || undefined, status: filterStatus });

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Mandatory', value: 'mandatory_qco' },
    { label: 'Active', value: 'active' },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-6 bg-surface-container-low border-b border-outline-variant pb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-secondary text-[11px] font-semibold uppercase tracking-widest">Indian Standards Registry v2025</Text>
        </View>
        <Text className="text-[28px] font-bold text-on-surface mb-2">Standards Registry</Text>
        <Text className="text-[14px] text-on-surface-variant mb-4">Searchable statutory baseline covering active Quality Control Orders (QCOs) and Compulsory Registration Schemes (CRS).</Text>
        
        {/* Search */}
        <View className="flex-row items-center bg-surface px-4 py-3 rounded-xl border border-outline-variant mb-3">
          <TextInput
            className="flex-1 text-[15px] font-medium text-on-surface"
            placeholder="Search IS code, title, division..."
            placeholderTextColor="#7d7672"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View className="flex-row gap-2">
          {filterTabs.map(tab => (
            <Pressable
              key={tab.value}
              onPress={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg ${filterStatus === tab.value ? 'bg-primary' : 'bg-surface border border-outline-variant'}`}
            >
              <Text className={`text-[13px] font-medium ${filterStatus === tab.value ? 'text-on-primary' : 'text-on-surface-variant'}`}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={standards}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: s }) => {
          const saved = isSaved(s.id);
          const inCompare = isInComparison(s.id);
          
          return (
            <Pressable 
              onPress={() => navigation.navigate('StandardDetail', { id: s.id })}
              className="bg-surface rounded-2xl p-5 mb-4 border border-outline-variant"
            >
              <View className="flex-row items-center justify-between mb-3">
                <TechIdentifier code={s.code} size="md" />
                <StatusPill status={s.status} size="sm" />
              </View>
              
              <Text className="text-[16px] font-semibold text-primary mb-1">{s.shortTitle}</Text>
              <Text className="text-[13px] text-on-surface-variant mb-4 line-clamp-2">{s.description}</Text>
              
              <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-surface-container-low">
                <View className="flex-row gap-3">
                  <View className="px-2 py-1 rounded bg-surface-container">
                    <Text className="font-mono text-[11px] text-on-surface-variant">{s.division}</Text>
                  </View>
                  <Text className="font-mono text-[12px] text-primary font-medium my-auto">{s.accreditedLabs} Labs</Text>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Pressable 
                    onPress={() => inCompare ? removeFromComparison(s.id) : addToComparison({ id: s.id, type: 'standard', label: s.code, title: s.title, attributes: {} })}
                    className={`p-2 rounded-lg ${inCompare ? 'bg-primary' : 'bg-surface-container'}`}
                  >
                    <Text className={`text-[12px] font-bold ${inCompare ? 'text-on-primary' : 'text-on-surface-variant'}`}>{inCompare ? 'Added' : 'Compare'}</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => saved ? unsaveItem(s.id) : saveItem({ id: s.id, type: 'standard', label: s.code, title: s.title })}
                    className={`p-2 rounded-lg ${saved ? 'bg-secondary-container' : 'bg-surface-container'}`}
                  >
                    <Text className={`text-[12px] font-bold ${saved ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>{saved ? 'Saved' : 'Save'}</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-on-surface-variant text-[15px]">No standards found.</Text>
          </View>
        }
      />
    </View>
  );
}
