import env from "../../config/env.js";

export const evaluate = (matches = [], query = "") => {
  const useful = matches.filter((match) => (match.score || 0) >= env.RAG_MIN_SCORE && match.metadata?.text);
  const score = useful.length ? useful.reduce((sum, match) => sum + match.score, 0) / useful.length : 0;
  const queryTerms = new Set(query.toLowerCase().split(/\W+/).filter((term) => term.length > 2));
  const coveredTerms = new Set(useful.flatMap((match) => (match.metadata.text.toLowerCase().match(/\w+/g) || [])));
  const coverage = queryTerms.size ? [...queryTerms].filter((term) => coveredTerms.has(term)).length / queryTerms.size : 0;
  return {
    sufficient: useful.length >= env.RAG_MIN_EVIDENCE && score >= env.RAG_CONFIDENCE_THRESHOLD && coverage >= env.RAG_MIN_COVERAGE,
    useful,
    score,
    coverage,
  };
};

export default { evaluate };
