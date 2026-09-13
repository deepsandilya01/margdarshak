import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FileText, Plus, Share2, MoreVertical, ChevronRight } from 'lucide-react-native';
import mockReports from '../../data/reports/reports.json';

export default function ReportsListScreen() {
  const navigation = useNavigation<any>();

  const getStatusStyle = (status: string) => {
    if (status === 'Final') {
      return { bg: '#edf7ec', text: '#0b5204', border: '#c8e8c5' }; // compliant
    }
    return { bg: '#fef3eb', text: '#a6460f', border: '#fcddc7' }; // pending
  };

  const shareReport = async (report: any) => {
    try {
      const summary = `${report.name}\n\nID: ${report.id}\nStatus: ${report.status}\n\n${report.summary}`;
      await Share.share({
        message: summary,
        title: report.name
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 pt-8 pb-4">
        <View className="flex-row items-center gap-1.5 mb-2">
          <FileText size={14} color="#b89752" />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-[#b89752]">Documentation</Text>
        </View>
        <Text className="text-[28px] font-bold text-primary mb-4">Compliance Reports</Text>
        
        <Pressable 
          onPress={() => navigation.navigate('MainTabs', { screen: 'AISathi' })}
          className="flex-row items-center justify-center gap-2 bg-primary py-3 rounded-xl mb-6"
        >
          <Plus size={18} color="#ffffff" />
          <Text className="text-white font-bold text-[14px]">Generate New Report</Text>
        </Pressable>

        <View className="gap-4 mb-8">
          {mockReports.map((report: any) => {
            const statusStyle = getStatusStyle(report.status);
            
            return (
              <Pressable 
                key={report.id}
                onPress={() => navigation.navigate('ReportPreview', { id: report.id })}
                className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-[#eae8e6] border border-[#cfcac5] px-2 py-0.5 rounded self-start">
                    <Text className="font-mono text-[11px] font-bold text-[#4a4643]">{report.id}</Text>
                  </View>
                  <View className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border }}>
                    <Text style={{ color: statusStyle.text }} className="text-[10px] font-bold uppercase tracking-wide">{report.status}</Text>
                  </View>
                </View>

                <Text className="text-[14px] font-bold text-primary mb-1 leading-5">{report.type}</Text>
                <Text className="text-[12px] text-on-surface-variant leading-5 mb-4" numberOfLines={2}>
                  {report.productContext ?? report.name}
                </Text>

                <View className="flex-row justify-between items-center pt-3 border-t border-outline-variant">
                  <Text className="font-mono text-[11px] text-on-surface-variant">
                    {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                  
                  <View className="flex-row gap-2">
                    <Pressable 
                      onPress={() => shareReport(report)}
                      className="flex-row items-center gap-1.5 px-2 py-1.5 rounded-lg bg-surface-container-low"
                    >
                      <Share2 size={14} color="#1a73e8" />
                      <Text className="font-mono text-[11px] text-[#1a73e8]">Share</Text>
                    </Pressable>
                    <View className="p-1.5 rounded-lg bg-surface-container-low justify-center">
                      <MoreVertical size={14} color="#5f6368" />
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
