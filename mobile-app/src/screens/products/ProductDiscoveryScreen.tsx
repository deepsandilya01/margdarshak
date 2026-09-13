import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useT as useTranslation } from '@/hooks/useTranslation';
import { 
  Monitor, Car, Leaf, Factory, Beaker, Baby, 
  Stethoscope, Sun, Home, Briefcase, AlertCircle, 
  Store, Globe, Box, CheckCircle, ChevronRight, ChevronLeft 
} from 'lucide-react-native';

const STEPS = [
  { id: 1, title: 'Industry Category', required: true },
  { id: 2, title: 'Environment & Duty', required: true },
  { id: 3, title: 'Material Parameters', required: false },
  { id: 4, title: 'Volume & Market', required: false },
];

const CATEGORIES = [
  { icon: Monitor, label: 'Consumer Electronics', key: 'Electronics & IT' },
  { icon: Car, label: 'Automotive & EV', key: 'Automotive & EV' },
  { icon: Leaf, label: 'Food & Agro', key: 'Agro & Food' },
  { icon: Factory, label: 'Building Materials', key: 'Structural Materials' },
  { icon: Beaker, label: 'Chemicals', key: 'Chemicals & Polymers' },
  { icon: Baby, label: 'Toys & Juveniles', key: 'Consumer Toys' },
  { icon: Stethoscope, label: 'Medical Devices', key: 'Medical' },
  { icon: Sun, label: 'Renewable Energy', key: 'Renewable' },
];

const ENVIRONMENTS = [
  { icon: Home, label: 'Household / Domestic', key: 'Domestic' },
  { icon: Briefcase, label: 'Commercial / Plant', key: 'Industrial' },
  { icon: AlertCircle, label: 'Critical / Medical', key: 'Critical' },
];

const MARKETS = [
  { icon: Store, label: 'Domestic Sale', key: 'domestic' },
  { icon: Globe, label: 'Export Only', key: 'export' },
  { icon: Box, label: 'Both', key: 'both' },
];

