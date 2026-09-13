import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: { type: String, required: true, index: true },
    itemType: { type: String, default: "standard" },
  },
  { timestamps: true },
);

savedSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model("SavedItem", savedSchema);
