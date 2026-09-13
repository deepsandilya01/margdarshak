const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying a specific user's sessions sorted by newest updated
sessionSchema.index({ userId: 1, updatedAt: -1 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
