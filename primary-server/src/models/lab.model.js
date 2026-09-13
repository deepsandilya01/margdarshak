const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    originalId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    type: { type: String, index: true },
    status: { type: String },
    rating: { type: Number },
    reviewCount: { type: Number },
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    location: {
      address: { type: String },
      city: { type: String, index: true },
      state: { type: String, index: true },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    capabilities: [{ type: String }],
    testingStandards: [{ type: String, index: true }], // Standard originalId references
    accreditations: [
      {
        body: { type: String },
        certificateNo: { type: String },
        validUntil: { type: Date },
      },
    ],
    pricing: {
      baseRate: { type: Number },
      currency: { type: String, default: "INR" },
    },
    leadTimeDays: { type: Number },
  },
  { timestamps: true }
);

labSchema.index({ name: "text", "location.city": "text", "location.state": "text", capabilities: "text" });

const Laboratory = mongoose.model("Laboratory", labSchema);

module.exports = Laboratory;
