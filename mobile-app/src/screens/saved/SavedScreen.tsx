import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, BookmarkMinus, Bookmark, FileText, Beaker, ShieldCheck, Box } from 'lucide-react-native';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TechIdentifier } from '../../components/feedback/StatusPill';

export default function SavedScreen() {
  const navigation = useNavigation<any>();
  const { savedItems, unsaveItem } = useWorkspace();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'standard': return <FileText size={20} color="#5f6368" />;
      case 'qco': return <ShieldCheck size={20} color="#5f6368" />;
      case 'lab': return <Beaker size={20} color="#5f6368" />;
      default: return <Box size={20} color="#5f6368" />;
    }
  };

  const handleNavigate = (item: any) => {
    switch (item.type) {
      case 'standard': navigation.navigate('StandardDetail', { id: item.id }); break;
      case 'qco': navigation.navigate('QCOStack', { screen: 'QCODetail', params: { id: item.id } }); break;
      case 'lab': navigation.navigate('LabStack', { screen: 'LabDetail', params: { id: item.id } }); break;
      case 'product': navigation.navigate('DiscoveryStack', { screen: 'ProductDiscovery' }); break;
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full flex-row items-center">
          <ChevronLeft size={24} color="#5f6368" />
          <Text className="text-[16px] font-bold text-primary ml-1">Personal Library</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-[28px] font-bold text-primary mb-2">Saved Items</Text>
          <Text className="text-[14px] text-on-surface-variant">Standards, QCOs, and labs you have bookmarked.</Text>
        </View>

        {savedItems.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Bookmark size={48} color="#5f6368" className="mb-4 opacity-50" />
            <Text className="text-[18px] font-bold text-primary mb-2">Nothing saved yet</Text>
            <Text className="text-[14px] text-on-surface-variant text-center px-6 mb-6">
              Bookmark standards, QCOs, and labs from the explorer pages to find them here quickly.
            </Text>
            <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Standards' })} className="px-6 py-3 bg-primary rounded-xl">
              <Text className="text-white font-bold">Browse Standards</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            {savedItems.map(item => (
              <View key={item.id} className="flex-row items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant shadow-sm">
                <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  {getIconForType(item.type)}
                </View>
                <View className="flex-1">
                  <TechIdentifier code={item.label} size="md" />
                  <Text className="text-[14px] font-bold text-on-surface mt-1 truncate" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-[11px] font-mono text-on-surface-variant mt-1">Saved {new Date(item.savedAt).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Pressable onPress={() => handleNavigate(item)} className="px-3 py-2 bg-surface-container-low rounded-lg">
                    <Text className="text-[12px] font-bold text-primary">View</Text>
                  </Pressable>
                  <Pressable onPress={() => unsaveItem(item.id)} className="p-2 bg-[#ffdad6] rounded-lg">
                    <BookmarkMinus size={18} color="#ba1a1a" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
