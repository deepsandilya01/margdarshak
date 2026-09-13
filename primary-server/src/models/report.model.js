const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    originalId: { type: String, unique: true, sparse: true }, // For mock imports
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Draft" },
    productContext: { type: String },
    summary: { type: String },
    sections: [sectionSchema],
    metadata: {
      generatedVia: { type: String },
      referenceStandardId: { type: String },
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
