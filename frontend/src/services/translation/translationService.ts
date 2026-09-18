import { cacheTranslation, getCachedTranslation } from '@/services/translation/translationCache';
import { requestLingvaTranslation } from '@/services/translation/translationApi';

const protectedTerms = new Set([
  'BIS', 'ISI', 'QCO', 'NABL', 'CRS', 'FMCS', 'AI Sathi', 'BIS-SATHI',
  'IS', 'FSSAI', 'BEE', 'CPCB', 'DPIIT',
]);

const pendingRequests = new Map<string, Promise<string>>();

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage = 'en',
): Promise<string> {
  if (!text || sourceLanguage === targetLanguage || protectedTerms.has(text.trim())) return text;

  const cached = getCachedTranslation(sourceLanguage, targetLanguage, text);
  if (cached) return cached;

  const requestKey = `${sourceLanguage}|${targetLanguage}|${text}`;
  const pending = pendingRequests.get(requestKey);
  if (pending) return pending;

  const request = requestLingvaTranslation(text, sourceLanguage, targetLanguage)
    .then(translated => {
      if (translated && translated !== text) cacheTranslation(sourceLanguage, targetLanguage, text, translated);
      return translated || text;
    })
    .catch(() => text)
    .finally(() => pendingRequests.delete(requestKey));

  pendingRequests.set(requestKey, request);
  return request;
}

export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage = 'en',
): Promise<Record<string, string>> {
  const uniqueTexts = [...new Set(texts.filter(Boolean))];
  const entries = await Promise.all(uniqueTexts.map(async text => [
    text,
    await translateText(text, targetLanguage, sourceLanguage),
  ] as const));
  return Object.fromEntries(entries);
}