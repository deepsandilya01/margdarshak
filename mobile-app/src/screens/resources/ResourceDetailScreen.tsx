import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar, Printer, BookmarkPlus, Share2, BookOpen, AlertCircle } from 'lucide-react-native';
import mockResources from '../../data/resources/resources.json';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function ResourceDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {};
  const { saveItem } = useWorkspace();

  const resource = (mockResources as any[]).find(r => r.id === id) || mockResources[0];

  if (!resource) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <AlertCircle size={48} color="#dc2626" className="mb-4" />
        <Text className="text-[20px] font-bold text-primary mb-2">Resource not found</Text>
        <Pressable onPress={() => navigation.goBack()} className="bg-primary px-6 py-3 rounded-xl mt-6">
          <Text className="text-white font-bold">Back to Resources</Text>
        </Pressable>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${resource.title}\n\n${resource.summary}\n\n${resource.body}`,
        title: resource.title
      });
    } catch (error) {
      console.error('Error sharing resource:', error);
    }
  };

  const handleSave = () => {
    saveItem({
      id: resource.id,
      type: 'standard', // Mapping as standard for workspace
      title: resource.title,
      label: resource.category
    });
  };

  const relatedResources = mockResources.filter((r: any) => r.id !== resource.id).slice(0, 3);

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center shadow-sm z-10 sticky top-0">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full mr-2">
          <ChevronLeft size={24} color="#5f6368" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">Resource Library</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-6">
          <View className="p-5 border-b border-outline-variant">
            <View className="flex-row flex-wrap items-center gap-3 mb-4">
              <View className="px-3 py-1 bg-surface-container-high rounded-lg">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-on-surface">{resource.category}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color="#5f6368" />
                <Text className="text-[12px] font-bold text-on-surface-variant">
                  {new Date(resource.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
            
            <Text className="text-[22px] font-bold text-on-surface mb-4 leading-tight">{resource.title}</Text>
            <Text className="text-[15px] leading-6 text-on-surface-variant font-bold">{resource.summary}</Text>
          </View>

          <View className="p-5 bg-surface-container-lowest">
            <Text className="text-[15px] leading-6 text-on-surface">{resource.body}</Text>
          </View>
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 mb-6">
          <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Actions</Text>
          <View className="gap-3">
            <Pressable onPress={handleShare} className="flex-row items-center gap-3 w-full px-4 py-3 bg-primary rounded-xl">
              <Printer size={18} color="#ffffff" />
              <Text className="text-[14px] font-bold text-white">Print Resource</Text>
            </Pressable>
            <Pressable onPress={handleSave} className="flex-row items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl">
              <BookmarkPlus size={18} color="#5f6368" />
              <Text className="text-[14px] font-bold text-on-surface">Save to Workspace</Text>
            </Pressable>
            <Pressable onPress={handleShare} className="flex-row items-center gap-3 w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl">
              <Share2 size={18} color="#5f6368" />
              <Text className="text-[14px] font-bold text-on-surface">Share Link</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <BookOpen size={18} color="#5f6368" />
            <Text className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">Related Resources</Text>
          </View>
          
          <View className="gap-4">
            {relatedResources.map((rel: any) => (
              <Pressable 
                key={rel.id} 
                onPress={() => navigation.push('ResourceDetail', { id: rel.id })}
                className="group"
              >
                <Text className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">{rel.category}</Text>
                <Text className="text-[13px] font-bold text-on-surface leading-5" numberOfLines={2}>{rel.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
