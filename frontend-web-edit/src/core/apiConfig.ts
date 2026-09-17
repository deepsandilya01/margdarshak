export const TRANSLATION_CONFIG = {
  BASE_URL: '',
  DEFAULT_SOURCE: 'en',
  DEFAULT_TARGET: 'en',
  TIMEOUT_MS: 8000,
  CACHE_PREFIX: 'lingva_cache_'
};

export const LANGUAGES = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese' }
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];
