import crypto from "crypto";
import languageDetector from "./languageDetector.js";
import intentDetector from "./intentDetector.js";
import ragService from "./ragService.js";
import tavilyService from "./tavilyService.js";
import llmService from "./llmService.js";
import citationValidator from "./citationValidator.js";

const requestId = () => `req-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

const isCurrentInfoQuery = (query = "") => {
  const text = String(query).toLowerCase();
  return /(latest|current|newest|recent|up-to-date|as of|in 202[0-9]|202[0-9]|today|this year)/i.test(text);
};

const isInsufficientAnswerText = (text = "") => {
  const normalized = String(text).toLowerCase();
  return normalized.includes("not found") || normalized.includes("not available") || normalized.includes("not provided") || normalized.includes("unable to verify") || normalized.includes("could not find sufficient") || normalized.includes("insufficient evidence");
};

export const process = async ({ message, language = "auto", context = {}, history = [] }) => {
  const id = requestId();
  const detectedLanguage = languageDetector(message, language);
  const intent = intentDetector(message);

  if (intent === "conversational") {
    const greetingText = detectedLanguage === "hi"
      ? "नमस्ते! मैं AI SATHI हूँ। मैं भारतीय मानकों, BIS प्रमाणीकरण, QCOs, या परीक्षण प्रयोगशालाओं से संबंधित आपकी कैसे मदद कर सकता हूँ?"
      : "Hello! I'm AI SATHI. How can I help you with Indian Standards, BIS certification, QCOs, testing laboratories, or other BIS services?";
    return {
      requestId: id,
      status: "success",
      intent,
      language: detectedLanguage,
      answer: { text: greetingText, language: detectedLanguage },
      evidence: [],
      citations: [],
      related: { standards: [], qcos: [], labs: [] },
      actions: [],
    };
  }

  let rag = { evidence: [], sufficient: false, score: 0, coverage: 0 };
  let webEvidence = [];
  const pdfEvidence = Array.isArray(rag.evidence) ? rag.evidence : [];

  try {
    rag = await ragService.retrieve({ query: message, context });
  } catch (error) {
    console.warn(`[AI] RAG retrieval failed for ${id}: ${error.message}`);
  }

  const pdfEvidenceNow = Array.isArray(rag.evidence) ? rag.evidence : [];
  const pdfSufficient = Boolean(rag.sufficient) && pdfEvidenceNow.length > 0;
  const shouldFallbackToWeb = !pdfSufficient || isCurrentInfoQuery(message);

  if (shouldFallbackToWeb) {
    try {
      webEvidence = await tavilyService.search(message);
    } catch (error) {
      console.warn(`[AI] Tavily fallback failed for ${id}: ${error.message}`);
    }
  }

  const validWebEvidence = webEvidence.filter((item) => item && (item.verified || item.sourceType === "web") && item.url);
  const allEvidence = [...pdfEvidenceNow, ...validWebEvidence];

  console.info("[AI] retrieval summary", {
    requestId: id,
    intent,
    language: detectedLanguage,
    retrievalAttempted: true,
    pdfEvidenceCount: pdfEvidenceNow.length,
    pdfScore: rag.score ?? 0,
    pdfCoverage: rag.coverage ?? 0,
    pdfEvidenceSufficient: pdfSufficient,
    tavilyTriggered: shouldFallbackToWeb,
    validWebResults: validWebEvidence.length,
    finalEvidenceSources: allEvidence.map((item) => ({ id: item.id, sourceType: item.sourceType || item.type, url: item.url || null })),
    finalCitationCount: 0,
  });

  if (!allEvidence.length) {
    console.info("[AI] insufficient evidence decision", { requestId: id, reason: "no retrieved PDF or web evidence", pdfEvidenceSufficient: pdfSufficient, tavilyTriggered: shouldFallbackToWeb });
    return {
      requestId: id,
      status: "insufficient_evidence",
      intent,
      language: detectedLanguage,
      answer: { text: "I could not find sufficient verified BIS evidence to answer this question.", language: detectedLanguage },
      evidence: [],
      citations: [],
      related: { standards: [], qcos: [], labs: [] },
      actions: [],
    };
  }

  try {
    const generated = await llmService.generateAnswer({ query: message, language: detectedLanguage, intent, evidence: pdfEvidenceNow, webEvidence: validWebEvidence, history });
    const evidenceById = new Map(allEvidence.map((item) => [item.id, item]));
    const citations = citationValidator.validateCitations(generated.citationIds.map((id) => evidenceById.get(id)).filter(Boolean), allEvidence);

    console.info("[AI] final evidence summary", {
      requestId: id,
      pdfEvidenceCount: pdfEvidenceNow.length,
      webEvidenceCount: validWebEvidence.length,
      finalCitationCount: citations.length,
      citeIds: citations.map((citation) => citation.id),
    });

    const finalText = generated.text || "I could not find sufficient verified evidence to answer this question.";
    const status = citations.length > 0 && !isInsufficientAnswerText(finalText) ? "success" : "insufficient_evidence";

    return {
      requestId: id,
      status,
      intent,
      language: detectedLanguage,
      answer: { text: finalText, language: detectedLanguage },
      evidence: allEvidence,
      citations,
      related: { standards: [], qcos: [], labs: [] },
      actions: [],
    };
  } catch (error) {
    console.warn(`[AI] LLM generation failed for ${id}: ${error.message}`);
    return {
      requestId: id,
      status: "service_unavailable",
      intent,
      language: detectedLanguage,
      answer: { text: "The AI assistant is temporarily unavailable. Please try again later.", language: detectedLanguage },
      evidence: allEvidence,
      citations: [],
      related: { standards: [], qcos: [], labs: [] },
      actions: [],
    };
  }
};

export default { process };
