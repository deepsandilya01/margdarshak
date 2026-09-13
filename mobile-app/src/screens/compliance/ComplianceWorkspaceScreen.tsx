import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LayoutDashboard, Plus, Search, BookOpen, Gavel, FlaskConical, Verified, Badge, CheckCircle2, CircleDashed, Circle, X, Bookmark } from 'lucide-react-native';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function ComplianceWorkspaceScreen() {
  const navigation = useNavigation<any>();
  const { savedItems, unsaveItem } = useWorkspace();

  const JOURNEY_STEPS = [
    { step: 1, title: 'Regulatory Discovery', status: 'completed', icon: Search },
    { step: 2, title: 'Standard Identification', status: 'completed', icon: BookOpen },
    { step: 3, title: 'QCO Verification', status: 'completed', icon: Gavel },
    { step: 4, title: 'Lab Booking & Testing', status: 'in_progress', icon: FlaskConical },
    { step: 5, title: 'Certificate Application', status: 'not_started', icon: Verified },
    { step: 6, title: 'ISI Mark License', status: 'not_started', icon: Badge },
  ];

  const getStepColor = (status: string) => {
    switch(status) {
      case 'completed': return { text: '#1f6e43', bg: '#edf7ec', border: '#c8e8c5' }; // --accent-green
      case 'in_progress': return { text: '#c4622d', bg: '#fef3eb', border: '#fcddc7' }; // --accent-saffron
      default: return { text: '#5f6368', bg: '#f8fafc', border: '#e2e8f0' }; // not_started
    }
  };

  const renderIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 size={16} color="#1f6e43" />;
      case 'in_progress': return <CircleDashed size={16} color="#c4622d" />;
      default: return <Circle size={16} color="#5f6368" />;
    }
  };

  const getSavedIcon = (type: string) => {
    switch(type) {
      case 'standard': return <BookOpen size={18} color="#5f6368" />;
      case 'qco': return <Gavel size={18} color="#5f6368" />;
      case 'lab': return <FlaskConical size={18} color="#5f6368" />;
      default: return <Bookmark size={18} color="#5f6368" />;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 pt-8 pb-4">
        <View className="flex-row items-center gap-1.5 mb-2">
          <LayoutDashboard size={14} color="#b89752" />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-[#b89752]">Active Compliance Management</Text>
        </View>
        <Text className="text-[28px] font-bold text-primary mb-4">Workspace</Text>
        
        <Pressable 
          onPress={() => navigation.navigate('DiscoveryStack', { screen: 'ProductDiscovery' })}
          className="flex-row items-center justify-center gap-2 bg-primary py-3 rounded-xl mb-4"
        >
          <Plus size={18} color="#ffffff" />
          <Text className="text-white font-bold text-[14px]">New Journey</Text>
        </Pressable>
        <Text className="text-[14px] text-on-surface-variant leading-5 mb-8">
          Track active compliance journeys, monitor testing progress, and access saved technical resources.
        </Text>

        <Text className="text-[20px] font-bold text-on-surface mb-4">Active Journey</Text>
        
        <Pressable 
          onPress={() => navigation.navigate('ComplianceJourneyDetail', { id: 'CJ-2025-001' })}
          className="bg-surface-container-low rounded-2xl border border-outline-variant p-5 mb-8"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-3">
              <View className="bg-[#eae8e6] border border-[#cfcac5] px-2 py-0.5 rounded self-start mb-1.5">
                <Text className="font-mono text-[11px] font-bold text-[#4a4643]">JRN-2025-LI-0047</Text>
              </View>
              <Text className="text-[16px] font-bold text-on-surface leading-5 mb-1">EV Battery Pack — MeitY CRS Compliance</Text>
              <Text className="text-[13px] text-on-surface-variant">IS 16046 (Part 2):2018 · Scheme II (CRS)</Text>
            </View>
            <View className="items-end gap-1.5 shrink-0">
              <View className="px-2.5 py-1 rounded-full border bg-[#fef3eb] border-[#fcddc7]">
                <Text className="text-[11px] font-bold text-[#a6460f] uppercase tracking-wide">In Progress</Text>
              </View>
              <Text className="font-mono text-[10px] text-on-surface-variant">Started: 12 Aug 2025</Text>
            </View>
          </View>

          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-[12px] font-mono text-on-surface-variant">Progress</Text>
              <Text className="text-[12px] font-mono font-bold text-on-surface">3 / 6 steps</Text>
            </View>
            <View className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <View className="h-full bg-[#b89752] w-[50%] rounded-full" />
            </View>
          </View>

          <View className="gap-2">
            {JOURNEY_STEPS.map((step) => {
              const colors = getStepColor(step.status);
              const StepIcon = step.icon;
              return (
                <View 
                  key={step.step}
                  className="flex-row items-center gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  {renderIcon(step.status)}
                  <Text className="font-mono text-[11px] font-bold shrink-0" style={{ color: colors.text }}>Step {step.step}</Text>
                  <Text className="flex-1 text-[13px] font-bold" style={{ color: colors.text }}>{step.title}</Text>
                  <StepIcon size={16} color={colors.text} opacity={0.8} />
                </View>
              );
            })}
          </View>
        </Pressable>

        <Text className="text-[20px] font-bold text-on-surface mb-4">Saved Resources ({savedItems.length})</Text>
        <View className="bg-surface-container-low rounded-2xl border border-outline-variant p-4 mb-8">
          {savedItems.length === 0 ? (
            <View className="items-center justify-center py-6">
              <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center mb-3">
                <Bookmark size={24} color="#5f6368" />
              </View>
              <Text className="text-[16px] font-bold text-primary mb-1">No saved items yet</Text>
              <Text className="text-[13px] text-on-surface-variant text-center">Bookmark standards, QCOs, and labs to see them here.</Text>
            </View>
          ) : (
            <View className="gap-3">
              {savedItems.map(item => (
                <View key={item.id} className="flex-row items-center gap-3 p-3 rounded-xl bg-surface">
                  {getSavedIcon(item.type)}
                  <View className="flex-1">
                    <View className="bg-[#eae8e6] border border-[#cfcac5] px-2 py-0.5 rounded self-start mb-1">
                      <Text className="font-mono text-[10px] font-bold text-[#4a4643]">{item.label}</Text>
                    </View>
                    <Text className="text-[13px] font-bold text-on-surface leading-4 pr-2" numberOfLines={2}>{item.title}</Text>
                  </View>
                  <Pressable 
                    onPress={() => unsaveItem(item.id)}
                    className="p-2 -mr-2 rounded-full"
                  >
                    <X size={16} color="#9e1c15" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

      </View>
    </ScrollView>
  );
}
