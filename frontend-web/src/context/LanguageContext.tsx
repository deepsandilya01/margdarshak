import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, type TranslationKey } from '../data/translations';
import { translateText } from '../lib/translate';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  /** Translates static pre-defined UI keys */
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('bis-sathi-lang');
    return (stored as LanguageCode) || 'en';
  });

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('bis-sathi-lang', lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      // If we have manual translations (en/hi), use them first.
      const langDict = translations[language as keyof typeof translations];
      if (langDict && (langDict as any)[key]) {
        return (langDict as any)[key];
      }
      // Fallback to English if translation missing for the current language
      return translations.en[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be used inside <LanguageProvider>');
  return ctx;
}

/**
 * Hook to translate dynamic content on the fly.
 * Automatically respects the current language context.
 */
export function useDynamicTranslation(text: string | null | undefined): string {
  const { language } = useLanguageContext();
  const [translated, setTranslated] = useState<string>(text || '');

  useEffect(() => {
    if (!text) {
      setTranslated('');
      return;
    }
    
    // For English or empty text, just set it directly.
    if (language === 'en') {
      setTranslated(text);
      return;
    }

    let isMounted = true;
    // Note: We could show a skeleton/loading state here, but returning the original text 
    // while loading is a smoother experience than flashing a skeleton for text changes.
    translateText(text, language).then(res => {
      if (isMounted) setTranslated(res);
    });

    return () => { isMounted = false; };
  }, [text, language]);

  return translated;
}
