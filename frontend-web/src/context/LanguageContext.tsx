/**
 * Global Language Context — single source of truth for language state.
 * Syncs react-i18next language with localStorage and provides
 * the useDynamicTranslation hook for runtime Lingva translation.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useT as useTranslation } from '@/hooks/useTranslation';
import i18n from '@/i18n';
import { LANGUAGES, type LanguageCode } from '@/core/apiConfig';
import { translateText } from '@/services/translation/translationService';

// Re-export for backward compatibility with components that import from here
export { LANGUAGES as SUPPORTED_LANGUAGES };
export type { LanguageCode };

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  /** Translates a string using the full priority chain */
  translate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('bis-sathi-lang');
    return LANGUAGES.some(item => item.code === stored) ? stored as LanguageCode : 'en';
  });

  // Ensure i18next stays in sync with our language state
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Listen for i18next language changes (from Header or other sources)
  useEffect(() => {
    const handler = (lng: string) => {
      if (LANGUAGES.some(item => item.code === lng) && lng !== language) {
        setLanguageState(lng as LanguageCode);
        localStorage.setItem('bis-sathi-lang', lng);
      }
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [language]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('bis-sathi-lang', lang);
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

/**
 * useDynamicTranslation — translates a single string reactively.
 * Shows English immediately, updates to translated text once resolved.
 * Falls back to English on failure — NEVER to Hindi.
 */
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

/**
 * Legacy hook alias — kept for backward compat
 */
export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();
  const { t } = useTranslation(['common', 'home', 'aiSathi']);
  return { language, setLanguage, t };
}
