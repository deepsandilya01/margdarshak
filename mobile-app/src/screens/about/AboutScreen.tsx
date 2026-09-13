import React from 'react';
import { View, Text, ScrollView, Image, Linking } from 'react-native';
import { Info, ShieldCheck, Mail } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <View className="items-center mb-8 mt-4">
        <View className="w-20 h-20 bg-surface rounded-2xl border border-outline-variant items-center justify-center mb-4">
          <ShieldCheck size={40} color="#1a73e8" />
        </View>
        <Text className="text-[24px] font-bold text-primary mb-1">BIS-SATHI Mobile</Text>
        <Text className="text-[14px] font-mono text-on-surface-variant">Version 1.0.0 (Build 42)</Text>
      </View>

      <Card className="mb-4">
        <View className="flex-row items-center gap-3 mb-3">
          <Info size={20} color="#1a73e8" />
          <Text className="text-[16px] font-bold text-primary">About the App</Text>
        </View>
        <Text className="text-[14px] text-on-surface-variant leading-5 mb-4">
          BIS-SATHI (Smart Assistant for Testing and Harmonized Implementation) is a comprehensive platform designed to streamline compliance, standard discovery, and testing requirements for manufacturers across India.
        </Text>
        <Text className="text-[14px] text-on-surface-variant leading-5">
          This mobile application brings the full power of the web portal to your pocket, complete with our advanced AI Sathi assistant.
        </Text>
      </Card>

      <Card className="mb-4">
        <View className="flex-row items-center gap-3 mb-4">
          <Mail size={20} color="#1a73e8" />
          <Text className="text-[16px] font-bold text-primary">Support & Contact</Text>
        </View>
        <Button 
          title="Contact Support Team" 
          variant="outline" 
          onPress={() => Linking.openURL('mailto:support@bis.gov.in')} 
          className="mb-3"
        />
        <Button 
          title="View Privacy Policy" 
          variant="ghost" 
          onPress={() => Linking.openURL('https://bis.gov.in')} 
        />
      </Card>

      <View className="items-center mt-4 pb-8">
        <Text className="text-[12px] text-on-surface-variant mb-1">© 2026 Bureau of Indian Standards</Text>
        <Text className="text-[12px] text-on-surface-variant">All Rights Reserved</Text>
      </View>
    </ScrollView>
  );
}
