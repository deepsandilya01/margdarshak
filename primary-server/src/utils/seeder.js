require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Standard = require("../models/standard.model");
const QCO = require("../models/qco.model");
const Laboratory = require("../models/lab.model");
const Resource = require("../models/resource.model");
const Report = require("../models/report.model");
const ComplianceJourney = require("../models/compliance.model");
const User = require("../models/user.model");

const FRONTEND_DATA_PATH = path.join(__dirname, "../../../frontend-web/src/data");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bis-sathi");
    console.log("Connected to Database for seeding");

    // 1. Create a Seed User for ownership
    let seedUser = await User.findOne({ email: "seeduser@example.com" });
    if (!seedUser) {
      seedUser = await User.create({
        name: "Seed User",
        email: "seeduser@example.com",
        password: "Password@123",
        role: "USER",
        isEmailVerified: true,
      });
      console.log("Seed User created");
    }

    // 2. Load JSON files
    const standardsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "standards/standards.json"), "utf8"));
    const qcosData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "qco/qco.json"), "utf8"));
    const labsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "laboratories/labs.json"), "utf8"));
    const resourcesData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "resources/resources.json"), "utf8"));
    const reportsData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "reports/reports.json"), "utf8"));
    const complianceData = JSON.parse(fs.readFileSync(path.join(FRONTEND_DATA_PATH, "compliance/complianceJourneys.json"), "utf8"));

    // 3. Clear existing global collections (optional, but good for idempotent seeds)
    await Standard.deleteMany({});
    await QCO.deleteMany({});
    await Laboratory.deleteMany({});
    await Resource.deleteMany({});

    // 4. Seed Standards
    const mappedStandards = standardsData.map(s => ({
      ...s,
      originalId: s.id
    }));
    await Standard.insertMany(mappedStandards);
    console.log(`Seeded ${mappedStandards.length} Standards`);

    // 5. Seed QCOs
    const mappedQCOs = qcosData.map(q => ({
      ...q,
      originalId: q.id
    }));
    await QCO.insertMany(mappedQCOs);
    console.log(`Seeded ${mappedQCOs.length} QCOs`);

    // 6. Seed Labs
    const mappedLabs = labsData.map(l => ({
      ...l,
      originalId: l.id
    }));
    await Laboratory.insertMany(mappedLabs);
    console.log(`Seeded ${mappedLabs.length} Labs`);

    // 7. Seed Resources
    const mappedResources = resourcesData.map(r => ({
      ...r,
      originalId: r.id
    }));
    await Resource.insertMany(mappedResources);
    console.log(`Seeded ${mappedResources.length} Resources`);

    // 8. Seed Reports & Compliance (delete only seed user's old data to be safe)
    await Report.deleteMany({ userId: seedUser._id });
    await ComplianceJourney.deleteMany({ userId: seedUser._id });

    const mappedReports = reportsData.map(r => ({
      ...r,
      originalId: r.id,
      userId: seedUser._id
    }));
    await Report.insertMany(mappedReports);
    console.log(`Seeded ${mappedReports.length} Reports`);

    const mappedCompliance = complianceData.map(c => ({
      ...c,
      originalId: c.id,
      userId: seedUser._id
    }));
    await ComplianceJourney.insertMany(mappedCompliance);
    console.log(`Seeded ${mappedCompliance.length} Compliance Journeys`);

    console.log("Database Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
