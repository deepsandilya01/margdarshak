import mongoose from "mongoose";
import env from "../src/config/env.js";
import { Standard } from "../src/models/Standard.js";
import { QCO } from "../src/models/QCO.js";
import { Laboratory } from "../src/models/Laboratory.js";

const DEMO_STANDARDS = [
  {
    title: "[DEMO] Specification for Packaged Drinking Water",
    code: "IS 14543:2016",
    description: "This is a synthetic mock record for development testing.",
    category: "Food & Agriculture",
    status: "Active",
    evidence: { source: "Mock Data Seed", reliability: "high" }
  },
  {
    title: "[DEMO] Specification for Portland Cement",
    code: "IS 269:2015",
    description: "This is a synthetic mock record for development testing.",
    category: "Civil Engineering",
    status: "Active",
    evidence: { source: "Mock Data Seed", reliability: "medium" }
  }
];

const DEMO_QCOS = [
  {
    title: "[DEMO] Steel and Steel Products (Quality Control) Order",
    productCategory: "Metallurgical Engineering",
    effectiveDate: new Date("2024-01-01"),
    status: "Active"
  }
];

const DEMO_LABS = [
  {
    name: "[DEMO] National Testing House (NTH)",
    location: "Kolkata, West Bengal",
    accreditation: "NABL Accredited",
    capabilities: ["Chemical Testing", "Mechanical Testing"]
  }
];

async function seedDatabase() {
  try {
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ MongoDB connected.");

    console.log("⚠️ WARNING: Seeding development mock data.");
    
    await Standard.deleteMany({});
    await QCO.deleteMany({});
    await Laboratory.deleteMany({});
    
    await Standard.insertMany(DEMO_STANDARDS);
    await QCO.insertMany(DEMO_QCOS);
    await Laboratory.insertMany(DEMO_LABS);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
