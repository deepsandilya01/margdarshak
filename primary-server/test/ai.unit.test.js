import test from "node:test";
import assert from "node:assert/strict";
import languageDetector from "../src/services/ai/languageDetector.js";
import intentDetector from "../src/services/ai/intentDetector.js";
import evidenceEvaluator from "../src/services/ai/evidenceEvaluator.js";
import chunker from "../src/services/ingestion/chunker.js";
import env from "../src/config/env.js";
import aiOrchestrator from "../src/services/ai/aiOrchestrator.js";
import ragService from "../src/services/ai/ragService.js";
import tavilyService from "../src/services/ai/tavilyService.js";
import llmService from "../src/services/ai/llmService.js";

const originalRagRetrieve = ragService.retrieve;
const originalTavilySearch = tavilyService.search;
const originalGenerateAnswer = llmService.generateAnswer;

const restoreServices = () => {
  ragService.retrieve = originalRagRetrieve;
  tavilyService.search = originalTavilySearch;
  llmService.generateAnswer = originalGenerateAnswer;
};

test("detects English, Hindi, and Hinglish queries", () => {
  assert.equal(languageDetector("What is IS 1293?", "auto"), "en");
  assert.equal(languageDetector("IS 1293 क्या है?", "auto"), "hi");
  assert.equal(languageDetector("BIS certification ka process kya hai?", "auto"), "hinglish");
});

test("classifies BIS intent", () => {
  assert.equal(intentDetector("What are the requirements of IS 1293?"), "standard_research");
  assert.equal(intentDetector("What is the QCO for this product?"), "qco_information");
});

test("requires score, evidence count, and query coverage", () => {
  const previous = { minScore: env.RAG_MIN_SCORE, minEvidence: env.RAG_MIN_EVIDENCE, threshold: env.RAG_CONFIDENCE_THRESHOLD, coverage: env.RAG_MIN_COVERAGE };
  env.RAG_MIN_SCORE = 0.5;
  env.RAG_MIN_EVIDENCE = 2;
  env.RAG_CONFIDENCE_THRESHOLD = 0.5;
  env.RAG_MIN_COVERAGE = 0.25;
  const result = evidenceEvaluator.evaluate([
    { id: "a", score: 0.9, metadata: { text: "IS 1293 cement requirements testing" } },
    { id: "b", score: 0.8, metadata: { text: "IS 1293 marking requirements" } },
  ], "IS 1293 requirements");
  assert.equal(result.sufficient, true);
  Object.assign(env, { RAG_MIN_SCORE: previous.minScore, RAG_MIN_EVIDENCE: previous.minEvidence, RAG_CONFIDENCE_THRESHOLD: previous.threshold, RAG_MIN_COVERAGE: previous.coverage });
});

test("chunks preserve page boundaries", () => {
  const chunks = chunker.chunkText("page one text\fpage two text");
  assert.deepEqual(chunks.map((chunk) => chunk.page), [1, 2]);
});

test("TEST A: BIS PDF evidence answers the query without Tavily", async () => {
  let tavilyCalled = false;
  ragService.retrieve = async () => ({
    sufficient: true,
    score: 0.93,
    coverage: 0.8,
    evidence: [{ id: "pdf-1", title: "IS 1293", page: 4, text: "BIS requires the product to be tested before certification.", sourceType: "standard", url: "https://example.com/pdf-1" }],
  });
  tavilyService.search = async () => {
    tavilyCalled = true;
    return [{ id: "web-1", title: "Unofficial article", url: "https://example.com/unofficial", sourceType: "web", content: "not needed", verified: false }];
  };
  llmService.generateAnswer = async ({ evidence }) => ({
    text: `Based on BIS PDF evidence: ${evidence[0].text}`,
    citationIds: ["pdf-1"],
  });

  const result = await aiOrchestrator.process({ message: "What are BIS requirements for this product?", language: "en", history: [] });

  assert.equal(result.status, "success");
  assert.equal(tavilyCalled, false);
  assert.equal(result.answer.text.includes("Based on BIS PDF evidence"), true);
  restoreServices();
});

