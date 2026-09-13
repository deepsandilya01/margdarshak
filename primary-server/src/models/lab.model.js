import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    city: { type: String, index: true },
    state: { type: String, index: true },
    standardsCovered: { type: [String], default: [] },
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("Laboratory", labSchema);
