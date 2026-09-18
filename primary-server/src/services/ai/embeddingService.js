import axios from "axios";
import env from "../../config/env.js";

const embeddingClient = axios.create({
  baseURL: env.MISTRAL_BASE_URL,
  timeout: env.AI_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

const assertConfigured = () => {
  if (!env.MISTRAL_API_KEY) throw new Error("MISTRAL_API_KEY is not configured");
};

const logSafeRequest = (label, details) => {
  console.log(JSON.stringify({ label, ...details }));
};

export const generateEmbedding = async (text) => {
  assertConfigured();
  logSafeRequest("MISTRAL_EMBEDDING_REQUEST", {
    endpoint: "/embeddings",
    model: env.MISTRAL_EMBEDDING_MODEL,
    inputLength: typeof text === "string" ? text.length : Array.isArray(text) ? text.length : 0,
  });
  try {
    const response = await embeddingClient.post(
      "/embeddings",
      { model: env.MISTRAL_EMBEDDING_MODEL, input: text },
      { headers: { Authorization: `Bearer ${env.MISTRAL_API_KEY}` } }
    );
    logSafeRequest("MISTRAL_EMBEDDING_RESPONSE", {
      status: response.status,
      model: env.MISTRAL_EMBEDDING_MODEL,
      outputCount: response.data?.data?.length ?? 0,
      embeddingDimension: response.data?.data?.[0]?.embedding?.length ?? 0,
    });
    return response.data.data?.[0]?.embedding || [];
  } catch (error) {
    const status = error?.response?.status ?? "unknown";
    const message = error?.response?.data?.error?.message || error?.message || "Unknown Mistral error";
    const body = error?.response?.data ?? {};
    console.error(JSON.stringify({ provider: "mistral", endpoint: "/embeddings", status, message, body }, null, 2));
    throw error;
  }
};

export const generateEmbeddings = async (texts) => {
  assertConfigured();
  if (!texts.length) return [];
  logSafeRequest("MISTRAL_EMBEDDINGS_REQUEST", {
    endpoint: "/embeddings",
    model: env.MISTRAL_EMBEDDING_MODEL,
    inputCount: texts.length,
    inputLengthTotal: texts.reduce((sum, item) => sum + (typeof item === "string" ? item.length : 0), 0),
  });
  try {
    const response = await embeddingClient.post(
      "/embeddings",
      { model: env.MISTRAL_EMBEDDING_MODEL, input: texts },
      { headers: { Authorization: `Bearer ${env.MISTRAL_API_KEY}` } }
    );
    logSafeRequest("MISTRAL_EMBEDDINGS_RESPONSE", {
      status: response.status,
      model: env.MISTRAL_EMBEDDING_MODEL,
      outputCount: response.data?.data?.length ?? 0,
      embeddingDimension: response.data?.data?.[0]?.embedding?.length ?? 0,
    });
    return (response.data.data || []).sort((a, b) => a.index - b.index).map((item) => item.embedding);
  } catch (error) {
    const status = error?.response?.status ?? "unknown";
    const message = error?.response?.data?.error?.message || error?.message || "Unknown Mistral error";
    const body = error?.response?.data ?? {};
    console.error(JSON.stringify({ provider: "mistral", endpoint: "/embeddings", status, message, body }, null, 2));
    throw error;
  }
};

export const getEmbeddingModel = () => env.MISTRAL_EMBEDDING_MODEL;

export default { generateEmbedding, generateEmbeddings, getEmbeddingModel };
