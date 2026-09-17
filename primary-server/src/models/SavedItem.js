import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, "Item type is required"],
      enum: ["standard", "qco", "lab", "answer", "source", "resource"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    referenceId: {
      type: String,
      required: [true, "Reference ID is required"],
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sourceUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent saving the exact same reference of the same type twice for the same user
savedItemSchema.index({ userId: 1, referenceId: 1, type: 1 }, { unique: true });

export const SavedItem = mongoose.model("SavedItem", savedItemSchema);
export default SavedItem;
