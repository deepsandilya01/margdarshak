export const validateCitations = (citations = [], evidence = []) => {
  const validIds = new Set(evidence.map((item) => item.id || item.sourceId).filter(Boolean));
  return citations.filter((citation) => {
    if (!citation || !citation.id || !validIds.has(citation.id)) return false;
    const source = evidence.find((item) => (item.id || item.sourceId) === citation.id);
    if (!source) return false;
    if (citation.sourceType === "web" && citation.url !== source.url) return false;
    return true;
  }).map((citation) => ({ ...citation, verified: true }));
};

export default { validateCitations };
