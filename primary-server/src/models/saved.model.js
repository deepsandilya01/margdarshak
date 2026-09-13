const mongoose = require("mongoose");

const savedItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    entityId: { type: String, required: true }, // Not an ObjectId since original mock data uses strings
    entityType: {
      type: String,
      enum: ["standard", "qco", "lab", "product", "resource"],
      required: true,
    },
    label: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

// Ensure a user can only save the same entity once
savedItemSchema.index({ userId: 1, entityId: 1, entityType: 1 }, { unique: true });

const SavedItem = mongoose.model("SavedItem", savedItemSchema);

module.exports = SavedItem;
