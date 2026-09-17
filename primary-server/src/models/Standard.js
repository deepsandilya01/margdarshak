import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  status: { type: String, enum: ["Active", "Withdrawn", "Under Revision"], default: "Active" },
  evidence: { type: mongoose.Schema.Types.Mixed }, // Phase 24 structured evidence
  metadata: { type: Map, of: String }
}, { timestamps: true });
export const Standard = mongoose.model("Standard", schema);