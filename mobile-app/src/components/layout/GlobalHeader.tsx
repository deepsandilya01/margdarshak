import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Search, Bookmark, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function GlobalHeader() {
  const navigation = useNavigation<any>();
  const { savedItems } = useWorkspace();

  return (
    <View className="bg-surface border-b border-outline-variant/50 pt-2">
      <View className="flex-row items-center justify-between h-14 px-4 pb-1">
        {/* Logo */}
        <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} className="flex-row items-center">
          <Image 
            source={require('../../../assets/logo.png')} 
            style={{ width: 120, height: 36 }} 
            resizeMode="contain" 
          />
        </Pressable>

        {/* Right Actions */}
        <View className="flex-row items-center gap-5">
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoveryStack', params: { screen: 'ProductDiscovery' } })}>
            <Search size={22} color="#4a4643" />
          </Pressable>
          
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'SavedStack' })} className="relative">
            <Bookmark size={22} color="#4a4643" />
            {savedItems?.length > 0 && (
              <View className="absolute -top-1.5 -right-1.5 bg-[#e65c00] min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                <Text className="text-[9px] font-bold text-white">{savedItems.length}</Text>
              </View>
            )}
          </Pressable>
          
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}>
            <Menu size={24} color="#4a4643" />
          </Pressable>
        </View>
      </View>
      
      {/* Tricolor Bar */}
      <View className="flex-row h-1 w-full">
        <View className="flex-1 bg-[#FF9933]" />
        <View className="flex-1 bg-[#FFFFFF]" />
        <View className="flex-1 bg-[#138808]" />
      </View>
    </View>
  );
}
