import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, BellOff } from 'lucide-react-native';

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full mr-2 flex-row items-center">
          <ChevronLeft size={24} color="#5f6368" />
          <Text className="text-[16px] font-bold text-primary ml-1">Menu</Text>
        </Pressable>
      </View>

      <View className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-[28px] font-bold text-primary mb-2">Notifications</Text>
          <Text className="text-[14px] text-on-surface-variant">Alerts regarding your compliance journeys, saved standards, and QCO amendments.</Text>
        </View>

        <View className="flex-1 items-center justify-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <BellOff size={48} color="#5f6368" className="mb-4 opacity-50" />
          <Text className="text-[18px] font-bold text-primary mb-2">You're all caught up</Text>
          <Text className="text-[14px] text-on-surface-variant text-center px-6">
            You have no new notifications right now. We'll alert you if any of your saved standards are revised or if QCOs are amended.
          </Text>
        </View>
      </View>
    </View>
  );
}
