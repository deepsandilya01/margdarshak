import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FileText, Search, ChevronRight, Filter } from 'lucide-react-native';
import { useQCOs } from '../../features/qco/hooks/useQCOs';
import { useWorkspace } from '../../context/WorkspaceContext';

type FilterStatus = 'all' | 'active' | 'draft' | 'amended';

export default function QCOExplorerScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const { addToComparison, removeFromComparison, isInComparison } = useWorkspace();
  
  const { qcos, isLoading, error } = useQCOs({ 
    search: search || undefined, 
    status: filterStatus 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#edf7ec', text: '#0b5204' };
      case 'draft': return { bg: '#f8fafc', text: '#64748b' };
      case 'amended': return { bg: '#fef3eb', text: '#a6460f' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-6 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-[#ffedec] flex items-center justify-center">
          <FileText size={22} color="#9e1c15" />
        </View>
        <View>
          <Text className="text-[28px] font-bold text-primary">QCO Explorer</Text>
          <Text className="text-[14px] text-on-surface-variant">Mandatory Quality Control Orders</Text>
        </View>
      </View>

      <View className="flex-row items-center bg-surface px-4 py-3 rounded-xl border border-outline-variant mb-4">
        <Search size={18} color="#5f6368" />
        <TextInput
          className="flex-1 text-[15px] font-medium text-on-surface ml-3"
          placeholder="Search QCO, ministry, title..."
          placeholderTextColor="#7d7672"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['all', 'active', 'draft', 'amended'] as const).map(s => (
            <Pressable
              key={s}
              onPress={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl border ${filterStatus === s ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
            >
              <Text className={`text-[13px] font-semibold ${filterStatus === s ? 'text-white' : 'text-on-surface-variant'}`}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-error">{error}</Text>
        </View>
      ) : qcos.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-surface-container-high items-center justify-center mb-4">
            <Filter size={32} color="#5f6368" />
          </View>
          <Text className="text-[18px] font-bold text-primary mb-2">No QCOs found</Text>
          <Text className="text-[14px] text-on-surface-variant text-center">Try adjusting your search or filters.</Text>
        </View>
      ) : (
        <FlatList
          data={qcos}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const statusStyle = getStatusColor(item.status);
            return (
              <Pressable 
                onPress={() => navigation.navigate('QCODetail', { id: item.id })}
                className="bg-surface rounded-2xl p-5 mb-4 border border-outline-variant shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="px-2.5 py-1 rounded-md bg-surface-container-highest">
                    <Text className="font-mono text-[11px] font-bold text-on-surface">{item.ministry_short}</Text>
                  </View>
                  <View style={{ backgroundColor: statusStyle.bg }} className="px-2.5 py-1 rounded-md">
                    <Text style={{ color: statusStyle.text }} className="font-mono text-[11px] font-bold uppercase">{item.status}</Text>
                  </View>
                </View>
                <Text className="text-[16px] font-bold text-primary mb-1">{item.title}</Text>
                <Text className="text-[13px] text-on-surface-variant mb-4 leading-5" numberOfLines={2}>
                  {item.summary}
                </Text>
                <View className="flex-row items-center justify-between mt-auto">
                  <Text className="text-[12px] font-mono text-on-surface-variant">Eff: {item.effectiveDate}</Text>
                  <View className="flex-row items-center gap-2">
                    <Pressable 
                      onPress={(e) => {
                        e.stopPropagation();
                        isInComparison(item.id) 
                          ? removeFromComparison(item.id) 
                          : addToComparison({ id: item.id, type: 'qco', label: item.id, title: item.title, attributes: {} });
                      }}
                      className={`px-3 py-1.5 rounded-lg border ${isInComparison(item.id) ? 'bg-primary border-primary' : 'bg-surface-container-low border-outline-variant'}`}
                    >
                      <Text className={`text-[12px] font-bold ${isInComparison(item.id) ? 'text-on-primary' : 'text-primary'}`}>{isInComparison(item.id) ? 'Added' : 'Compare'}</Text>
                    </Pressable>
                    <View className="flex-row items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                      <Text className="text-[12px] font-bold text-primary">View</Text>
                      <ChevronRight size={14} color="#1a73e8" />
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
