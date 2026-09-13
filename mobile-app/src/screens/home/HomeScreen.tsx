import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { useStandards } from '@/features/standards/hooks/useStandards';
import { StatusPill, TechIdentifier } from '../../components/feedback/StatusPill';
import { Package, BookOpen, Scale, FileCheck, FlaskConical, Building2, Award, ShieldCheck, ChevronRight, Search } from 'lucide-react-native';

const PIPELINE_NODES = [
  { icon: Package, label: 'Input Product', value: 'Li-Ion Pack', sub: 'Class M1/N1', color: '#0047e1' },
  { icon: BookOpen, label: 'Standard Ref', value: 'IS 16046-2', sub: 'Edition 2018', color: '#b89752' },
  { icon: Scale, label: 'Applicability', value: 'Mandatory', sub: '100% Commercial', color: '#0047e1' },
  { icon: FileCheck, label: 'QCO Order', value: 'MeitY CRO', sub: 'Phase V', color: '#b89752' },
  { icon: FlaskConical, label: 'Testing Scope', value: '12 Protocols', sub: 'Thermal', color: '#0047e1' },
  { icon: Building2, label: 'NABL Labs', value: '14 Centers', sub: 'Queue < 21d', color: '#b89752' },
  { icon: Award, label: 'Certification', value: 'CRS Reg.', sub: 'Scheme II', color: '#0047e1' },
];

const OUTPUT_NODE = {
  icon: ShieldCheck,
  label: 'Output',
  value: 'Conforming',
  sub: 'Gazette Valid',
  color: '#0b5204',
  bgColor: '#0b5204',
};

const CATEGORIES = [
  { icon: 'devices', label: 'Consumer Electronics', key: 'Electronics & IT' },
  { icon: 'electric_car', label: 'Automotive & EV', key: 'Automotive & EV' },
  { icon: 'local_florist', label: 'Food & Agro', key: 'Agro & Food' },
  { icon: 'foundation', label: 'Building Materials', key: 'Structural Materials' },
  { icon: 'science', label: 'Chemicals', key: 'Chemicals & Polymers' },
  { icon: 'smart_toy', label: 'Toys & Juveniles', key: 'Consumer Toys' },
];

