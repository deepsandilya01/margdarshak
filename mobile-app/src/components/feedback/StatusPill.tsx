import React from 'react';
import { View, Text, Pressable } from 'react-native';

export function StatusPill({ status, size = 'md' }: { status: string, size?: 'sm' | 'md' }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'mandatory_qco':
        return { bg: 'bg-[#ffedec]', text: 'text-[#9e1c15]', border: 'border-[#ffc4c2]', icon: 'gavel', label: 'Mandatory (QCO)' };
      case 'active':
        return { bg: 'bg-[#edf7ec]', text: 'text-[#0b5204]', border: 'border-[#c8e8c5]', icon: 'check_circle', label: 'Active & Current' };
      case 'superseded':
        return { bg: 'bg-[#fef3eb]', text: 'text-[#a6460f]', border: 'border-[#fcddc7]', icon: 'update', label: 'Superseded' };
      default:
        return { bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant', icon: 'help', label: status };
    }
  };

  const config = getStatusConfig();
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-[12px]';

  return (
    <View className={`flex-row items-center gap-1.5 rounded-full border ${config.bg} ${config.border} ${padding}`}>
      <Text className={`${config.text} ${textSize} font-medium`}>{config.label}</Text>
    </View>
  );
}

export function TechIdentifier({ code, size = 'md', onClick }: { code: string, size?: 'md' | 'lg', onClick?: () => void }) {
  const textSize = size === 'lg' ? 'text-[24px]' : 'text-[15px]';
  const prefixSize = size === 'lg' ? 'text-[16px]' : 'text-[11px]';

  const parts = code.split(' ');
  const prefix = parts[0];
  const number = parts.slice(1).join(' ');

  return (
    <Pressable onPress={onClick} className="flex-row items-baseline gap-1">
      <Text className={`font-mono text-on-surface-variant font-medium ${prefixSize}`}>{prefix}</Text>
      <Text className={`font-mono text-on-surface font-bold ${textSize}`}>{number}</Text>
    </Pressable>
  );
}
