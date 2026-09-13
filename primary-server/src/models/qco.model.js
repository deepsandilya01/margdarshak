const mongoose = require("mongoose");

const qcoSchema = new mongoose.Schema(
  {
    originalId: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, index: true },
    title: { type: String, required: true },
    shortTitle: { type: String },
    ministry: { type: String },
    ministry_short: { type: String },
    gazetteRef: { type: String },
    gazetteVolume: { type: String },
    effectiveDate: { type: Date },
    notificationDate: { type: Date },
    status: { type: String, index: true },
    coveredStandards: [{ type: String, index: true }], // References Standard.originalId
    coveredStandardCodes: [{ type: String }],
    hsNPCodes: [{ type: String }],
    penaltyProvisions: { type: String },
    applicability: { type: String },
    exemptions: [{ type: String }],
    testingRequirements: { type: String },
    certificationPath: { type: String },
    description: { type: String },
    summary: { type: String },
    tags: [{ type: String }],
    evidence: {
      status: { type: String },
      source: { type: String },
      document: { type: String },
      section: { type: String },
      revision: { type: String },
    },
  },
  { timestamps: true }
);

qcoSchema.index({ code: "text", title: "text", shortTitle: "text", summary: "text" });

const QCO = mongoose.model("QCO", qcoSchema);

module.exports = QCO;
