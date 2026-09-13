import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, ChevronUp, FileText, Upload, FlaskConical, HelpCircle, CheckCircle2, CircleDashed, Circle, AlertCircle, PlusCircle } from 'lucide-react-native';
import { EvidenceBadge } from '../../features/evidence/components/EvidenceBadge';
import mockJourneys from '../../data/compliance/complianceJourneys.json';

export default function ComplianceJourneyDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {};

  const journey = (mockJourneys as any[]).find(j => j.id === id);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  if (!journey) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <AlertCircle size={48} color="#dc2626" className="mb-4" />
        <Text className="text-[20px] font-bold text-primary mb-2">Journey not found</Text>
        <Text className="text-center text-on-surface-variant mb-6">This compliance journey is unavailable or has been removed.</Text>
        <Pressable onPress={() => navigation.goBack()} className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Back to Workspace</Text>
        </Pressable>
      </View>
    );
  }

  const activeStepIndex = journey.steps.findIndex((s: any) => s.status === 'In Progress' || s.status === 'Needs Review');
  const displayIndex = activeStepIndex >= 0 ? activeStepIndex : journey.steps.length - 1;

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return { text: '#5f6368', bg: '#f8fafc', border: '#e2e8f0', icon: Circle };
      case 'In Progress': return { text: '#c4622d', bg: '#fef3eb', border: '#fcddc7', icon: CircleDashed }; // --accent-saffron
      case 'Verified': return { text: '#0b5204', bg: '#edf7ec', border: '#c8e8c5', icon: CheckCircle2 };
      case 'Needs Review': return { text: '#9e1c15', bg: '#ffedec', border: '#ffc4c2', icon: AlertCircle };
      case 'Completed': return { text: '#ffffff', bg: '#1a73e8', border: '#1a73e8', icon: CheckCircle2 };
      default: return { text: '#5f6368', bg: '#f8fafc', border: '#e2e8f0', icon: Circle };
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center justify-between shadow-sm z-10 sticky top-0">
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
                <Text className="font-mono text-[10px] font-bold text-[#64748b]">{journey.id}</Text>
              </View>
              <View className="bg-[#e8f0fe] px-2 py-0.5 rounded border border-[#d2e3fc]">
                <Text className="font-bold text-[9px] text-[#1a73e8] uppercase tracking-widest">{journey.currentStage}</Text>
              </View>
            </View>
            <Text className="text-[16px] font-bold text-on-surface" numberOfLines={1}>{journey.productName}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <Pressable className="flex-row items-center justify-center gap-2 bg-primary px-4 py-3 rounded-xl mb-6">
          <PlusCircle size={18} color="#ffffff" />
          <Text className="text-[14px] font-bold text-white">Add Step Note</Text>
        </Pressable>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-6">
          <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Journey Progress</Text>
          
          <View className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2 flex-row">
            <View className="h-full bg-[#c4622d]" style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 33}%` }} />
            <View className="h-full bg-outline-variant" style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 34}%` }} />
            <View className="h-full bg-[#1f6e43]" style={{ width: `${(displayIndex / (journey.steps.length - 1)) * 33}%` }} />
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-[11px] font-bold text-on-surface-variant">Start</Text>
            <Text className="text-[11px] font-bold text-on-surface-variant">{Math.round((displayIndex / (journey.steps.length - 1)) * 100)}%</Text>
            <Text className="text-[11px] font-bold text-on-surface-variant">Certification</Text>
          </View>
        </View>

        <View className="pl-4 pb-8 border-l-2 border-outline-variant ml-2 mb-4">
          {journey.steps.map((step: any, idx: number) => {
            const cfg = getStatusColor(step.status);
            const Icon = cfg.icon;
            const isActive = idx === displayIndex;
            const isExpanded = expandedSteps[idx] || isActive || step.status === 'Completed' || step.status === 'Verified';

            return (
              <View key={step.stage} className="relative pl-6 mb-6">
                <View className="absolute -left-[35px] top-2 w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}>
                  <Icon size={14} color={cfg.text} />
                </View>

                <View className={`bg-surface rounded-2xl border ${isActive ? 'border-primary' : 'border-outline-variant'}`}>
                  <Pressable 
                    onPress={() => toggleStep(idx)}
                    className="p-4 bg-surface-container-lowest rounded-t-2xl flex-row justify-between items-center"
                  >
                    <View>
                      <Text className="text-[16px] font-bold text-on-surface mb-0.5">{step.stage}</Text>
                      <Text className="text-[12px] font-bold text-on-surface-variant">{step.status}</Text>
                    </View>
                    {isExpanded ? <ChevronUp size={20} color="#5f6368" /> : <ChevronDown size={20} color="#5f6368" />}
                  </Pressable>

                  {isExpanded && (
                    <View className="p-4 border-t border-outline-variant pt-4">
                      <Text className="text-[14px] leading-5 text-on-surface mb-4">{step.description}</Text>

                      {step.evidence?.length > 0 && (
                        <View className="bg-surface-container-low p-3 rounded-xl border border-outline-variant mb-4">
                          <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Evidence</Text>
                          {step.evidence.map((ev: any) => (
                            <View key={ev.id} className="mb-2">
                              <View className="flex-row items-center justify-between mb-1">
                                <Text className="text-[12px] font-bold text-on-surface flex-1 pr-2" numberOfLines={1}>{ev.source}</Text>
                                <EvidenceBadge status={ev.status} compact />
                              </View>
                              <Text className="text-[11px] text-on-surface-variant">{ev.document}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {step.documents?.length > 0 && (
                        <View className="bg-surface-container-low p-3 rounded-xl border border-outline-variant mb-4">
                          <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Documents</Text>
                          {step.documents.map((doc: any, i: number) => (
                            <Pressable key={i} className="flex-row items-center gap-2 py-1.5">
                              <FileText size={14} color="#1a73e8" />
                              <Text className="text-[12px] font-bold text-primary flex-1" numberOfLines={1}>{doc.name}</Text>
                            </Pressable>
                          ))}
                        </View>
                      )}

                      {step.notes && (
                        <View className="p-3 bg-[#fff8e6] border-l-2 border-[#ffdb7a] rounded-r-lg mb-3">
                          <Text className="text-[10px] font-bold uppercase tracking-widest text-[#b37f00] mb-1">Notes</Text>
                          <Text className="text-[13px] text-on-surface leading-5">{step.notes}</Text>
                        </View>
                      )}

                      {step.nextAction && (
                        <View className="p-3 bg-[#e8f0fe] border-l-2 border-[#1a73e8] rounded-r-lg">
                          <Text className="text-[10px] font-bold uppercase tracking-widest text-[#1a73e8] mb-1">Next Action</Text>
                          <Text className="text-[13px] font-bold text-on-surface leading-5">{step.nextAction}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex-row items-center gap-2">Quick Actions</Text>
        <View className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-4 mb-8">
          <View className="gap-3">
            <Pressable className="flex-row items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl">
              <Upload size={18} color="#5f6368" />
              <Text className="text-[14px] font-bold text-on-surface">Upload Document</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('LabStack', { screen: 'LabFinder' })} className="flex-row items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl">
              <FlaskConical size={18} color="#5f6368" />
              <Text className="text-[14px] font-bold text-on-surface">Find Testing Lab</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'AISathi' })} className="flex-row items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl">
              <HelpCircle size={18} color="#5f6368" />
              <Text className="text-[14px] font-bold text-on-surface">Ask AI Sathi</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
