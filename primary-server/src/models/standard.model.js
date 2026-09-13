const mongoose = require("mongoose");

const clauseSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    mandatory: { type: Boolean, required: true },
  },
  { _id: false }
);

const standardSchema = new mongoose.Schema(
  {
    originalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: { type: String, required: true, index: true },
    title: { type: String, required: true },
    shortTitle: { type: String },
    description: { type: String },
    division: { type: String },
    divisionName: { type: String, index: true },
    concordance: { type: String },
    status: { type: String, index: true },
    year: { type: Number },
    accreditedLabs: { type: Number },
    hsCode: { type: String },
    scope: { type: String },
    mandatoryUnder: { type: String },
    ministry: { type: String },
    certificationScheme: { type: String },
    testingProtocols: [{ type: String }],
    clauses: [clauseSchema],
  },
  { timestamps: true }
);

// Full text search index
standardSchema.index({ code: "text", title: "text", shortTitle: "text", divisionName: "text" });

const Standard = mongoose.model("Standard", standardSchema);

module.exports = Standard;
