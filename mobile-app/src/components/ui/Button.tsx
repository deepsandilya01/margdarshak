import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { LightThemeColors } from '../../design-system/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  className = ''
}: ButtonProps) {
  const getBgClass = () => {
    if (disabled) return 'bg-surface-container-high border-transparent';
    switch (variant) {
      case 'primary': return 'bg-primary border-primary';
      case 'secondary': return 'bg-secondary border-secondary';
      case 'outline': return 'bg-transparent border-outline-variant border';
      case 'ghost': return 'bg-transparent border-transparent';
    }
  };

  const getTextClass = () => {
    if (disabled) return 'text-on-surface-variant';
    switch (variant) {
      case 'primary': 
      case 'secondary': return 'text-white';
      case 'outline': 
      case 'ghost': return 'text-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 rounded-lg';
      case 'md': return 'px-5 py-2.5 rounded-xl';
      case 'lg': return 'px-6 py-3.5 rounded-2xl';
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-[12px]';
      case 'md': return 'text-[14px]';
      case 'lg': return 'text-[16px]';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 ${getBgClass()} ${getSizeClass()} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? LightThemeColors.primary : '#fff'} size="small" />
      ) : (
        <>
          {icon}
          <Text className={`font-semibold ${getTextClass()} ${getTextSizeClass()}`}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
