const normalize = (value) => value.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

export const chunkText = (text, { maxCharacters = 3500, overlap = 400 } = {}) => {
  const cleaned = normalize(text);
  const pages = cleaned.split(/\f/);
  const chunks = [];
  pages.forEach((pageText, pageIndex) => {
    if (!pageText.trim()) return;
    let start = 0;
    while (start < pageText.length) {
      const end = Math.min(pageText.length, start + maxCharacters);
      const value = pageText.slice(start, end).trim();
      if (value) chunks.push({ text: value, page: pageIndex + 1, section: value.split("\n")[0].slice(0, 200) });
      if (end === pageText.length) break;
      start = Math.max(start + 1, end - overlap);
    }
  });
  return chunks;
};

export default { chunkText };
