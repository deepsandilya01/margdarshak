import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import pdf from "pdf-parse/lib/pdf-parse.js";
import chunker from "./chunker.js";
import embeddingService from "../ai/embeddingService.js";
import vectorStore from "../ai/vectorStore.js";
import env from "../../config/env.js";

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");

const sanitizeMetadataValue = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  return String(value);
};

const safeMetadata = (metadata) => Object.fromEntries(
  Object.entries(metadata)
    .map(([key, value]) => [key, sanitizeMetadataValue(value)])
    .filter(([, value]) => value !== undefined)
);

const formatProviderError = (error) => {
  const status = error?.response?.status ?? "unknown";
  const message = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Unknown provider error";
  const body = error?.response?.data && Object.keys(error.response.data).length ? error.response.data : undefined;
  return { status, message, body };
};

export const ingestDirectory = async (directory = env.BIS_PDF_DIR) => {
  const files = (await fs.readdir(directory)).filter((file) => file.toLowerCase().endsWith(".pdf"));
  let manifest = {};
  try { manifest = JSON.parse(await fs.readFile(env.BIS_INGESTION_MANIFEST, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const report = { processed: 0, skipped: 0, chunks: 0, failed: [] };
  for (const file of files) {
    try {
      const filePath = path.join(directory, file);
      const buffer = await fs.readFile(filePath);
      const contentHash = hash(buffer);
      if (manifest[file] === contentHash) {
        report.skipped += 1;
        continue;
      }
      const documentId = contentHash.slice(0, 24);
      const parsed = await pdf(buffer);
      const chunks = chunker.chunkText(parsed.text);
      const embeddings = await embeddingService.generateEmbeddings(chunks.map((chunk) => chunk.text));
      const vectors = chunks.map((chunk, index) => ({
        id: `${documentId}-${index}`,
        values: embeddings[index],
        metadata: safeMetadata({
          documentId,
          documentName: file,
          documentType: "BIS_PDF",
          standardNumber: file.match(/IS[-_ ]?\d+(?::\d{4})?/i)?.[0] || undefined,
          page: chunk.page,
          section: chunk.section,
          clause: undefined,
          language: "en",
          sourceUrl: undefined,
          text: chunk.text,
          contentHash: hash(chunk.text),
        }),
      }));
      await vectorStore.upsert(vectors);
      manifest[file] = contentHash;
      report.processed += 1;
      report.chunks += vectors.length;
      console.log(`[Ingestion] ${file}: ${vectors.length} chunks upserted`);
    } catch (error) {
      const providerError = formatProviderError(error);
      const failure = { file, provider: error?.response?.status ? "pinecone" : "ingestion", status: providerError.status, message: providerError.message, body: providerError.body };
      report.failed.push(failure);
      console.error(`[Ingestion] ${file} failed: provider=${failure.provider} status=${failure.status} message=${failure.message}`);
      if (providerError.body) console.error(JSON.stringify({ file, provider: failure.provider, body: providerError.body }, null, 2));
    }
  }
  await fs.mkdir(path.dirname(env.BIS_INGESTION_MANIFEST), { recursive: true });
  await fs.writeFile(env.BIS_INGESTION_MANIFEST, JSON.stringify(manifest, null, 2));
  return report;
};

if (process.argv[1]?.endsWith("ingestBis.js")) {
  ingestDirectory(process.argv[2] || env.BIS_PDF_DIR).then((report) => {
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.failed.length ? 1 : 0;
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
