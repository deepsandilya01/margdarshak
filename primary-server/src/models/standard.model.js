import mongoose from "mongoose";

const standardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, index: true },
    title: { type: String, required: true, index: true },
    status: { type: String, index: true },
    year: Number,
    tags: [String],
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("Standard", standardSchema);
