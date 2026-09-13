import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Columns, Trash2, X, Share2 } from 'lucide-react-native';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function ComparisonScreen() {
  const navigation = useNavigation<any>();
  const { comparisonItems, removeFromComparison, clearComparison } = useWorkspace();

  if (comparisonItems.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} className="p-2 rounded-full">
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
          <Text className="text-[20px] font-bold text-primary flex-1">Technical Analysis</Text>
        </View>
        <View className="flex-1 items-center justify-center p-6 pb-20">
          <View className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant items-center justify-center mb-4">
            <Columns size={32} color="#1a73e8" />
          </View>
          <Text className="text-[20px] font-bold text-primary mb-2 text-center">Comparison Workspace is Empty</Text>
          <Text className="text-[14px] text-on-surface-variant text-center mb-8 px-4">
            Add standards, QCOs, or labs to the comparison tray to view them side-by-side.
          </Text>
          <Pressable 
            onPress={() => navigation.navigate('MainTabs', { screen: 'Standards' })}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Browse Standards</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const allKeys = Array.from(
    new Set(comparisonItems.flatMap(item => Object.keys(item.attributes || {})))
  );

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'standard': return { bg: '#eae8e6', text: '#4a4643', border: '#cfcac5' }; // --tech-id
      case 'qco': return { bg: '#ffedec', text: '#9e1c15', border: '#ffc4c2' }; // --status-verify
      case 'lab': return { bg: '#edf7ec', text: '#0b5204', border: '#c8e8c5' }; // --status-compliant
      default: return { bg: '#edf7ec', text: '#0b5204', border: '#c8e8c5' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
      case 'accredited':
        return { bg: '#edf7ec', text: '#0b5204', border: '#c8e8c5', dot: '#0f6b06' };
      case 'draft':
        return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0', dot: '#94a3b8' };
      case 'amended':
      case 'under_revision':
      case 'pending':
        return { bg: '#fef3eb', text: '#a6460f', border: '#fcddc7', dot: '#f26b22' };
      case 'expired':
        return { bg: '#ffedec', text: '#9e1c15', border: '#ffc4c2', dot: '#ba1a1a' };
      default: 
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', dot: '#94a3b8' };
    }
  };

  const shareCsv = async () => {
    try {
      const rows = [
        ['Attribute', ...comparisonItems.map(item => item.label)],
        ...allKeys.map(key => [key, ...comparisonItems.map(item => item.attributes?.[key] ?? '')]),
      ];
      const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      await Share.share({
        message: csv,
        title: 'BIS-SATHI Comparison Report'
      });
    } catch (error) {
      console.error('Error sharing CSV:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
          <View>
            <Text className="text-[11px] font-bold uppercase tracking-widest text-secondary">Technical Analysis</Text>
            <Text className="text-[18px] font-bold text-primary">Comparison</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable 
            onPress={clearComparison}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant bg-surface"
          >
            <Trash2 size={14} color="#5f6368" />
            <Text className="text-[12px] font-bold text-on-surface-variant">Clear</Text>
          </Pressable>
          <Pressable 
            onPress={shareCsv}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg bg-primary"
          >
            <Share2 size={14} color="#ffffff" />
            <Text className="text-[12px] font-bold text-white">Share CSV</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header Row */}
          <View className="flex-row border-b border-outline-variant bg-surface">
            <View className="w-[120px] p-4 bg-surface-container-low border-r border-outline-variant justify-end">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Attribute</Text>
            </View>
            {comparisonItems.map(item => {
              const typeStyle = getTypeStyle(item.type);
              return (
                <View key={item.id} className="w-[240px] p-4 border-r border-outline-variant relative">
                  <Pressable 
                    onPress={() => removeFromComparison(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container hover:bg-[#ffdad6] z-10"
                  >
                    <X size={14} color="#5f6368" />
                  </Pressable>
                  
                  <View className="bg-[#eae8e6] border border-[#cfcac5] px-2 py-0.5 rounded self-start mb-2">
                    <Text className="font-mono text-[11px] font-bold text-[#4a4643]">{item.label}</Text>
                  </View>
                  
                  <Text className="text-[14px] font-bold text-primary mb-2 leading-5 pr-6" numberOfLines={3}>{item.title}</Text>
                  
                  <View className="px-2 py-0.5 rounded-full self-start border" style={[{ backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
                    <Text style={{ color: typeStyle.text }} className="text-[10px] font-bold uppercase tracking-wide">{item.type}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Body Rows */}
          {allKeys.map((key, i) => (
            <View key={key} className={`flex-row border-b border-outline-variant ${i % 2 === 0 ? 'bg-background' : 'bg-surface'}`}>
              <View className="w-[120px] p-4 bg-surface-container-low/50 border-r border-outline-variant justify-center">
                <Text className="text-[12px] font-bold text-on-surface-variant">{key}</Text>
              </View>
              {comparisonItems.map(item => {
                const val = item.attributes?.[key];
                const isStatus = key.toLowerCase() === 'status';

                return (
                  <View key={`${item.id}-${key}`} className="w-[240px] p-4 border-r border-outline-variant justify-center">
                    {isStatus && val ? (
                      <View className="flex-row self-start items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ backgroundColor: getStatusStyle(val.toLowerCase()).bg, borderColor: getStatusStyle(val.toLowerCase()).border }}>
                        <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusStyle(val.toLowerCase()).dot }} />
                        <Text style={{ color: getStatusStyle(val.toLowerCase()).text }} className="text-[11px] font-bold">{val}</Text>
                      </View>
                    ) : (
                      val ? (
                        <Text className="text-[13px] text-on-surface leading-5">{val}</Text>
                      ) : (
                        <Text className="text-[13px] text-[#94a3b8] italic">N/A</Text>
                      )
                    )}
                  </View>
                );
              })}
            </View>
          ))}
          {/* Bottom Padding */}
          <View className="h-8" />
        </ScrollView>
      </ScrollView>
    </View>
  );
}