export default function HomeScreen() {
  const { t } = useTranslation(['home', 'common']);
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Electronics & IT');
  const { standards } = useStandards();

  const handleSearch = (queryOverride?: string) => {
    const q = typeof queryOverride === 'string' ? queryOverride : searchQuery;
    if (q.trim()) {
      navigation.navigate('Standards', { search: q });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* HERO SECTION */}
      <View className="px-4 py-8 flex-col gap-6">
        <View className="flex-col gap-4">
          <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant w-auto self-start">
            <View className="w-2 h-2 rounded-full bg-secondary" />
            <Text className="text-secondary text-[11px] font-semibold uppercase">{t('hero.overline')}</Text>
          </View>
          
          <Text className="text-[32px] font-bold text-on-surface leading-10">
            {t('hero.headline')}
          </Text>
          
          <View className="h-1.5 w-16 bg-primary rounded-full mb-2" />
          
          <Text className="text-[16px] text-on-surface-variant">
            {t('hero.subheading')}
          </Text>
          
          <View className="flex-row flex-wrap gap-4 pt-4">
            <Pressable 
              onPress={() => navigation.navigate('Standards')}
              className="flex-row items-center gap-2 px-6 py-3.5 rounded-xl bg-primary"
            >
              <Text className="text-on-primary font-semibold text-[16px]">{t('hero.cta_standards')}</Text>
            </Pressable>
            <Pressable 
              onPress={() => navigation.navigate('AISathi')}
              className="flex-row items-center gap-2 px-6 py-3.5 rounded-xl border border-outline-variant bg-surface"
            >
              <Text className="text-primary font-semibold text-[16px]">{t('hero.cta_ai')}</Text>
            </Pressable>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View className="bg-surface-container-low rounded-2xl p-5 mt-4 border border-outline-variant">
          <View className="flex-row items-center bg-surface px-4 py-3 rounded-xl border border-outline-variant mb-4">
            <Pressable onPress={() => handleSearch()}>
              <Search size={18} color="#5f6368" />
            </Pressable>
            <TextInput
              className="flex-1 text-[15px] font-medium text-on-surface ml-2"
              placeholder={t('search.placeholder')}
              placeholderTextColor="#7d7672"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
          </View>
          <Text className="text-[11px] font-semibold uppercase text-on-surface-variant mb-2">{t('search.popular')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: 'Electric Vehicles', q: 'IS 17017' },
              { label: 'Packaged Water', q: 'IS 14543' },
              { label: 'Toys QCO', q: 'IS 9873' },
            ].map(chip => (
              <Pressable 
                key={chip.q} 
                onPress={() => {
                  setSearchQuery(chip.q);
                  handleSearch(chip.q);
                }} 
                className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant"
              >
                <Text className="font-mono text-[12px] text-primary">{chip.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* PIPELINE SECTION */}
      <View className="bg-surface-container-low px-4 py-8">
        <Text className="text-secondary text-[11px] font-semibold uppercase mb-2">Statutory Lineage Architecture</Text>
        <Text className="text-[24px] font-bold text-on-surface mb-2">Product-to-Audit Statutory Pipeline</Text>
        <Text className="text-[14px] text-on-surface-variant mb-6">Every manufacturing input resolves systematically into gazetted testing mandates, lab execution scopes, and certification licensing.</Text>
        
        {/* Archetype badge */}
        <View className="flex-row items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-surface border border-outline-variant self-start">
          <View className="w-2 h-2 rounded-full bg-secondary" />
          <Text className="font-mono text-[12px] text-on-surface">Archetype: EV Battery Energy Storage Pack</Text>
        </View>

        {/* Pipeline — scrollable horizontal stepper */}
        <View className="bg-surface rounded-2xl border border-outline-variant p-4 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            <View className="flex-row items-start">
              {PIPELINE_NODES.map((node, index) => {
                const IconComponent = node.icon;
                return (
                  <React.Fragment key={index}>
                    {/* Node */}
                    <View className="items-center" style={{ width: 72 }}>
                      <View 
                        className="w-11 h-11 rounded-full border-2 items-center justify-center bg-surface mb-2"
                        style={{ borderColor: node.color }}
                      >
                        <IconComponent size={18} color={node.color} />
                      </View>
                      <Text className="font-mono text-[8px] text-on-surface-variant uppercase text-center leading-3">{node.label}</Text>
                      <Text className="text-[11px] font-bold text-on-surface text-center leading-4 mt-0.5">{node.value}</Text>
                      <Text className="font-mono text-[8px] text-center leading-3 mt-0.5" style={{ color: node.color }}>{node.sub}</Text>
                    </View>

                    {/* Connector */}
                    <View className="items-center justify-start mt-5" style={{ width: 20 }}>
                      <View className="h-[2px] w-full" style={{ backgroundColor: node.color }} />
                    </View>
                  </React.Fragment>
                );
              })}

              {/* Output terminal node (green) */}
              <View className="items-center" style={{ width: 72 }}>
                <View 
                  className="w-11 h-11 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: OUTPUT_NODE.bgColor }}
                >
                  <ShieldCheck size={18} color="#ffffff" />
                </View>
                <Text className="font-mono text-[8px] uppercase text-center leading-3 font-bold" style={{ color: OUTPUT_NODE.color }}>{OUTPUT_NODE.label}</Text>
                <Text className="text-[11px] font-bold text-on-surface text-center leading-4 mt-0.5">{OUTPUT_NODE.value}</Text>
                <Text className="font-mono text-[8px] text-on-surface-variant text-center leading-3 mt-0.5">{OUTPUT_NODE.sub}</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Context card */}
        <View className="bg-surface rounded-2xl border border-outline-variant p-5">
          <View className="flex-row items-start gap-4 mb-4">
            <View className="w-14 h-14 rounded-xl bg-surface-container items-center justify-center">
              <Package size={28} color="#0047e1" />
            </View>
            <View className="flex-1">
              <Text className="font-mono text-[14px] font-medium text-primary mb-1">Industrial Lithium Secondary Cells and Batteries</Text>
              <View className="self-start px-2 py-0.5 rounded bg-surface-container mb-2">
                <Text className="font-mono text-[11px] text-primary">HS Code 8507.60</Text>
              </View>
              <Text className="text-[13px] text-on-surface-variant leading-5">Applicable under Section 16 of the Bureau of Indian Standards Act 2016 for secondary cells and batteries containing alkaline or other non-acid electrolytes.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* STANDARDS REGISTRY PREVIEW */}
      <View className="bg-surface-container px-4 py-8">
        <Text className="text-[24px] font-bold text-on-surface mb-4">Curated Technical Standards Registry</Text>
        
        {standards.slice(0, 3).map(s => (
          <Pressable 
            key={s.id} 
            onPress={() => navigation.navigate('StandardDetail', { id: s.id })}
            className="bg-surface rounded-xl p-4 mb-3 border border-outline-variant"
          >
            <View className="flex-row items-center justify-between mb-2">
              <TechIdentifier code={s.code} />
              <StatusPill status={s.status} size="sm" />
            </View>
            <Text className="text-[15px] font-semibold text-primary mb-1">{s.shortTitle}</Text>
            <Text className="text-[12px] text-on-surface-variant mb-3" numberOfLines={2}>{s.description}</Text>
            <View className="flex-row items-center gap-1 self-end px-3 py-1.5 bg-surface-container-low rounded-lg">
              <Text className="text-primary font-mono text-[12px]">View Scope</Text>
              <ChevronRight size={14} color="#0047e1" />
            </View>
          </Pressable>
        ))}
        
        <Pressable 
          onPress={() => navigation.navigate('Standards')}
          className="mt-4 py-3 bg-primary rounded-xl items-center"
        >
          <Text className="text-on-primary font-semibold">View All Standards</Text>
        </Pressable>
      </View>
      
    </ScrollView>
  );
}
