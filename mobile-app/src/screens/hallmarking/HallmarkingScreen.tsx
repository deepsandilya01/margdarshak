import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { Gem, ShieldCheck, QrCode } from 'lucide-react-native';

export default function HallmarkingScreen() {
  const [huid, setHuid] = useState('');

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6 bg-surface-container-low border-b border-outline-variant pb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Gem size={14} color="#d97706" />
            <Text className="text-[#d97706] text-[11px] font-bold uppercase tracking-widest">Precious Metals Integrity</Text>
          </View>
          <Text className="text-[28px] font-bold text-primary mb-2 leading-tight">Hallmarking & Gold Quality</Text>
          <Text className="text-[14px] text-on-surface-variant leading-6">
            Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles.
          </Text>
        </View>

        <View className="p-4 gap-6">
          <View className="bg-[#fef3c7] p-6 rounded-2xl border border-[#fde68a] items-center text-center">
            <ShieldCheck size={48} color="#d97706" className="mb-3" />
            <Text className="text-[18px] font-bold text-[#b45309] mb-2 text-center">HUID (Hallmark Unique Identification)</Text>
            <Text className="text-[14px] text-[#92400e] text-center leading-5">
              A six-digit alphanumeric code engraved on every piece of jewelry to ensure traceability and authenticity.
            </Text>
          </View>

          <View className="bg-surface rounded-2xl border border-outline-variant/50 p-5 shadow-sm">
            <Text className="text-[16px] font-bold text-primary mb-3">Mandatory Hallmarking</Text>
            <Text className="text-[14px] text-on-surface-variant leading-6 mb-4">
              Gold hallmarking is now mandatory for jewellers in specified districts across India. The government has phased out older hallmarking standards to ensure consumers receive pure gold.
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <Text className="font-mono text-[13px] font-bold text-secondary mb-1">14K, 18K, 20K, 22K, 23K, 24K</Text>
                <Text className="text-[11px] text-on-surface-variant">Permitted Gold Grades</Text>
              </View>
              <View className="flex-1 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <Text className="font-mono text-[13px] font-bold text-secondary mb-1">AHC Registration</Text>
                <Text className="text-[11px] text-on-surface-variant">Assaying Centers</Text>
              </View>
            </View>
          </View>

          {/* Verify HUID Tool */}
          <View className="bg-[#0b162c] rounded-2xl p-6 text-center shadow-md items-center mb-6">
            <QrCode size={32} color="#afc8ed" className="mb-3" />
            <Text className="text-[20px] font-bold text-white mb-2 text-center">Verify HUID Number</Text>
            <Text className="text-[14px] text-[#7a93b5] mb-6 text-center">
              Enter the 6-digit HUID code from your jewelry to verify its purity and the AHC details.
            </Text>
            <View className="w-full gap-3">
              <TextInput
                value={huid}
                onChangeText={setHuid}
                placeholder="e.g. A1B2C3"
                placeholderTextColor="#4a5568"
                maxLength={6}
                autoCapitalize="characters"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center font-mono text-[18px] tracking-widest text-white uppercase"
              />
              <Pressable className="w-full py-4 bg-secondary rounded-xl items-center justify-center">
                <Text className="text-white font-bold text-[15px]">Verify HUID</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
