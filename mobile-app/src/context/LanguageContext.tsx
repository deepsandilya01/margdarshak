import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useT as useTranslation } from '@/hooks/useTranslation';
import i18n from '@/i18n';
import { LANGUAGES, type LanguageCode } from '@/core/apiConfig';
import { translateText } from '@/services/translation/translationService';

export { LANGUAGES as SUPPORTED_LANGUAGES };
export type { LanguageCode };

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    AsyncStorage.getItem('bis-sathi-lang').then((stored) => {
      if (stored && LANGUAGES.some(item => item.code === stored)) {
        setLanguageState(stored as LanguageCode);
        if (i18n.language !== stored) i18n.changeLanguage(stored);
      }
    });
  }, []);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    const handler = (lng: string) => {
      if (LANGUAGES.some(item => item.code === lng) && lng !== language) {
        setLanguageState(lng as LanguageCode);
        AsyncStorage.setItem('bis-sathi-lang', lng);
      }
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [language]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    AsyncStorage.setItem('bis-sathi-lang', lang);
    i18n.changeLanguage(lang);
  }, []);

  const translate = useCallback(
    async (text: string) => {
      if (!text || language === 'en') return text;
      return translateText(text, language, 'en');
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be used inside <LanguageProvider>');
  return ctx;
}

export function useDynamicTranslation(text: string | null | undefined): string {
  const { language } = useLanguageContext();
  const [translated, setTranslated] = useState<string>(text || '');

  useEffect(() => {
    if (!text) { setTranslated(''); return; }
    if (language === 'en') { setTranslated(text); return; }

    let active = true;
    translateText(text, language, 'en').then(result => {
      if (active) setTranslated(result);
    });

    return () => { active = false; };
  }, [text, language]);

  return translated;
}

export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();
  const { t } = useTranslation(['common', 'home', 'aiSathi']);
  return { language, setLanguage, t };
}
