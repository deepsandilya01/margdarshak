const memoryCache = new Map<string, string>();

function key(sourceLanguage: string, targetLanguage: string, originalText: string): string {
  return `${sourceLanguage}|${targetLanguage}|${originalText}`;
}

export function getCachedTranslation(sourceLanguage: string, targetLanguage: string, originalText: string): string | null {
  const cacheKey = key(sourceLanguage, targetLanguage, originalText);
  const inMemory = memoryCache.get(cacheKey);
  if (inMemory) return inMemory;

  try {
    return localStorage.getItem(`bis-sathi-translation:${cacheKey}`);
  } catch {
    return null;
  }
}

export function cacheTranslation(sourceLanguage: string, targetLanguage: string, originalText: string, translatedText: string): void {
  const cacheKey = key(sourceLanguage, targetLanguage, originalText);
  memoryCache.set(cacheKey, translatedText);
  try {
    localStorage.setItem(`bis-sathi-translation:${cacheKey}`, translatedText);
  } catch {
    // Translation remains available from the in-memory cache when storage is unavailable.
  }
}