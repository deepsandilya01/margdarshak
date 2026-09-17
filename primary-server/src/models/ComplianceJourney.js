import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  productName: { type: String, required: true },
  steps: [{
    title: String,
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    completedAt: Date
  }],
  overallStatus: { type: String, default: "In Progress" }
}, { timestamps: true });
export const ComplianceJourney = mongoose.model("ComplianceJourney", schema);