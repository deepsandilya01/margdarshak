/**
 * LibreTranslate API wrapper for dynamic content translation.
 * Uses the free public endpoint, but can easily swap to another backend.
 */

const LIBRE_TRANSLATE_API = 'https://libretranslate.com/translate';

// Local cache to avoid re-translating same strings
const translationCache = new Map<string, string>();

/**
 * Translates a single string of text.
 * @param text The text to translate (assumed English).
 * @param targetLang The target language code (e.g. 'hi', 'ta').
 * @returns The translated text, or the original text if translation fails.
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  if (targetLang === 'en') return text; // Base language is English

  const cacheKey = `${targetLang}:${text}`;
  
  // 1. Check in-memory cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  // 2. Check localStorage cache
  const lsKey = `bis-sathi-i18n-${cacheKey}`;
  const stored = localStorage.getItem(lsKey);
  if (stored) {
    translationCache.set(cacheKey, stored);
    return stored;
  }

  // 3. Fetch from API
  try {
    const res = await fetch(LIBRE_TRANSLATE_API, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`Translation API error: ${res.statusText}`);
      return text;
    }

    const data = await res.json();
    const translated = data.translatedText;
    
    // Save to caches
    if (translated) {
      translationCache.set(cacheKey, translated);
      localStorage.setItem(lsKey, translated);
      return translated;
    }
    
    return text;
  } catch (error) {
    console.warn('Translation request failed:', error);
    return text; // Graceful fallback
  }
}
