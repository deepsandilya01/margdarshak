import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New Chat",
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ userId: 1, updatedAt: -1 });

export const Session = mongoose.model("Session", sessionSchema);
export default Session;
