import mongoose from "mongoose";

const knowledgeDocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true, index: true },
  documentName: { type: String, required: true },
  documentType: { type: String, default: "BIS_PDF" },
  contentHash: { type: String, required: true },
  chunkCount: { type: Number, default: 0 },
  status: { type: String, enum: ["processing", "complete", "failed"], default: "processing" },
  error: { type: String, default: null },
}, { timestamps: true });

export const KnowledgeDocument = mongoose.model("KnowledgeDocument", knowledgeDocumentSchema);
export default KnowledgeDocument;
