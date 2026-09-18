import axios from "axios";
import env from "../../config/env.js";

const pineconeClient = axios.create({ timeout: env.AI_TIMEOUT_MS });

const getBaseUrl = () => {
  if (!env.PINECONE_HOST) throw new Error("PINECONE_HOST is not configured");
  return env.PINECONE_HOST.replace(/\/+$/, "");
};

const headers = () => ({ "Api-Key": env.PINECONE_API_KEY, "Content-Type": "application/json" });

export const upsert = async (vectors) => {
  if (!env.PINECONE_API_KEY) throw new Error("PINECONE_API_KEY is not configured");
  const payload = { namespace: env.PINECONE_NAMESPACE, vectors };
  console.log(JSON.stringify({ provider: "pinecone", endpoint: `${getBaseUrl()}/vectors/upsert`, namespace: env.PINECONE_NAMESPACE, vectorCount: vectors.length, firstVectorDimension: vectors[0]?.values?.length ?? 0 }, null, 2));
  try {
    const response = await pineconeClient.post(`${getBaseUrl()}/vectors/upsert`, payload, { headers: headers() });
    console.log(JSON.stringify({ provider: "pinecone", endpoint: `${getBaseUrl()}/vectors/upsert`, status: response.status, namespace: env.PINECONE_NAMESPACE, upsertedCount: response.data?.upsertedCount ?? 0 }, null, 2));
    return response.data;
  } catch (error) {
    const status = error?.response?.status ?? "unknown";
    const message = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Unknown Pinecone error";
    const body = error?.response?.data ?? {};
    console.error(JSON.stringify({ provider: "pinecone", endpoint: `${getBaseUrl()}/vectors/upsert`, status, message, body, namespace: env.PINECONE_NAMESPACE, vectorCount: vectors.length }, null, 2));
    throw error;
  }
};

export const query = async ({ vector, topK = env.RAG_TOP_K, filter = undefined }) => {
  if (!env.PINECONE_API_KEY) throw new Error("PINECONE_API_KEY is not configured");
  const payload = { namespace: env.PINECONE_NAMESPACE, vector, topK, includeMetadata: true };
  if (filter && Object.keys(filter).length) payload.filter = filter;
  try {
    const response = await pineconeClient.post(`${getBaseUrl()}/query`, payload, { headers: headers() });
    return response.data.matches || [];
  } catch (error) {
    const status = error?.response?.status ?? "unknown";
    const message = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Unknown Pinecone error";
    const body = error?.response?.data ?? {};
    console.error(JSON.stringify({ provider: "pinecone", endpoint: `${getBaseUrl()}/query`, status, message, body, namespace: env.PINECONE_NAMESPACE }, null, 2));
    throw error;
  }
};

export const deleteNamespace = async () => {
  if (!env.PINECONE_API_KEY) throw new Error("PINECONE_API_KEY is not configured");
  return pineconeClient.post(`${getBaseUrl()}/vectors/delete`, { namespace: env.PINECONE_NAMESPACE, deleteAll: true }, { headers: headers() });
};

export default { upsert, query, deleteNamespace };
