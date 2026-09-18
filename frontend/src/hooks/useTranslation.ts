/**
 * hooks/useTranslation.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical translation hooks for BIS-SATHI.
 *
 * ARCHITECTURE:
 *   Component
 *   └─ useT / useLingvaText / useLingvaBatch   ← these hooks
 *      └─ services/translation/translationService  (Lingva + cache)
 *
 * Priority chain (NEVER falls back to Hindi):
 *   1. react-i18next static JSON resource (fastest)
 *   2. session-memory cache
 *   3. localStorage cache
 *   4. Lingva Translate API
 *   5. English text fallback
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation as useI18nHook } from 'react-i18next';
import { translateText } from '@/services/translation/translationService';

// ─── Session cache (in-memory, per browser tab) ──────────────────────────────
const sessionCache = new Map<string, string>();
const sessionKey = (lang: string, text: string) => `en|${lang}|${text}`;

// ─── Core async translate (used by all hooks below) ──────────────────────────
export async function translate(text: string, lang: string): Promise<string> {
  if (!text || lang === 'en') return text;
  const k = sessionKey(lang, text);
  if (sessionCache.has(k)) return sessionCache.get(k)!;
  const result = await translateText(text, lang);
  sessionCache.set(k, result);
  return result;
}

// ─── useT ─────────────────────────────────────────────────────────────────────
/**
 * Drop-in for react-i18next's useTranslation.
 * t(key) resolves static JSON resources first, then shows a readable fallback.
 */
export function useT(namespaces?: string[]) {
  const { t: i18nT, i18n } = useI18nHook(namespaces ?? ['common', 'home', 'aiSathi']);
  const currentLang = i18n.language || 'en';

  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      const resolved = i18nT(key, { ...options, defaultValue: '' }) as string;
      if (!resolved) {
        // Derive readable label from dot-key e.g. "nav.standards" → "standards"
        const parts = key.split('.');
        return parts[parts.length - 1].replace(/_/g, ' ');
      }
      return resolved;
    },
    [i18nT],
  );

  return { t, currentLang, i18n };
}

// ─── useLingvaText ────────────────────────────────────────────────────────────
/**
 * Translate a single English string via Lingva, reactively.
 * Shows the original immediately; updates when translation resolves.
 *
 * @example
 *   const label = useLingvaText('Find Applicable Standards');
 *   return <h2>{label}</h2>;
 */
export function useLingvaText(englishText: string | null | undefined): string {
  const { i18n } = useI18nHook();
  const lang = i18n.language || 'en';
  const [output, setOutput] = useState<string>(englishText ?? '');
  const latestRef = useRef(englishText);

  useEffect(() => { latestRef.current = englishText; });

  useEffect(() => {
    if (!englishText) { setOutput(''); return; }
    if (lang === 'en') { setOutput(englishText); return; }

    const k = sessionKey(lang, englishText);
    if (sessionCache.has(k)) { setOutput(sessionCache.get(k)!); return; }

    setOutput(englishText); // show original while fetching

    let active = true;
    translate(englishText, lang).then(r => {
      if (active && latestRef.current === englishText) setOutput(r);
    });
    return () => { active = false; };
  }, [englishText, lang]);

  return output;
}

// ─── useLingvaBatch ───────────────────────────────────────────────────────────
/**
 * Translate multiple strings at once. Returns a stable map of original → translated.
 * Deduplicates requests and uses all caching layers.
 *
 * @example
 *   const tx = useLingvaBatch(['Home', 'Standards', 'Search']);
 *   return <nav>{tx['Standards'] ?? 'Standards'}</nav>;
 */
export function useLingvaBatch(englishStrings: string[]): Record<string, string> {
  const { i18n } = useI18nHook();
  const lang = i18n.language || 'en';
  const [map, setMap] = useState<Record<string, string>>({});
  const stableKey = englishStrings.join('||');

  useEffect(() => {
    if (!englishStrings.length) return;
    if (lang === 'en') {
      setMap(Object.fromEntries(englishStrings.map(s => [s, s])));
      return;
    }

    const hits: Record<string, string> = {};
    const misses: string[] = [];

    for (const text of englishStrings) {
      const k = sessionKey(lang, text);
      if (sessionCache.has(k)) hits[text] = sessionCache.get(k)!;
      else misses.push(text);
    }

    if (Object.keys(hits).length) setMap(prev => ({ ...prev, ...hits }));
    if (!misses.length) return;

    let active = true;
    Promise.all(misses.map(text => translate(text, lang).then(r => [text, r] as const)))
      .then(entries => {
        if (active) setMap(prev => ({ ...prev, ...Object.fromEntries(entries) }));
      });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey, lang]);

  return map;
}
