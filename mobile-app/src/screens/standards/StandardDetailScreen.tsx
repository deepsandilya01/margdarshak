import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, BookmarkPlus, Share2, AlertCircle, FileText, CheckCircle2, ChevronRight, Beaker, MapPin } from 'lucide-react-native';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { useLabs } from '@/features/laboratories/hooks/useLabs';
import { useWorkspace } from '@/context/WorkspaceContext';
import { StatusPill, TechIdentifier } from '../../components/feedback/StatusPill';
import { EvidenceBadge } from '@/features/evidence/components/EvidenceBadge';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'scope', label: 'Scope' },
  { id: 'clauses', label: 'Clauses' },
  { id: 'testing', label: 'Testing' },
  { id: 'labs', label: 'Labs' },
  { id: 'related', label: 'Related' },
];

export default function StandardDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};
  
  const { getById } = useStandards();
  const { labs } = useLabs({ standardId: id });
  const { addToComparison, saveItem, isSaved } = useWorkspace();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const standard = id ? getById(id) : null;
  
  if (!standard) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <AlertCircle size={48} color="#e65c00" className="mb-4" />
        <Text className="text-primary font-bold text-[20px]">Standard Not Found</Text>
        <Pressable onPress={() => navigation.goBack()} className="mt-4 px-6 py-3 bg-primary rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isSaved(standard.id);

  const handleSave = () => {
    if (!saved) {
      saveItem({ id: standard.id, type: 'standard', label: standard.code, title: standard.title });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View className="space-y-5">
            <View>
              <Text className="text-[16px] font-bold text-primary mb-2">About This Standard</Text>
              <Text className="text-[14px] text-on-surface-variant leading-6">{standard.description}</Text>
            </View>
            {standard.mandatoryUnder && (
              <View className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
                <Text className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Mandatory Under</Text>
                <Text className="font-mono text-[14px] font-bold text-on-surface">{standard.mandatoryUnder}</Text>
              </View>
            )}
            <View>
              <Text className="text-[15px] font-bold text-primary mb-2">Tags</Text>
              <View className="flex-row flex-wrap gap-2">
                {standard.tags.map(tag => (
                  <View key={tag} className="px-3 py-1.5 rounded-lg bg-surface-container-low">
                    <Text className="font-mono text-[12px] text-on-surface-variant">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      case 'scope':
        return (
          <View>
            <Text className="text-[16px] font-bold text-primary mb-2">Scope of Application</Text>
            <Text className="text-[14px] text-on-surface-variant leading-6">{standard.scope}</Text>
          </View>
        );
      case 'clauses':
        return (
          <View className="gap-3">
            <Text className="text-[16px] font-bold text-primary mb-1">Key Clauses</Text>
            {standard.clauses.map(clause => (
              <View key={clause.number} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex-row gap-3">
                <TechIdentifier code={`§ ${clause.number}`} size="md" />
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-on-surface mb-1">{clause.title}</Text>
                  {clause.mandatory && (
                    <Text className="text-[11px] font-bold text-[#e65c00] uppercase">Required</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        );
      case 'testing':
        return (
          <View className="gap-3">
            <Text className="text-[16px] font-bold text-primary mb-1">Testing Protocols</Text>
            {standard.testingProtocols.map(protocol => (
              <View key={protocol} className="flex-row items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/50">
                <CheckCircle2 size={18} color="#138808" />
                <Text className="text-[14px] text-on-surface flex-1 leading-5">{protocol}</Text>
              </View>
            ))}
          </View>
        );
      case 'labs':
        return (
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-[16px] font-bold text-primary">Accredited Labs ({labs.length})</Text>
              <Pressable onPress={() => navigation.navigate('LabStack', { screen: 'LabFinder', params: { standardId: standard.id }})}>
                <Text className="text-[13px] text-secondary font-bold">View All</Text>
              </Pressable>
            </View>
            {labs.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-[14px] text-on-surface-variant">No labs found.</Text>
              </View>
            ) : (
              labs.map((lab: any) => (
                <Pressable key={lab.id} onPress={() => navigation.navigate('LabStack', { screen: 'LabDetail', params: { id: lab.id }})} className="p-4 rounded-xl border border-outline-variant/50 bg-surface">
                  <TechIdentifier code={lab.accreditationNumber} size="md" />
                  <Text className="text-[15px] font-bold text-on-surface mt-2">{lab.name}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MapPin size={12} color="#5f6368" />
                    <Text className="text-[12px] text-on-surface-variant">{lab.city}, {lab.state}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        );
      case 'related':
        return (
          <View className="gap-3">
            <Text className="text-[16px] font-bold text-primary mb-1">Related QCOs</Text>
            {standard.relatedQCOs.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-[14px] text-on-surface-variant">No related QCOs.</Text>
              </View>
            ) : (
              standard.relatedQCOs.map(qcoId => (
                <Pressable key={qcoId} onPress={() => navigation.navigate('QCOStack', { screen: 'QCODetail', params: { id: qcoId }})} className="flex-row items-center justify-between p-4 rounded-xl border border-outline-variant/50 bg-surface">
                  <View className="flex-row items-center gap-3">
                    <FileText size={18} color="#5f6368" />
                    <TechIdentifier code={qcoId} size="md" />
                  </View>
                  <ChevronRight size={18} color="#5f6368" />
                </Pressable>
              ))
            )}
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 bg-surface border-b border-outline-variant flex-row items-center justify-between shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full flex-row items-center">
          <ChevronLeft size={24} color="#5f6368" />
          <Text className="text-[16px] font-bold text-primary ml-1">Standards</Text>
        </Pressable>
        <View className="flex-row gap-3">
          <Pressable onPress={handleSave}>
            <BookmarkPlus size={22} color={saved ? '#e65c00' : '#5f6368'} />
          </Pressable>
          <Pressable>
            <Share2 size={22} color="#5f6368" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6 bg-surface border-b border-outline-variant/50">
          <View className="flex-row flex-wrap gap-2 mb-4">
            <TechIdentifier code={standard.code} size="lg" />
            <StatusPill status={standard.status} />
            {standard.evidence && <EvidenceBadge status={standard.evidence.status} />}
          </View>
          <Text className="text-[24px] font-bold text-primary mb-3 leading-tight">{standard.title}</Text>
          
          <View className="flex-row flex-wrap items-center gap-3 text-[13px] mb-6">
            <View className="px-2 py-1 rounded bg-surface-container-low">
              <Text className="font-mono text-[11px] text-on-surface-variant">{standard.divisionName}</Text>
            </View>
            <Text className="font-mono text-[12px] text-on-surface-variant font-bold">{standard.accreditedLabs} Labs</Text>
          </View>
          
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
              <Text className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">Year</Text>
              <Text className="font-mono text-[14px] font-bold text-primary">{standard.year}</Text>
            </View>
            <View className="flex-1 bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
              <Text className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">HS Code</Text>
              <Text className="font-mono text-[14px] font-bold text-primary">{standard.hsCode}</Text>
            </View>
            <View className="flex-1 bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
              <Text className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">Scheme</Text>
              <Text className="font-mono text-[14px] font-bold text-primary">{standard.certificationScheme ?? 'N/A'}</Text>
            </View>
          </View>

          <Pressable onPress={() => navigation.navigate('ComplianceStack', { screen: 'ComplianceWorkspace' })} className="w-full py-3 bg-primary rounded-xl items-center flex-row justify-center gap-2">
            <CheckCircle2 size={18} color="#ffffff" />
            <Text className="text-white font-bold text-[14px]">Start Compliance Journey</Text>
          </Pressable>
        </View>

        {/* Custom Tabs */}
        <View className="bg-surface">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-outline-variant/50">
            <View className="flex-row px-2">
              {DETAIL_TABS.map(tab => (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 border-b-2 ${activeTab === tab.id ? 'border-primary' : 'border-transparent'}`}
                >
                  <Text className={`text-[14px] font-bold ${activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant'}`}>{tab.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <View className="p-4 bg-surface min-h-[300px]">
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
