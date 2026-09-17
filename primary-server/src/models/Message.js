import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    sourceId: { type: String, default: null },
    title: { type: String, required: true },
    standardNumber: { type: String, default: null },
    authority: { type: String, default: "BIS" },
    sourceUrl: { type: String, default: null },
    page: { type: Number, default: null },
    clause: { type: String, default: null },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "en",
    },
    evidence: {
      type: [evidenceSchema],
      default: [],
    },
    related: {
      standards: { type: [String], default: [] },
      qcos: { type: [String], default: [] },
      labs: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: [
        "success",
        "insufficient_evidence",
        "clarification_required",
        "processing",
        "service_unavailable",
        "error",
      ],
      default: "success",
    },
    requestId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ sessionId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
export default Message;
