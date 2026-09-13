import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    category: { type: String, index: true },
    publishedDate: Date,
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("Resource", resourceSchema);
