import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Languages, Moon, History, Settings, FileText } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function MenuScreen() {
  const navigation = useNavigation<any>();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full mr-2">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">Menu</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 mt-2">App Settings</Text>
        <View className="bg-surface rounded-2xl border border-outline-variant overflow-hidden mb-6">
          <Pressable 
            className="flex-row items-center gap-3 p-4 border-b border-outline-variant" 
            onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            <Languages size={20} color="#5f6368" />
            <Text className="text-[15px] font-bold text-on-surface">Language</Text>
            <Text className="text-[13px] text-primary ml-auto font-bold">{language === 'hi' ? 'Hindi' : 'English'}</Text>
          </Pressable>
          <Pressable 
            className="flex-row items-center gap-3 p-4" 
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Moon size={20} color="#5f6368" />
            <Text className="text-[15px] font-bold text-on-surface">Theme</Text>
            <Text className="text-[13px] text-primary ml-auto font-bold capitalize">{theme}</Text>
          </Pressable>
        </View>

        <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Workspace & History</Text>
        <View className="bg-surface rounded-2xl border border-outline-variant overflow-hidden mb-6">
          <Pressable className="flex-row items-center gap-3 p-4 border-b border-outline-variant" onPress={() => navigation.navigate('HistoryStack')}>
            <History size={20} color="#5f6368" />
            <Text className="text-[15px] font-bold text-on-surface">Research History</Text>
          </Pressable>
          <Pressable className="flex-row items-center gap-3 p-4" onPress={() => navigation.navigate('ReportsStack')}>
            <FileText size={20} color="#5f6368" />
            <Text className="text-[15px] font-bold text-on-surface">Reports</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
