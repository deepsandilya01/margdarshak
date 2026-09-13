import mongoose from "mongoose";

const complianceJourneySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    productName: { type: String, required: true, index: true },
    currentStage: { type: String, index: true },
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("ComplianceJourney", complianceJourneySchema);
