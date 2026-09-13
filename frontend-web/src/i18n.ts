import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources for 12 languages
import enCommon from '@/locales/en/common.json';
import enAiSathi from '@/locales/en/aiSathi.json';
import enHome from '@/locales/en/home.json';

import hiCommon from '@/locales/hi/common.json';
import hiAiSathi from '@/locales/hi/aiSathi.json';
import hiHome from '@/locales/hi/home.json';

import mrCommon from '@/locales/mr/common.json';
import mrAiSathi from '@/locales/mr/aiSathi.json';
import mrHome from '@/locales/mr/home.json';

import bnCommon from '@/locales/bn/common.json';
import bnAiSathi from '@/locales/bn/aiSathi.json';
import bnHome from '@/locales/bn/home.json';

import taCommon from '@/locales/ta/common.json';
import taAiSathi from '@/locales/ta/aiSathi.json';
import taHome from '@/locales/ta/home.json';

import teCommon from '@/locales/te/common.json';
import teAiSathi from '@/locales/te/aiSathi.json';
import teHome from '@/locales/te/home.json';

import knCommon from '@/locales/kn/common.json';
import knAiSathi from '@/locales/kn/aiSathi.json';
import knHome from '@/locales/kn/home.json';

import guCommon from '@/locales/gu/common.json';
import guAiSathi from '@/locales/gu/aiSathi.json';
import guHome from '@/locales/gu/home.json';

import mlCommon from '@/locales/ml/common.json';
import mlAiSathi from '@/locales/ml/aiSathi.json';
import mlHome from '@/locales/ml/home.json';

import paCommon from '@/locales/pa/common.json';
import paAiSathi from '@/locales/pa/aiSathi.json';
import paHome from '@/locales/pa/home.json';

import orCommon from '@/locales/or/common.json';
import orAiSathi from '@/locales/or/aiSathi.json';
import orHome from '@/locales/or/home.json';

import asCommon from '@/locales/as/common.json';
import asAiSathi from '@/locales/as/aiSathi.json';
import asHome from '@/locales/as/home.json';

const resources = {
  en: { common: enCommon, aiSathi: enAiSathi, home: enHome },
  hi: { common: hiCommon, aiSathi: hiAiSathi, home: hiHome },
  mr: { common: mrCommon, aiSathi: mrAiSathi, home: mrHome },
  bn: { common: bnCommon, aiSathi: bnAiSathi, home: bnHome },
  ta: { common: taCommon, aiSathi: taAiSathi, home: taHome },
  te: { common: teCommon, aiSathi: teAiSathi, home: teHome },
  kn: { common: knCommon, aiSathi: knAiSathi, home: knHome },
  gu: { common: guCommon, aiSathi: guAiSathi, home: guHome },
  ml: { common: mlCommon, aiSathi: mlAiSathi, home: mlHome },
  pa: { common: paCommon, aiSathi: paAiSathi, home: paHome },
  or: { common: orCommon, aiSathi: orAiSathi, home: orHome },
  as: { common: asCommon, aiSathi: asAiSathi, home: asHome }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common', 'aiSathi', 'home'],
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'bis-sathi-lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    }
  });

export default i18n;
