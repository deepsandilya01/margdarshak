import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  productCategory: { type: String, required: true },
  effectiveDate: { type: Date },
  status: { type: String, default: "Active" },
  metadata: { type: Map, of: String }
}, { timestamps: true });
export const QCO = mongoose.model("QCO", schema);