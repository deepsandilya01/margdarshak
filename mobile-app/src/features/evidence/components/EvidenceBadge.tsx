import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CheckCircle, Link, Info, AlertTriangle } from 'lucide-react-native';

export type EvidenceStatus = 'verified' | 'source_backed' | 'partial' | 'needs_verification';

interface EvidenceBadgeProps {
  status: EvidenceStatus | string;
  onPress?: () => void;
  compact?: boolean;
}

const normalizeEvidenceStatus = (status: string): EvidenceStatus => {
  const normalized = status.toLowerCase().replace(/[-\s]+/g, '_');
  if (['verified', 'source_backed', 'partial', 'needs_verification'].includes(normalized)) {
    return normalized as EvidenceStatus;
  }
  return 'verified';
};

const statusConfig = {
  verified: {
    label: 'Verified',
    bg: '#edf7ec',
    text: '#0b5204',
    border: '#c3e6cb',
    Icon: CheckCircle,
  },
  source_backed: {
    label: 'Source-backed',
    bg: '#eff6ff',
    text: '#1d4ed8',
    border: '#bfdbfe',
    Icon: Link,
  },
  partial: {
    label: 'Partial',
    bg: '#fff8e6',
    text: '#b37f00',
    border: '#ffdb7a',
    Icon: Info,
  },
  needs_verification: {
    label: 'Needs Verification',
    bg: '#ffedec',
    text: '#9e1c15',
    border: '#ffc4c2',
    Icon: AlertTriangle,
  },
};

export function EvidenceBadge({ status, onPress, compact = false }: EvidenceBadgeProps) {
  const cfg = statusConfig[normalizeEvidenceStatus(String(status))];
  const Icon = cfg.Icon;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border ${!onPress ? 'opacity-90' : ''}`}
    >
      <Icon size={14} color={cfg.text} />
      {!compact && (
        <Text style={{ color: cfg.text }} className="text-[12px] font-bold uppercase tracking-widest">
          {cfg.label}
        </Text>
      )}
    </Pressable>
  );
}
