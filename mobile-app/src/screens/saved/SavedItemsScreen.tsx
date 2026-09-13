import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bookmark } from 'lucide-react-native';

export default function SavedItemsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center gap-3">
        <Pressable onPress={() => navigation.goBack()} className="p-2 rounded-full hover:bg-surface-container">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <Text className="text-[20px] font-bold text-primary flex-1">Saved Items</Text>
      </View>

      <View className="p-5 flex-1 items-center justify-center py-20">
        <View className="w-16 h-16 rounded-full bg-primary-container border border-outline-variant items-center justify-center mb-4">
          <Bookmark size={32} color="#0b5204" />
        </View>
        <Text className="text-[16px] font-bold text-primary mb-2">No Saved Items</Text>
        <Text className="text-[14px] text-on-surface-variant text-center">
          You haven't bookmarked any standards or resources yet.
        </Text>
      </View>
    </ScrollView>
  );
}
