import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlaskConical, Search, MapPin, Clock, CheckCircle2, XCircle, ChevronDown, Filter, Bookmark, ArrowLeftRight } from 'lucide-react-native';
import { useLabs } from '../../features/laboratories/hooks/useLabs';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function LabFinderScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const { saveItem, unsaveItem, isSaved, addToComparison, removeFromComparison, isInComparison } = useWorkspace();

  const { labs, states, disciplines, isLoading, error } = useLabs({
    search: search || undefined,
    state: filterState || undefined,
    discipline: filterDiscipline || undefined,
  });

  const getStatusColor = (status: string) => {
    if (status === 'Accredited') {
      return { bg: '#edf7ec', text: '#0b5204' }; // --status-compliant
    }
    return { bg: '#ffedec', text: '#9e1c15' }; // --status-verify for expired/suspended
  };

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-6 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center">
          <FlaskConical size={22} color="#1a73e8" />
        </View>
        <View>
          <Text className="text-[28px] font-bold text-primary">Lab Finder</Text>
          <Text className="text-[14px] text-on-surface-variant uppercase tracking-widest font-bold">NABL Accredited Laboratory Network</Text>
        </View>
      </View>

      <View className="flex-row items-center bg-surface px-4 py-3 rounded-xl border border-outline-variant mb-4">
        <Search size={18} color="#5f6368" />
        <TextInput
          className="flex-1 text-[15px] font-medium text-on-surface ml-3"
          placeholder="Search lab name, accr no, city..."
          placeholderTextColor="#7d7672"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pressable
            onPress={() => setFilterState('')}
            className={`px-4 py-2 rounded-xl border flex-row items-center gap-1 ${filterState === '' ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
          >
            <Text className={`text-[13px] font-semibold ${filterState === '' ? 'text-white' : 'text-on-surface-variant'}`}>All States</Text>
            {filterState === '' && <ChevronDown size={14} color="#ffffff" />}
          </Pressable>
          {states.map(s => (
            <Pressable
              key={s}
              onPress={() => setFilterState(s)}
              className={`px-4 py-2 rounded-xl border ${filterState === s ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
            >
              <Text className={`text-[13px] font-semibold ${filterState === s ? 'text-white' : 'text-on-surface-variant'}`}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pressable
            onPress={() => setFilterDiscipline('')}
            className={`px-4 py-2 rounded-xl border flex-row items-center gap-1 ${filterDiscipline === '' ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
          >
            <Text className={`text-[13px] font-semibold ${filterDiscipline === '' ? 'text-white' : 'text-on-surface-variant'}`}>All Disciplines</Text>
            {filterDiscipline === '' && <ChevronDown size={14} color="#ffffff" />}
          </Pressable>
          {disciplines.map(d => (
            <Pressable
              key={d}
              onPress={() => setFilterDiscipline(d)}
              className={`px-4 py-2 rounded-xl border ${filterDiscipline === d ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
            >
              <Text className={`text-[13px] font-semibold ${filterDiscipline === d ? 'text-white' : 'text-on-surface-variant'}`}>{d}</Text>
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
      ) : labs.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-surface-container-high items-center justify-center mb-4">
            <Filter size={32} color="#5f6368" />
          </View>
          <Text className="text-[18px] font-bold text-primary mb-2">No labs found</Text>
          <Text className="text-[14px] text-on-surface-variant text-center">Try adjusting your search filters.</Text>
        </View>
      ) : (
        <FlatList
          data={labs}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const statusStyle = getStatusColor(item.nablStatus);
            return (
              <Pressable
                onPress={() => navigation.navigate('LabDetail', { id: item.id })}
                className="bg-surface rounded-2xl p-5 mb-4 border border-outline-variant shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 pr-3">
                    <View className="bg-[#f8fafc] px-2 py-1 rounded-md border border-[#e2e8f0] self-start mb-1.5">
                      <Text className="font-mono text-[11px] font-bold text-[#64748b]">{item.accreditationNumber}</Text>
                    </View>
                    <Text className="text-[16px] font-bold text-primary mb-1">{item.name}</Text>
                    <Text className="text-[12px] text-on-surface-variant">{item.city}, {item.state}</Text>
                  </View>
                  <View className="items-end gap-1.5 shrink-0">
                    <View className="px-2.5 py-1 rounded-full border" style={[{ backgroundColor: statusStyle.bg, borderColor: `${statusStyle.text}20` }]}>
                      <Text style={{ color: statusStyle.text }} className="text-[11px] font-bold tracking-wide">{item.nablStatus === 'Accredited' ? 'Accredited' : 'Expired'}</Text>
                    </View>
                    <Text className="font-mono text-[11px] text-on-surface-variant">{item.type}</Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-1.5 mb-4">
                  {item.disciplines.map(d => (
                    <View key={d} className="px-2 py-0.5 rounded-md bg-surface-container-low border border-outline-variant">
                      <Text className="font-mono text-[11px] text-on-surface-variant">{d}</Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row items-center justify-between border-t border-outline-variant pt-3">
                  <View className="flex-row items-center gap-1.5">
                    <Clock size={14} color="#5f6368" />
                    <Text className="text-[12px] text-on-surface-variant">{item.turnaroundDays} days turnaround</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    {item.onlineBooking ? (
                      <CheckCircle2 size={14} color="#0b5204" />
                    ) : (
                      <XCircle size={14} color="#5f6368" />
                    )}
                    <Text className="text-[12px] text-on-surface-variant">{item.onlineBooking ? 'Online booking' : 'Phone booking'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-end gap-3 mt-4 pt-3 border-t border-outline-variant">
                  <Pressable 
                    onPress={(e) => { e.stopPropagation(); if (isSaved(item.id)) unsaveItem(item.id); else saveItem({ id: item.id, type: 'lab', label: item.accreditationNumber, title: item.name }); }}
                    className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant bg-surface"
                  >
                    <Bookmark size={14} color={isSaved(item.id) ? "#1a73e8" : "#5f6368"} fill={isSaved(item.id) ? "#1a73e8" : "transparent"} />
                    <Text className={`text-[13px] font-bold ${isSaved(item.id) ? 'text-primary' : 'text-on-surface'}`}>{isSaved(item.id) ? 'Saved' : 'Save'}</Text>
                  </Pressable>
                  <Pressable 
                    onPress={(e) => { 
                      e.stopPropagation(); 
                      if (isInComparison(item.id)) {
                        removeFromComparison(item.id);
                      } else {
                        addToComparison({ id: item.id, type: 'lab', label: item.accreditationNumber, title: item.name, attributes: { City: item.city, State: item.state, Type: item.type, Disciplines: item.disciplines.join(', '), Turnaround: `${item.turnaroundDays} days` } }); 
                      }
                    }}
                    className={`flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant ${isInComparison(item.id) ? 'bg-primary' : 'bg-surface'}`}
                  >
                    <ArrowLeftRight size={14} color={isInComparison(item.id) ? "#ffffff" : "#5f6368"} />
                    <Text className={`text-[13px] font-bold ${isInComparison(item.id) ? 'text-on-primary' : 'text-on-surface'}`}>{isInComparison(item.id) ? 'Added' : 'Compare'}</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
