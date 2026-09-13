import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, LayoutAnimation, Linking } from 'react-native';
import { Search, ChevronDown, ChevronUp, Headset } from 'lucide-react-native';



const FAQS = [
  { q: 'How do I apply for an ISI Mark Licence?', a: 'You can apply for Scheme-I (ISI Mark) via the Manakonline portal or through the AI Sathi Dossier Builder which will prepare all necessary documentation for your application.' },
  { q: 'What is the difference between Scheme-I and Scheme-II?', a: 'Scheme-I is the traditional ISI Mark licensing which involves factory audits and product testing. Scheme-II is the Compulsory Registration Scheme (CRS) primarily for electronics, which relies on self-declaration backed by test reports from BIS-recognized labs.' },
  { q: 'How long does a NABL test report stay valid?', a: 'Test reports are generally valid for 90 days from the date of issue for the purpose of submitting a new BIS application.' },
  { q: 'Can foreign manufacturers apply for BIS certification?', a: 'Yes, under the Foreign Manufacturers Certification Scheme (FMCS), overseas manufacturers can obtain BIS certification to export products to India.' },
];

export default function HelpCenterScreen() {
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-8 bg-primary">
          <Text className="text-[28px] font-bold text-white text-center mb-6">How can we help you?</Text>
          <View className="flex-row items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
            <Search size={20} color="rgba(255,255,255,0.5)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search guides, FAQs..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              className="flex-1 text-[16px] text-white ml-2"
            />
          </View>
        </View>

        <View className="p-4 gap-6">
          <View>
            <Text className="text-[18px] font-bold text-primary mb-4">Frequently Asked Questions</Text>
            <View className="gap-3">
              {FAQS.map((faq, i) => (
                <View key={i} className={`bg-surface rounded-2xl border ${openFaq === i ? 'border-secondary' : 'border-outline-variant/30'} shadow-sm overflow-hidden`}>
                  <Pressable onPress={() => toggleFaq(i)} className="flex-row items-center justify-between p-4">
                    <Text className="flex-1 text-[15px] font-bold text-primary pr-4">{faq.q}</Text>
                    {openFaq === i ? <ChevronUp size={20} color="#5f6368" /> : <ChevronDown size={20} color="#5f6368" />}
                  </Pressable>
                  {openFaq === i && (
                    <View className="px-4 pb-4 pt-1 border-t border-surface-container-low">
                      <Text className="text-[14px] text-on-surface-variant leading-6 pt-3">{faq.a}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 items-center">
            <Headset size={32} color="#0047e1" className="mb-3" />
            <Text className="text-[16px] font-bold text-primary mb-2 text-center">Need direct support?</Text>
            <Text className="text-[13px] text-on-surface-variant mb-4 text-center">
              Our compliance experts are available Monday to Friday, 9am to 6pm IST.
            </Text>
            <Pressable onPress={() => Linking.openURL('mailto:support@bis.gov.in')} className="w-full py-3 bg-secondary rounded-xl items-center">
              <Text className="text-white font-bold text-[14px]">Contact Support</Text>
            </Pressable>
          </View>

          <View className="bg-surface rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
            <Text className="text-[15px] font-bold text-primary mb-3">Popular Topics</Text>
            <View className="flex-row flex-wrap gap-2">
              {['ISI Mark', 'CRS Registration', 'Factory Audit', 'Hallmarking', 'Import Customs', 'Penalty'].map(t => (
                <View key={t} className="px-3 py-1.5 rounded-lg bg-surface-container-low">
                  <Text className="text-[13px] text-on-surface font-medium">{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
