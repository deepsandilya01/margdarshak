import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Share2, Verified, BookOpen, AlertCircle } from 'lucide-react-native';
import { EvidenceBadge } from '../../features/evidence/components/EvidenceBadge';
import mockReports from '../../data/reports/reports.json';

export default function ReportPreviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params || {};

  const report = (mockReports as any[]).find(r => r.id === id);

  if (!report) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <AlertCircle size={48} color="#dc2626" className="mb-4" />
        <Text className="text-[20px] font-bold text-primary mb-2">Report not found</Text>
        <Pressable onPress={() => navigation.goBack()} className="bg-primary px-6 py-3 rounded-xl mt-6">
          <Text className="text-white font-bold">Back to Reports</Text>
        </Pressable>
      </View>
    );
  }

  const shareFullReport = async () => {
    try {
      let content = `${report.name}\nID: ${report.id}\nType: ${report.type}\nStatus: ${report.status}\nDate: ${report.date}\n\n`;
      content += `SUMMARY:\n${report.summary}\n\n`;
      
      report.sections?.forEach((section: any, idx: number) => {
        content += `${idx + 1}. ${section.heading}\n${section.content}\n\n`;
      });
      
      await Share.share({
        message: content,
        title: report.name
      });
    } catch (error) {
      console.error('Error sharing full report:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-4 bg-surface border-b border-outline-variant flex-row items-center justify-between shadow-sm z-10 sticky top-0">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
            <ChevronLeft size={24} color="#5f6368" />
          </Pressable>
          <Text className="text-[18px] font-bold text-primary">Report Preview</Text>
        </View>
        <Pressable 
          onPress={shareFullReport}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg bg-primary"
        >
          <Share2 size={14} color="#ffffff" />
          <Text className="text-[12px] font-bold text-white">Share PDF</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-6">
          
          <View className="p-5 border-b border-outline-variant bg-surface-container-lowest">
            <View className="flex-row justify-between items-start mb-6">
              <View className="items-end ml-auto">
                <Text className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant mb-1">Report ID</Text>
                <Text className="text-[13px] font-mono font-bold text-on-surface bg-surface-container px-2 py-1 rounded">{report.id}</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2 mb-4">
              <View className="px-2.5 py-1 bg-[#e8f0fe] border border-[#d2e3fc] rounded-md">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-[#1a73e8]">{report.type}</Text>
              </View>
              {report.status === 'Final' ? (
                <View className="px-2.5 py-1 bg-[#edf7ec] border border-[#c3e6cb] rounded-md">
                  <Text className="text-[11px] font-bold uppercase tracking-wider text-[#0b5204]">{report.status}</Text>
                </View>
              ) : (
                <View className="px-2.5 py-1 bg-[#fff8e6] border border-[#ffdb7a] rounded-md">
                  <Text className="text-[11px] font-bold uppercase tracking-wider text-[#b37f00]">{report.status}</Text>
                </View>
              )}
            </View>

            <Text className="text-[24px] font-bold text-on-surface mb-4 leading-tight">{report.name}</Text>

            <View className="gap-3 text-[13px] text-on-surface-variant">
              <View>
                <Text className="text-[10px] uppercase tracking-widest mb-0.5">Generated</Text>
                <Text className="font-bold text-on-surface">{new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              </View>
              {report.productContext && (
                <View>
                  <Text className="text-[10px] uppercase tracking-widest mb-0.5">Product Context</Text>
                  <Text className="font-bold text-on-surface">{report.productContext}</Text>
                </View>
              )}
            </View>
          </View>

          <View className="p-5">
            <View className="mb-8 p-4 bg-surface-container-low rounded-xl border-l-4 border-primary">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Executive Summary</Text>
              <Text className="text-[14px] leading-5 text-on-surface">{report.summary}</Text>
            </View>

            <View className="gap-6">
              {report.sections?.map((section: any, idx: number) => (
                <View key={idx}>
                  <View className="flex-row items-center gap-3 mb-2">
                    <View className="w-6 h-6 rounded-full bg-surface-container items-center justify-center border border-outline-variant">
                      <Text className="text-[12px] font-mono font-bold text-primary">{idx + 1}</Text>
                    </View>
                    <Text className="text-[16px] font-bold text-on-surface flex-1">{section.heading}</Text>
                  </View>
                  <Text className="text-[14px] leading-5 text-on-surface-variant pl-9">{section.content}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="p-5 border-t border-outline-variant bg-surface-container-lowest">
            <View className="gap-6">
              <View>
                <View className="flex-row items-center gap-2 mb-4">
                  <Verified size={18} color="#5f6368" />
                  <Text className="text-[13px] font-bold uppercase tracking-widest text-on-surface">Verified Evidence</Text>
                </View>
                <View className="gap-3">
                  {report.evidence?.map((ev: any) => (
                    <View key={ev.id} className="p-3 bg-surface rounded-lg border border-outline-variant">
                      <View className="flex-row justify-between items-start gap-2 mb-1">
                        <Text className="text-[13px] font-bold text-on-surface flex-1">{ev.source}</Text>
                        <EvidenceBadge status={ev.status} compact />
                      </View>
                      <Text className="text-[12px] text-on-surface-variant mb-1.5">{ev.document}</Text>
                      <View className="bg-surface-container-low self-start px-1.5 py-0.5 rounded">
                        <Text className="text-[11px] font-mono text-on-surface-variant">{ev.section}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              
              <View>
                <View className="flex-row items-center gap-2 mb-4">
                  <BookOpen size={18} color="#5f6368" />
                  <Text className="text-[13px] font-bold uppercase tracking-widest text-on-surface">References</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {report.references?.map((ref: string) => (
                    <View key={ref} className="bg-[#eae8e6] border border-[#cfcac5] px-2 py-0.5 rounded">
                      <Text className="font-mono text-[11px] font-bold text-[#4a4643]">{ref}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
