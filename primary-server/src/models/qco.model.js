import mongoose from "mongoose";

const qcoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, index: true },
    title: { type: String, required: true, index: true },
    standardIds: { type: [String], default: [] },
    coveredStandards: { type: [String], default: [] },
    status: { type: String, index: true },
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("Qco", qcoSchema);
