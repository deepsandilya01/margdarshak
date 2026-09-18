import { TRANSLATION_CONFIG } from '@/core/apiConfig';

export async function requestLingvaTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> {
  const encodedText = encodeURIComponent(text.trim());
  const url = `${TRANSLATION_CONFIG.BASE_URL}/api/lingva/${sourceLanguage}/${targetLanguage}/${encodedText}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Lingva HTTP ${response.status}`);
    const data = await response.json() as { translation?: unknown };
    return typeof data.translation === 'string' && data.translation ? data.translation : text;
  } finally {
    clearTimeout(timeoutId);
  }
}