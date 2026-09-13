import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Library, Eye, Download, BookOpen, FileText, HelpCircle, FileType } from 'lucide-react-native';
import mockResources from '../../data/resources/resources.json';

export default function ResourcesScreen() {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(mockResources.map((r: any) => r.category)))];

  const filteredResources = activeFilter === 'All' 
    ? mockResources 
    : mockResources.filter((r: any) => r.category === activeFilter);

  const getCategoryStyle = (category: string) => {
    switch(category) {
      case 'Guidelines':
      case 'Educational Resources':
        return { bg: '#edf7ec', text: '#0b5204', border: '#c8e8c5', icon: BookOpen }; // compliant
      case 'FAQs':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', icon: HelpCircle }; // web faq style
      case 'Circulars':
        return { bg: '#fef3eb', text: '#a6460f', border: '#fcddc7', icon: FileText }; // pending
      case 'Standards':
        return { bg: '#eae8e6', text: '#4a4643', border: '#cfcac5', icon: FileType }; // tech-id
      default:
        return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0', icon: FileText };
    }
  };

  const shareResource = async (resource: any) => {
    try {
      await Share.share({
        message: `${resource.title}\n\n${resource.summary}\n\nView more details in the BIS-SATHI app.`,
        title: resource.title
      });
    } catch (error) {
      console.error('Error sharing resource:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 pt-8 pb-4">
        <View className="flex-row items-center gap-1.5 mb-2">
          <Library size={14} color="#b89752" />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-[#b89752]">Knowledge Repository</Text>
        </View>
        <Text className="text-[28px] font-bold text-primary mb-2">Resource Library</Text>
        <Text className="text-[14px] text-on-surface-variant leading-5 mb-6">
          Access technical guidelines, circulars, research materials, and standard documentation.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-2 bg-surface-container-low p-1 rounded-xl">
            {categories.map((cat: any) => (
              <Pressable
                key={cat}
                onPress={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-lg ${activeFilter === cat ? 'bg-surface shadow-sm' : ''}`}
              >
                <Text className={`text-[13px] font-bold ${activeFilter === cat ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View className="gap-4 mb-8">
          {filteredResources.map((resource: any) => {
            const style = getCategoryStyle(resource.category);
            const Icon = style.icon;

            return (
              <Pressable
                key={resource.id}
                onPress={() => navigation.navigate('ResourceDetail', { id: resource.id })}
                className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-4"
              >
                <View className="flex-row gap-4">
                  <View className="w-12 h-12 rounded-xl bg-surface-container-low items-center justify-center shrink-0">
                    <Icon size={24} color="#1a73e8" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-2 flex-wrap">
                      <View className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: style.bg, borderColor: style.border }}>
                        <Text style={{ color: style.text }} className="text-[10px] font-bold uppercase tracking-wide">
                          {resource.category}
                        </Text>
                      </View>
                      <Text className="font-mono text-[11px] text-on-surface-variant">
                        {new Date(resource.publishedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    <Text className="text-[15px] font-bold text-primary mb-1 leading-5">{resource.title}</Text>
                    <Text className="text-[13px] text-on-surface-variant leading-5 mb-3" numberOfLines={2}>
                      {resource.summary}
                    </Text>

                    <View className="flex-row items-center justify-end gap-2 mt-1">
                      <Pressable 
                        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant"
                        onPress={() => navigation.navigate('ResourceDetail', { id: resource.id })}
                      >
                        <Eye size={14} color="#5f6368" />
                        <Text className="text-[12px] font-bold text-on-surface-variant">View</Text>
                      </Pressable>
                      <Pressable 
                        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary"
                        onPress={() => shareResource(resource)}
                      >
                        <Download size={14} color="#ffffff" />
                        <Text className="text-[12px] font-bold text-white">Download</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

      </View>
    </ScrollView>
  );
}
