import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env in primary-server directory
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/bis-sathi",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    "dev_access_secret_change_in_production_12345",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "dev_refresh_secret_change_in_production_67890",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  MISTRAL_BASE_URL: (process.env.MISTRAL_BASE_URL || "https://api.mistral.ai/v1").replace(/\/+$/, ""),
  MISTRAL_MODEL: process.env.MISTRAL_MODEL || "mistral-small-latest",
  MISTRAL_EMBEDDING_MODEL: process.env.MISTRAL_EMBEDDING_MODEL || "mistral-embed",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  GEMINI_BASE_URL: (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, ""),
  AI_TIMEOUT_MS: Number(process.env.AI_TIMEOUT_MS) || 30000,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || "",
  PINECONE_HOST: process.env.PINECONE_HOST || "",
  PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE || "bis-documents",
  TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",
  TAVILY_SEARCH_DEPTH: process.env.TAVILY_SEARCH_DEPTH || "advanced",
  TAVILY_MAX_RESULTS: Number(process.env.TAVILY_MAX_RESULTS) || 5,
  RAG_TOP_K: Number(process.env.RAG_TOP_K) || 8,
  RAG_MIN_SCORE: Number(process.env.RAG_MIN_SCORE) || 0.72,
  RAG_MIN_EVIDENCE: Number(process.env.RAG_MIN_EVIDENCE) || 2,
  RAG_CONFIDENCE_THRESHOLD: Number(process.env.RAG_CONFIDENCE_THRESHOLD) || 0.78,
  RAG_MIN_COVERAGE: Number(process.env.RAG_MIN_COVERAGE) || 0.25,
  BIS_PDF_DIR: process.env.BIS_PDF_DIR || "./data/bis-pdfs",
  BIS_INGESTION_MANIFEST: process.env.BIS_INGESTION_MANIFEST || "./data/bis-ingestion-manifest.json",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "", 
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/v1/auth/google/callback",
  FRONTEND_AUTH_CALLBACK_URL: process.env.FRONTEND_AUTH_CALLBACK_URL || "http://localhost:5173/auth/callback",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "noreply@bis-sathi.gov.in",
};
export default env;
