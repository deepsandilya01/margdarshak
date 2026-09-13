import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Building, Calendar, FileText, CheckCircle2, AlertTriangle, Scale, ArrowRight } from 'lucide-react-native';
import { useQCOs } from '../../features/qco/hooks/useQCOs';
import { EvidenceBadge } from '../../features/evidence/components/EvidenceBadge';

export default function QCODetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {};
  
  const { getById } = useQCOs();
  const qco = id ? getById(id) : null;

  if (!qco) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <AlertTriangle size={48} color="#dc2626" className="mb-4" />
        <Text className="text-[20px] font-bold text-primary mb-2">QCO Not Found</Text>
        <Text className="text-[14px] text-on-surface-variant text-center mb-6">This Quality Control Order does not exist in our database.</Text>
        <Pressable 
          onPress={() => navigation.goBack()}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Back to Explorer</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#edf7ec', text: '#0b5204' };
      case 'draft': return { bg: '#f8fafc', text: '#64748b' };
      case 'amended': return { bg: '#fef3eb', text: '#a6460f' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const statusStyle = getStatusColor(qco.status);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center gap-3 sticky top-0 z-10">
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[14px] font-mono text-on-surface-variant uppercase tracking-widest">{qco.code}</Text>
        </View>
      </View>

      <View className="p-5">
        <View className="flex-row items-center gap-2 mb-4 flex-wrap">
          <View className="bg-surface-container-highest px-3 py-1.5 rounded-lg">
            <Text className="font-mono text-[12px] font-bold text-on-surface">{qco.code}</Text>
          </View>
          <View className="px-3 py-1.5 rounded-lg border" style={[{ backgroundColor: statusStyle.bg, borderColor: `${statusStyle.text}20` }]}>
            <Text style={{ color: statusStyle.text }} className="font-mono text-[12px] font-bold uppercase">{qco.status}</Text>
          </View>
          {qco.evidence && (
            <EvidenceBadge status={qco.evidence.status} />
          )}
        </View>

        <Text className="text-[24px] font-bold text-primary mb-3 leading-8">{qco.title}</Text>
        <Text className="text-[14px] text-on-surface-variant leading-6 mb-8">{qco.description}</Text>

        <View className="flex-row flex-wrap gap-3 mb-8">
          {[
            { label: 'Ministry', value: qco.ministry_short, icon: Building },
            { label: 'Gazette Ref', value: qco.gazetteRef.split(',')[0], icon: FileText },
            { label: 'Effective Date', value: qco.effectiveDate, icon: Calendar },
            { label: 'Certification', value: qco.certificationPath.split(' ')[0], icon: CheckCircle2 },
          ].map((item, index) => (
            <View key={index} className="w-[48%] bg-surface rounded-xl border border-outline-variant p-4 shadow-sm">
              <View className="flex-row items-center gap-1.5 mb-2">
                <item.icon size={14} color="#5f6368" />
                <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.label}</Text>
              </View>
              <Text className="font-mono text-[13px] font-bold text-primary">{item.value}</Text>
            </View>
          ))}
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
          <Text className="text-[16px] font-bold text-primary mb-3">Applicability</Text>
          <Text className="text-[14px] text-on-surface-variant leading-6">{qco.applicability}</Text>
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
          <Text className="text-[16px] font-bold text-primary mb-3">Exemptions</Text>
          {qco.exemptions.map((ex, idx) => (
            <View key={idx} className="flex-row items-start gap-2 mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mt-2" />
              <Text className="text-[14px] text-on-surface-variant flex-1 leading-6">{ex}</Text>
            </View>
          ))}
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-8">
          <Text className="text-[16px] font-bold text-primary mb-3">Penalty Provisions</Text>
          <View className="bg-[#ffedec] p-4 rounded-xl border border-[#ffc4c2] flex-row gap-3">
            <Scale size={20} color="#9e1c15" className="mt-0.5" />
            <Text className="text-[14px] text-on-surface flex-1 leading-6">{qco.penaltyProvisions}</Text>
          </View>
        </View>

        <Text className="text-[18px] font-bold text-on-surface mb-4">Related</Text>
        
        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
          <Text className="text-[14px] font-bold text-primary mb-3">Covered Standards</Text>
          {qco.coveredStandardCodes.map((code) => (
            <Pressable key={code} className="flex-row items-center justify-between p-3 bg-surface-container-low rounded-xl mb-2 border border-outline-variant">
              <Text className="font-mono text-[13px] font-bold text-primary">{code}</Text>
              <ArrowRight size={16} color="#5f6368" />
            </Pressable>
          ))}
        </View>

        <View className="bg-primary-container rounded-2xl p-5 mb-8">
          <Text className="text-[14px] font-bold text-on-primary-container mb-2">Testing Requirements</Text>
          <Text className="text-[13px] text-on-primary-container opacity-80 leading-5 mb-4">{qco.testingRequirements}</Text>
          <Pressable onPress={() => navigation.navigate('LabStack')} className="bg-primary px-4 py-3 rounded-xl flex-row items-center justify-center gap-2">
            <Text className="text-white font-bold text-[14px]">Find Testing Labs</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}
