/**
 * TranslatedText — renders text via Lingva Translate.
 * 
 * Usage:
 *   <T>Find Applicable Standards</T>
 *   <T tag="h1" className="text-2xl">Welcome to BIS-SATHI</T>
 * 
 * Shows original text immediately, updates reactively when translation arrives.
 */
import React from 'react';
import { useLingvaText } from '@/hooks/useTranslation';

interface Props {
  children: string;
  tag?: React.ElementType;
  className?: string;
  placeholder?: true; // if true, also translates placeholder attribute
  [key: string]: unknown;
}

export default function T({ children, tag: Tag = 'span', className, ...rest }: Props) {
  const translated = useLingvaText(children);
  return <Tag className={className} {...rest}>{translated}</Tag>;
}

/**
 * TranslatedPlaceholder — hook for input placeholder translation.
 * 
 * Usage:
 *   const ph = useTranslatedPlaceholder('Search standards...');
 *   return <input placeholder={ph} />;
 */
export { useLingvaText as useTranslatedPlaceholder };