export default function ProductDiscoveryScreen() {
  const { t } = useTranslation(['common']);
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const setAnswer = (key: string, val: unknown) => setAnswers(prev => ({ ...prev, [key]: val }));
  const getAnswer = (key: string): string | undefined => {
    const value = answers[key];
    return typeof value === 'string' ? value : undefined;
  };

  const goNext = () => {
    if (currentStep < 4) setCurrentStep(s => s + 1);
    else navigation.navigate('ProductResults', { answers });
  };
  const goBack = () => setCurrentStep(s => Math.max(1, s - 1));
  const skip = () => setCurrentStep(s => Math.min(4, s + 1));

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-between mb-6">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <Pressable 
            onPress={() => step.id < currentStep && setCurrentStep(step.id)}
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step.id < currentStep ? 'bg-secondary' 
              : step.id === currentStep ? 'bg-primary border-4 border-[#dce1ff]' 
              : 'bg-surface-container-high'
            }`}
          >
            {step.id < currentStep ? (
              <CheckCircle size={14} color="#ffffff" />
            ) : (
              <Text className={`font-mono text-[13px] font-semibold ${step.id === currentStep ? 'text-white' : 'text-on-surface-variant'}`}>
                {step.id}
              </Text>
            )}
          </Pressable>
          {i < STEPS.length - 1 && (
            <View className={`flex-1 h-0.5 mx-1 rounded-full ${step.id < currentStep ? 'bg-secondary' : 'bg-surface-container-high'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-[11px] font-semibold uppercase tracking-widest text-secondary">Product Compliance Scope</Text>
        </View>
        <Text className="text-[28px] font-bold text-primary mb-2">Discover Applicability</Text>
        <Text className="text-[14px] text-on-surface-variant">Intelligent decision-tree to determine exact testing requirements and standards.</Text>
      </View>

      {renderStepIndicator()}

      <View className="bg-surface rounded-2xl p-5 border border-outline-variant mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[18px] font-bold text-primary">
            Step {currentStep}: {STEPS[currentStep-1].title}
          </Text>
          {STEPS[currentStep-1].required && (
            <Text className="text-[11px] font-semibold uppercase text-on-surface-variant">Required</Text>
          )}
        </View>

        {currentStep === 1 && (
          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat.key}
                onPress={() => setAnswer('category', cat.key)}
                className={`w-[48%] p-4 rounded-xl mb-3 border-2 ${
                  getAnswer('category') === cat.key 
                    ? 'bg-surface-container-high border-secondary' 
                    : 'bg-surface-container-low border-transparent'
                }`}
              >
                <cat.icon size={24} color={getAnswer('category') === cat.key ? 'var(--primary)' : 'var(--on-surface-variant)'} />
                <Text className={`mt-2 text-[13px] font-medium ${getAnswer('category') === cat.key ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {currentStep === 2 && (
          <View className="gap-3">
            {ENVIRONMENTS.map(env => (
              <Pressable
                key={env.key}
                onPress={() => setAnswer('environment', env.key)}
                className={`flex-row items-center p-4 rounded-xl border-2 ${
                  getAnswer('environment') === env.key 
                    ? 'bg-surface-container-high border-secondary' 
                    : 'bg-surface-container-low border-transparent'
                }`}
              >
                <env.icon size={22} color={getAnswer('environment') === env.key ? 'var(--primary)' : 'var(--on-surface-variant)'} />
                <Text className={`ml-3 text-[14px] font-medium ${getAnswer('environment') === env.key ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {env.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {currentStep === 3 && (
          <View className="gap-3">
            {[
              'Lithium-ion cells / Polymer Matrix',
              'Enclosure Rating: Flame-Retardant ABS',
              'High Voltage (above 48V AC/DC)',
              'Integrated Wireless Telemetry (RF)',
            ].map((param, i) => (
              <Pressable key={param} className="flex-row items-center p-3 rounded-xl bg-surface-container-low">
                <View className={`w-5 h-5 rounded border ${i < 2 ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'} items-center justify-center`}>
                  {i < 2 && <CheckCircle size={14} color="#fff" />}
                </View>
                <Text className="ml-3 text-[13px] text-on-surface flex-1">{param}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {currentStep === 4 && (
          <View className="gap-3">
            {MARKETS.map(m => (
              <Pressable
                key={m.key}
                onPress={() => setAnswer('market', m.key)}
                className={`flex-row items-center p-4 rounded-xl border-2 ${
                  getAnswer('market') === m.key 
                    ? 'bg-surface-container-high border-secondary' 
                    : 'bg-surface-container-low border-transparent'
                }`}
              >
                <m.icon size={22} color={getAnswer('market') === m.key ? 'var(--primary)' : 'var(--on-surface-variant)'} />
                <Text className={`ml-3 text-[14px] font-medium ${getAnswer('market') === m.key ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Navigation */}
        <View className="flex-row items-center justify-between mt-6 pt-5 border-t border-surface-container-low">
          <View className="flex-row items-center gap-2">
            {currentStep > 1 && (
              <Pressable onPress={goBack} className="flex-row items-center px-4 py-2 border border-outline-variant rounded-lg">
                <ChevronLeft size={16} color="#1a73e8" />
                <Text className="text-primary font-medium ml-1">Back</Text>
              </Pressable>
            )}
            {!STEPS[currentStep-1].required && (
              <Pressable onPress={skip} className="px-2">
                <Text className="text-[13px] text-on-surface-variant">Skip</Text>
              </Pressable>
            )}
          </View>
          <Pressable onPress={goNext} className="flex-row items-center px-6 py-3 bg-primary rounded-xl">
            <Text className="text-white font-semibold mr-1">{currentStep === 4 ? 'Launch' : 'Continue'}</Text>
            <ChevronRight size={16} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      {/* Resolution Preview Card */}
      <View className="bg-primary-container p-5 rounded-2xl">
        <Text className="text-[11px] font-semibold uppercase tracking-widest text-[#7a93b5] mb-4">Regulatory Resolution</Text>
        
        {getAnswer('category') ? (
          <View className="gap-3">
            <View>
              <Text className="text-[11px] uppercase tracking-widest text-[#7a93b5]">Category</Text>
              <Text className="text-white font-semibold text-[15px]">{getAnswer('category')}</Text>
            </View>
            {getAnswer('environment') && (
              <View>
                <Text className="text-[11px] uppercase tracking-widest text-[#7a93b5]">Environment</Text>
                <Text className="text-white font-semibold text-[15px]">{getAnswer('environment')}</Text>
              </View>
            )}
            
            <View className="p-3 bg-white/10 rounded-xl mt-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-[#7a93b5] font-mono text-[12px]">Mandate:</Text>
                <Text className="text-white font-mono text-[12px] font-bold">IS 16046 (Part 2)</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#7a93b5] font-mono text-[12px]">Scheme:</Text>
                <Text className="text-white font-mono text-[12px] font-bold">Scheme-II (CRS)</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text className="text-[#7a93b5] text-[14px]">Select your industry category to see the regulatory resolution...</Text>
        )}
      </View>
    </ScrollView>
  );
}
