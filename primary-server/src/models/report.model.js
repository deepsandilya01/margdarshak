import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, index: true },
    type: { type: String, index: true },
    status: { type: String, index: true },
    date: Date,
  },
  { strict: false, timestamps: true },
);

export default mongoose.model("Report", reportSchema);
