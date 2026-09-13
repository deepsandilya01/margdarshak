const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
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
    status: {
      type: String,
      enum: ["success", "insufficient_evidence", "error", "processing"],
    },
    intent: {
      type: String,
    },
    citations: {
      type: Array,
      default: [],
    },
    requestId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficiently fetching messages of a specific session sorted by time
messageSchema.index({ sessionId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