test("TEST B: weak PDF falls back to official web evidence", async () => {
  let tavilyCalled = false;
  ragService.retrieve = async () => ({
    sufficient: false,
    score: 0.41,
    coverage: 0.2,
    evidence: [{ id: "pdf-1", title: "Older BIS note", page: 2, text: "Older guidance only.", sourceType: "standard", url: "https://example.com/old" }],
  });
  tavilyService.search = async () => {
    tavilyCalled = true;
    return [{ id: "web-1", title: "Official BIS notice", url: "https://www.bis.gov.in/official-notice/", sourceType: "web", content: "Current BIS notice states the latest requirement.", verified: true }];
  };
  llmService.generateAnswer = async ({ evidence, webEvidence }) => ({
    text: `Latest official guidance: ${webEvidence[0].content}`,
    citationIds: ["web-1"],
  });

  const result = await aiOrchestrator.process({ message: "What is the latest BIS requirement as of 2025?", language: "en", history: [] });

  assert.equal(result.status, "success");
  assert.equal(tavilyCalled, true);
  assert.equal(result.answer.text.includes("Latest official guidance"), true);
  restoreServices();
});

test("TEST C: partial PDF plus web evidence are merged and grounded", async () => {
  let tavilyCalled = false;
  ragService.retrieve = async () => ({
    sufficient: false,
    score: 0.64,
    coverage: 0.45,
    evidence: [{ id: "pdf-1", title: "PDF section", page: 7, text: "The standard mentions acceptance testing.", sourceType: "standard", url: "https://example.com/pdf-1" }],
  });
  tavilyService.search = async () => {
    tavilyCalled = true;
    return [{ id: "web-1", title: "BIS circular", url: "https://www.bis.gov.in/circular/", sourceType: "web", content: "Current circular confirms the lab-testing requirement.", verified: true }];
  };
  llmService.generateAnswer = async ({ evidence, webEvidence }) => ({
    text: `The PDF notes acceptance testing and the current BIS circular confirms the requirement.`,
    citationIds: ["pdf-1", "web-1"],
  });

  const result = await aiOrchestrator.process({ message: "What testing is required for certification?", language: "en", history: [] });

  assert.equal(result.status, "success");
  assert.equal(tavilyCalled, true);
  assert.equal(result.citations.length, 2);
  restoreServices();
});

test("TEST D: no PDF or web evidence means insufficient_evidence", async () => {
  let tavilyCalled = false;
  ragService.retrieve = async () => ({
    sufficient: false,
    score: 0.1,
    coverage: 0.05,
    evidence: [],
  });
  tavilyService.search = async () => {
    tavilyCalled = true;
    return [];
  };
  llmService.generateAnswer = async () => ({ text: "", citationIds: [] });

  const result = await aiOrchestrator.process({ message: "What is the BIS rule for an unknown product?", language: "en", history: [] });

  assert.equal(result.status, "insufficient_evidence");
  assert.equal(tavilyCalled, true);
  assert.equal(result.answer.text.includes("I could not find sufficient verified BIS evidence"), true);
  restoreServices();
});

test("TEST E: Hindi query answers in Hindi from grounded evidence", async () => {
  ragService.retrieve = async () => ({
    sufficient: true,
    score: 0.91,
    coverage: 0.75,
    evidence: [{ id: "pdf-1", title: "BIS standard", page: 6, text: "यह मानक परीक्षण और अंकन की आवश्यकताओं को बताता है।", sourceType: "standard", url: "https://example.com/pdf-1" }],
  });
  tavilyService.search = async () => [];
  llmService.generateAnswer = async ({ evidence }) => ({
    text: `यह मानक परीक्षण और अंकन की आवश्यकताओं के लिए BIS दिशानिर्देश देता है।`,
    citationIds: ["pdf-1"],
  });

  const result = await aiOrchestrator.process({ message: "IS मानक में परीक्षण और अंकन की क्या आवश्यकताएँ हैं?", language: "hi", history: [] });

  assert.equal(result.status, "success");
  assert.equal(result.answer.language, "hi");
  assert.equal(result.answer.text.includes("दिशानिर्देश"), true);
  restoreServices();
});

test("TEST F: Hinglish query answers naturally in Hinglish from grounded evidence", async () => {
  ragService.retrieve = async () => ({
    sufficient: true,
    score: 0.88,
    coverage: 0.72,
    evidence: [{ id: "pdf-1", title: "BIS standard", page: 10, text: "Product ko BIS certification ke liye testing aur marking required hai.", sourceType: "standard", url: "https://example.com/pdf-1" }],
  });
  tavilyService.search = async () => [];
  llmService.generateAnswer = async ({ evidence }) => ({
    text: `Product ko BIS certification ke liye testing aur marking required hai, as per the PDF evidence.`,
    citationIds: ["pdf-1"],
  });

  const result = await aiOrchestrator.process({ message: "BIS certification ke liye product ko kya testing aur marking chahiye?", language: "hinglish", history: [] });

  assert.equal(result.status, "success");
  assert.equal(result.answer.language, "hinglish");
  assert.equal(result.answer.text.includes("testing aur marking"), true);
  restoreServices();
});
