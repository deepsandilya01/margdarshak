import { useLanguageContext, useDynamicTranslation } from '../context/LanguageContext';

/**
 * Convenience re-export of the t() translation function.
 * Usage: const { t, language, setLanguage } = useLanguage();
 */
export function useLanguage() {
  return useLanguageContext();
}

export { useDynamicTranslation };
