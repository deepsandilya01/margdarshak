import embeddingService from "./embeddingService.js";
import vectorStore from "./vectorStore.js";
import evidenceEvaluator from "./evidenceEvaluator.js";

export const retrieve = async ({ query, context = {} }) => {
  const vector = await embeddingService.generateEmbedding(query);
  const filter = context.standardId ? { standardNumber: { $eq: context.standardId } } : undefined;
  const matches = await vectorStore.query({ vector, filter });
  const evaluation = evidenceEvaluator.evaluate(matches, query);
  const evidence = evaluation.useful.map((match) => ({
    id: match.id,
    text: match.metadata.text,
    score: match.score,
    sourceType: "standard",
    title: match.metadata.documentName,
    documentId: match.metadata.documentId,
    standardNumber: match.metadata.standardNumber,
    section: match.metadata.section,
    clause: match.metadata.clause,
    page: match.metadata.page,
    url: match.metadata.sourceUrl || null,
    verified: true,
  }));
  return { ...evaluation, evidence };
};

export default { retrieve };
