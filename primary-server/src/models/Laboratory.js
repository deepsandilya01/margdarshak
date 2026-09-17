import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  accreditation: { type: String },
  capabilities: [{ type: String }],
  status: { type: String, default: "Active" }
}, { timestamps: true });
export const Laboratory = mongoose.model("Laboratory", schema);