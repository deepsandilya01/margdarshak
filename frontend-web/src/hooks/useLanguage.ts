/**
 * hooks/useLanguage.ts
 * Convenience hook — wraps LanguageContext + i18next for backward compat.
 *
 * Usage:
 *   const { t, language, setLanguage, translate } = useLanguage();
 */
import { useT } from '@/hooks/useTranslation';
import { useLanguageContext, useDynamicTranslation } from '@/context/LanguageContext';

export function useLanguage() {
  const { language, setLanguage, translate } = useLanguageContext();
  const { t, i18n } = useT(['common', 'home', 'aiSathi']);

  return { t, language, setLanguage, translate, i18n };
}

export { useDynamicTranslation };
