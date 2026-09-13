const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    id: { type: String },
    status: { type: String },
    source: { type: String },
    document: { type: String },
    section: { type: String },
    revision: { type: String },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String },
    notes: { type: String },
    evidence: [evidenceSchema],
    documents: [documentSchema],
    updatedAt: { type: Date },
  },
  { _id: false }
);

const complianceJourneySchema = new mongoose.Schema(
  {
    originalId: { type: String, unique: true, sparse: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productName: { type: String, required: true },
    currentStage: { type: String, required: true },
    steps: [stepSchema],
  },
  { timestamps: true }
);

const ComplianceJourney = mongoose.model("ComplianceJourney", complianceJourneySchema);

module.exports = ComplianceJourney;
