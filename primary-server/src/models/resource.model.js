const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    originalId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String },
    type: { type: String, index: true }, // e.g., 'guideline', 'manual', 'form'
    category: { type: String, index: true },
    url: { type: String },
    downloadUrl: { type: String },
    fileSize: { type: String },
    publishDate: { type: Date },
    language: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", description: "text", category: "text" });

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
