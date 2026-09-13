import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MapPin, Map, Clock, Calendar, CheckCircle2, Mail, Phone, ExternalLink, AlertTriangle } from 'lucide-react-native';
import { useLabs } from '../../features/laboratories/hooks/useLabs';

export default function LabDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {};
  
  const { getById } = useLabs();
  const lab = id ? getById(id) : null;

  if (!lab) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <AlertTriangle size={48} color="#dc2626" className="mb-4" />
        <Text className="text-[20px] font-bold text-primary mb-2">Laboratory Not Found</Text>
        <Pressable 
          onPress={() => navigation.goBack()}
          className="bg-primary px-6 py-3 rounded-xl mt-6"
        >
          <Text className="text-white font-bold">Back to Labs</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'Accredited') {
      return { bg: '#edf7ec', text: '#0b5204' }; // --status-compliant
    }
    return { bg: '#ffedec', text: '#9e1c15' }; // --status-verify for expired/suspended
  };

  const statusStyle = getStatusColor(lab.nablStatus);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center gap-3 sticky top-0 z-10">
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[14px] font-mono text-on-surface-variant uppercase tracking-widest">{lab.accreditationNumber}</Text>
        </View>
      </View>

      <View className="p-5">
        <View className="flex-row items-center gap-2 mb-4 flex-wrap">
          <View className="bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-lg">
            <Text className="font-mono text-[12px] font-bold text-[#64748b]">{lab.accreditationNumber}</Text>
          </View>
          <View className="px-3 py-1.5 rounded-full border" style={[{ backgroundColor: statusStyle.bg, borderColor: `${statusStyle.text}20` }]}>
            <Text style={{ color: statusStyle.text }} className="text-[12px] font-bold tracking-wide">{lab.nablStatus === 'Accredited' ? 'Accredited' : 'Expired'}</Text>
          </View>
          <View className="bg-surface-container px-3 py-1.5 rounded-lg">
            <Text className="text-[12px] font-medium text-primary">{lab.type}</Text>
          </View>
        </View>

        <Text className="text-[24px] font-bold text-primary mb-3 leading-8">{lab.name}</Text>
        <Text className="text-[14px] text-on-surface-variant leading-6 mb-6">{lab.description}</Text>

        <View className="flex-row gap-3 mb-8">
          {lab.onlineBooking && (
            <Pressable onPress={() => Linking.openURL(`mailto:${lab.email}?subject=Test%20Booking%20Request`)} className="flex-1 flex-row items-center justify-center gap-2 bg-primary px-4 py-3 rounded-xl">
              <Calendar size={18} color="#ffffff" />
              <Text className="text-white font-bold text-[14px]">Book Test</Text>
            </Pressable>
          )}
          <Pressable onPress={() => Linking.openURL(`mailto:${lab.email}`)} className="flex-1 flex-row items-center justify-center gap-2 bg-surface px-4 py-3 rounded-xl border border-outline-variant">
            <Mail size={18} color="#1a73e8" />
            <Text className="text-primary font-bold text-[14px]">Contact</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-3 mb-8">
          {[
            { label: 'City', value: lab.city, icon: MapPin },
            { label: 'State', value: lab.state, icon: Map },
            { label: 'Turnaround', value: `${lab.turnaroundDays} days`, icon: Clock },
            { label: 'Valid Until', value: lab.validUntil, icon: Calendar },
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
          <Text className="text-[16px] font-bold text-primary mb-3">Testing Disciplines</Text>
          <View className="flex-row flex-wrap gap-2">
            {lab.disciplines.map(d => (
              <View key={d} className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant">
                <Text className="font-mono text-[13px] text-on-surface-variant">{d}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
          <Text className="text-[16px] font-bold text-primary mb-3">Accredited For</Text>
          <View className="flex-row flex-wrap gap-2">
            {lab.accreditedFor.map((item, idx) => (
              <View key={idx} className="flex-row items-center gap-2 p-3 bg-surface-container-low rounded-xl w-full">
                <CheckCircle2 size={16} color="#b89752" />
                <Text className="text-[13px] text-on-surface flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-8">
          <Text className="text-[16px] font-bold text-primary mb-3">Standards Scope</Text>
          <View className="flex-row flex-wrap gap-2">
            {lab.testingScopes.map(scope => (
              <View key={scope} className="bg-[#f8fafc] border border-[#e2e8f0] px-2 py-1 rounded-md">
                <Text className="font-mono text-[12px] font-bold text-[#64748b]">{scope}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-[18px] font-bold text-on-surface mb-4">Contact Information</Text>

        <View className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
          <View className="flex-row items-start gap-3 mb-4">
            <MapPin size={16} color="#5f6368" className="mt-0.5" />
            <Text className="text-[13px] text-on-surface-variant flex-1 leading-5">{lab.address}</Text>
          </View>
          <View className="flex-row items-center gap-3 mb-4">
            <Phone size={16} color="#5f6368" />
            <Text className="text-[13px] text-on-surface-variant">{lab.phone}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Mail size={16} color="#5f6368" />
            <Text className="text-[13px] text-on-surface-variant">{lab.email}</Text>
          </View>
        </View>

        <View className="bg-surface-container-low rounded-2xl border border-outline-variant p-5 mb-8">
          <Text className="text-[12px] font-mono text-on-surface-variant mb-4">Accreditation valid: {lab.lastRenewal} → {lab.validUntil}</Text>
          <Pressable onPress={() => Linking.openURL('https://nabl-india.org')} className="flex-row items-center gap-2">
            <ExternalLink size={16} color="#b89752" />
            <Text className="text-[13px] text-[#b89752] font-bold">View full NABL scope</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}
