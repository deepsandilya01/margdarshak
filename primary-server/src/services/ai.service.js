import axios from "axios";
import crypto from "crypto";
import env from "../config/env.js";

const AI_TIMEOUT_MS = 20000; // 20 seconds timeout

export const callChatService = async ({ sessionId, message, language = "en", context = {} }) => {
  const requestId = `req-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const targetUrl = `${env.FASTAPI_URL.replace(/\/+$/, "")}/chat`;

  const headers = {
    "Content-Type": "application/json",
  };
  if (env.AI_SERVICE_API_KEY) {
    headers["X-API-Key"] = env.AI_SERVICE_API_KEY;
  }

  try {
    const response = await axios.post(
      targetUrl,
      {
        requestId,
        sessionId,
        message,
        language,
        context: context || {},
      },
      {
        headers,
        timeout: AI_TIMEOUT_MS,
      }
    );

    const data = response.data || {};

    // Normalize response from FastAPI
    return {
      requestId: data.requestId || requestId,
      sessionId: data.sessionId || sessionId,
      status: data.status || "success",
      answer: {
        text: typeof data.answer === "object" ? data.answer.text || "" : data.answer || "",
        language: typeof data.answer === "object" ? data.answer.language || language : language,
      },
      evidence: Array.isArray(data.evidence) ? data.evidence : Array.isArray(data.citations) ? data.citations : [],
      related: {
        standards: Array.isArray(data.related?.standards) ? data.related.standards : [],
        qcos: Array.isArray(data.related?.qcos) ? data.related.qcos : [],
        labs: Array.isArray(data.related?.labs) ? data.related.labs : [],
      },
      actions: Array.isArray(data.actions) ? data.actions : [],
    };
  } catch (error) {
    // Log internal error safely for debugging without throwing unhandled exceptions
    console.warn(`[AI Service Bridge] Request ${requestId} failed: ${error.message}`);

    // Return clean, structured fallback response
    return {
      requestId,
      sessionId,
      status: "service_unavailable",
      message: "AI service is currently unavailable. Please try again.",
      answer: {
        text: "The AI assistant service is currently unavailable. Please try again in a few moments.",
        language,
      },
      evidence: [],
      related: {
        standards: [],
        qcos: [],
        labs: [],
      },
      actions: [],
    };
  }
};

export default {
  callChatService,
};
