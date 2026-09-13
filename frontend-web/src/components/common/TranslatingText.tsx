import React, { useState, useEffect } from 'react';
import { useTranslation as useI18nHook } from 'react-i18next';
import { translateText } from '@/services/translation/translationService';

interface TranslatingTextProps {
  text: string | null | undefined;
  as?: React.ElementType;
  className?: string;
  fallback?: string;
}

/**
 * A component that shows text in the current language.
 * When language changes, it shows a shimmer skeleton while translating,
 * then fades in the translated text. Falls back to English on API error.
 */
export function TranslatingText({
  text,
  as: Tag = 'span',
  className = '',
  fallback = '—',
}: TranslatingTextProps) {
  const { i18n } = useI18nHook();
  const language = i18n.language || 'en';
  const [translated, setTranslated] = useState<string>(text || fallback);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text) {
      setTranslated(fallback);
      return;
    }

    if (language === 'en') {
      setTranslated(text);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    translateText(text, language)
      .then((result) => {
        if (isMounted) {
          setTranslated(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslated(text); // fallback to original
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text, language, fallback]);

  if (isLoading) {
    const Component = Tag as React.ElementType;
    return (
      <Component
        className={`translating-shimmer inline-block min-w-[4ch] ${className}`}
        aria-hidden="true"
      >
        {translated}
      </Component>
    );
  }

  const Component = Tag as React.ElementType;

  return (
    <Component className={className}>
      {translated}
    </Component>
  );
}

/**
 * Hook version: returns { text, isLoading } for when you need more control.
 * Falls back to original text on error.
 */
export function useDynamicText(text: string | null | undefined) {
  const { i18n } = useI18nHook();
  const language = i18n.language || 'en';
  const [translated, setTranslated] = useState<string>(text || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text) {
      setTranslated('');
      return;
    }

    if (language === 'en') {
      setTranslated(text);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    translateText(text, language)
      .then((result) => {
        if (isMounted) {
          setTranslated(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslated(text);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text, language]);

  return { text: translated, isLoading };
}
