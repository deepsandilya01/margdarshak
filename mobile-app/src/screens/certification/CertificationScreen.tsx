import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Award, Smartphone, FileCheck2, ClipboardCheck } from 'lucide-react-native';

const schemes = [
  {
    id: 'scheme-I',
    name: 'Scheme-I (ISI Mark)',
    desc: 'Mandatory certification scheme for products affecting health, safety, and mass consumption (e.g., Cement, Steel, Electrical appliances).',
    badge: 'ISI Mark',
    icon: <Award size={24} color="#e65c00" />,
  },
  {
    id: 'scheme-II',
    name: 'Scheme-II (CRS)',
    desc: 'Compulsory Registration Scheme typically for Electronics & IT goods under MeitY orders.',
    badge: 'CRS Registration',
    icon: <Smartphone size={24} color="#e65c00" />,
  },
  {
    id: 'scheme-IV',
    name: 'Scheme-IV (CoC)',
    desc: 'For specific products requiring certification without the standard mark usage.',
    badge: 'CoC',
    icon: <FileCheck2 size={24} color="#e65c00" />,
  },
  {
    id: 'scheme-X',
    name: 'Scheme-X (SDOC)',
    desc: 'Self-declaration of conformity for lower-risk products where manufacturer claims compliance.',
    badge: 'SDOC',
    icon: <ClipboardCheck size={24} color="#e65c00" />,
  }
];

export default function CertificationScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6 bg-surface-container-low border-b border-outline-variant pb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-secondary text-[11px] font-bold uppercase tracking-widest">Compliance Frameworks</Text>
          </View>
          <Text className="text-[28px] font-bold text-primary mb-2">Certification Schemes</Text>
          <Text className="text-[14px] text-on-surface-variant leading-6">
            Explore the active certification schemes under the Bureau of Indian Standards (Conformity Assessment) Regulations, 2018.
          </Text>
        </View>

        <View className="px-4 py-6 gap-4">
          {schemes.map(s => (
            <View key={s.id} className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm">
              <View className="flex-row gap-4">
                <View className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  {s.icon}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center flex-wrap gap-2 mb-2">
                    <Text className="text-[18px] font-bold text-primary">{s.name}</Text>
                    <View className="px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant">
                      <Text className="text-on-surface-variant text-[11px] font-mono tracking-wide">{s.badge}</Text>
                    </View>
                  </View>
                  <Text className="text-[14px] text-on-surface-variant leading-5 mb-4">{s.desc}</Text>
                  
                  <Pressable 
                    onPress={() => navigation.navigate('ComplianceStack', { screen: 'ComplianceWorkspace' })}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="text-[14px] font-bold text-secondary">Start Application</Text>
                    <ChevronRight size={16} color="#0047e1" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
