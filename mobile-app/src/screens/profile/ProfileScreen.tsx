import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Settings, Bookmark, FileText, CheckCircle, ChevronRight, User, LogOut, LogIn, Edit2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { savedItems } = useWorkspace();
  const navigation = useNavigation<any>();

  const handleSignOut = () => {
    // In a real app, clear tokens here
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6" contentContainerStyle={{ paddingBottom: 60 }}>
      <View className="mb-6 flex-row items-center gap-3">
        <View className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
          <User size={32} color="#1a73e8" />
        </View>
        <View className="flex-1">
          <Text className="text-[24px] font-bold text-on-surface">Manufacturer Profile</Text>
          <Text className="text-[14px] text-on-surface-variant">Acme Electronics Ltd.</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => navigation.navigate('EditProfile')} className="p-2 rounded-full bg-surface-container-low border border-outline-variant">
            <Edit2 size={20} color="#5f6368" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Menu')} className="p-2 rounded-full bg-surface-container-low border border-outline-variant">
            <Settings size={20} color="#5f6368" />
          </Pressable>
        </View>
      </View>

      <View className="bg-surface rounded-2xl p-5 border border-outline-variant mb-6 shadow-sm">
        <Text className="text-[16px] font-bold text-primary mb-4">Compliance Dossier</Text>
        
        <Pressable onPress={() => navigation.navigate('ComplianceStack')} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-xl mb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-[#edf7ec] items-center justify-center">
              <CheckCircle size={20} color="#0b5204" />
            </View>
            <View>
              <Text className="font-bold text-on-surface">Active Certifications</Text>
              <Text className="text-[12px] text-on-surface-variant">3 products compliant</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#5f6368" />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ComplianceStack')} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-xl mb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-[#ffedec] items-center justify-center">
              <FileText size={20} color="#9e1c15" />
            </View>
            <View>
              <Text className="font-bold text-on-surface">Pending Applications</Text>
              <Text className="text-[12px] text-on-surface-variant">Action required on 1 item</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#5f6368" />
        </Pressable>
      </View>

      <View className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm mb-6">
        <Text className="text-[16px] font-bold text-primary mb-4">Saved Resources</Text>
        
        <Pressable onPress={() => navigation.navigate('SavedStack')} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-xl">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center">
              <Bookmark size={20} color="#0b5204" />
            </View>
            <View>
              <Text className="font-bold text-on-surface">Bookmarked Standards</Text>
              <Text className="text-[12px] text-on-surface-variant">{savedItems.length} items saved</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#5f6368" />
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('SupportStack', { screen: 'About' })} className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm flex-row items-center justify-between mb-8">
        <Text className="text-[16px] font-bold text-primary">About BIS-SATHI Mobile</Text>
        <ChevronRight size={20} color="#5f6368" />
      </Pressable>

      <Pressable onPress={handleSignOut} className="flex-row items-center justify-center gap-2 p-4 bg-[#ffedec] rounded-xl border border-[#9e1c15]/30">
        <LogOut size={20} color="#9e1c15" />
        <Text className="text-[#9e1c15] font-bold text-[16px]">Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}
