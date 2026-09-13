import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, onPress, className = '', variant = 'outlined', ...props }: CardProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'default': return 'bg-surface';
      case 'elevated': return 'bg-surface shadow-sm';
      case 'outlined': return 'bg-surface border border-outline-variant';
    }
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={`rounded-2xl p-5 ${getVariantClass()} ${className}`}
      {...props as any}
    >
      {children}
    </Container>
  );
}
