const DEVANAGARI = /[\u0900-\u097F]/;
const BENGALI = /[\u0980-\u09FF]/;
const GUJARATI = /[\u0A80-\u0AFF]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;

export const detectLanguage = (text, requestedLanguage = "auto") => {
  if (requestedLanguage && requestedLanguage !== "auto") return requestedLanguage;
  if (DEVANAGARI.test(text)) return "hi";
  if (BENGALI.test(text)) return "bn";
  if (GUJARATI.test(text)) return "gu";
  if (GURMUKHI.test(text)) return "pa";

  const hindiWords = /\b(kya|hai|ke|ka|ki|ko|se|mein|me|par|aur|yeh|woh|kr|kare|process|requirements)\b/i;
  return hindiWords.test(text) ? "hinglish" : "en";
};

export default detectLanguage;
