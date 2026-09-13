import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Compass, ScanSearch, ShieldCheck, Microscope, ChevronRight, BookOpen } from 'lucide-react-native';

export default function ExploreScreen() {
  const navigation = useNavigation<any>();

  const sections = [
    {
      id: 'discovery',
      title: 'Product Discovery',
      description: 'Intelligent decision-tree to determine exact testing requirements based on product attributes.',
      icon: ScanSearch,
      route: 'DiscoveryStack',
      params: { screen: 'ProductDiscovery' },
      color: 'bg-[#e8f0fe]',
      iconColor: '#1a73e8'
    },
    {
      id: 'qco',
      title: 'QCO Explorer',
      description: 'Browse active and upcoming Quality Control Orders mandated by ministries.',
      icon: ShieldCheck,
      route: 'QCOStack',
      params: { screen: 'QCOExplorer' },
      color: 'bg-[#ffedec]',
      iconColor: '#9e1c15'
    },
    {
      id: 'labs',
      title: 'Laboratories Finder',
      description: 'Locate BIS-accredited testing facilities and their approved scopes.',
      icon: Microscope,
      route: 'LabStack',
      params: { screen: 'LabFinder' },
      color: 'bg-[#edf7ec]',
      iconColor: '#0b5204'
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'Knowledge base, guidelines, and compliance documentation.',
      icon: BookOpen,
      route: 'SupportStack',
      params: { screen: 'Resources' },
      color: 'bg-surface-container',
      iconColor: 'var(--primary)'
    }
  ];

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="mb-6 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
          <Compass size={22} color="#1a73e8" />
        </View>
        <View>
          <Text className="text-[28px] font-bold text-primary">Explore</Text>
          <Text className="text-[14px] text-on-surface-variant">Navigate compliance hubs</Text>
        </View>
      </View>

      <View className="gap-4">
        {sections.map(s => (
          <Pressable 
            key={s.id}
            onPress={() => navigation.navigate(s.route, s.params)}
            className="bg-surface p-5 rounded-2xl border border-outline-variant flex-row items-center gap-4"
          >
            <View className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center`}>
              <s.icon size={24} color={s.iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-on-surface mb-1">{s.title}</Text>
              <Text className="text-[13px] text-on-surface-variant leading-4">{s.description}</Text>
            </View>
            <ChevronRight size={20} color="#5f6368" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
