const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../src/models');
const controllersDir = path.join(__dirname, '../src/controllers');
const routesDir = path.join(__dirname, '../src/routes');

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

const models = {
  Standard: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  status: { type: String, enum: ["Active", "Withdrawn", "Under Revision"], default: "Active" },
  evidence: { type: mongoose.Schema.Types.Mixed }, // Phase 24 structured evidence
  metadata: { type: Map, of: String }
}, { timestamps: true });
export const Standard = mongoose.model("Standard", schema);`,

  QCO: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  productCategory: { type: String, required: true },
  effectiveDate: { type: Date },
  status: { type: String, default: "Active" },
  metadata: { type: Map, of: String }
}, { timestamps: true });
export const QCO = mongoose.model("QCO", schema);`,

  Laboratory: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  accreditation: { type: String },
  capabilities: [{ type: String }],
  status: { type: String, default: "Active" }
}, { timestamps: true });
export const Laboratory = mongoose.model("Laboratory", schema);`,

  Resource: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });
export const Resource = mongoose.model("Resource", schema);`,

  Report: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });
export const Report = mongoose.model("Report", schema);`,

  ComplianceJourney: `import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  productName: { type: String, required: true },
  steps: [{
    title: String,
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    completedAt: Date
  }],
  overallStatus: { type: String, default: "In Progress" }
}, { timestamps: true });
export const ComplianceJourney = mongoose.model("ComplianceJourney", schema);`
};

Object.entries(models).forEach(([name, code]) => {
  fs.writeFileSync(path.join(modelsDir, `${name}.js`), code);
});

// Generic Catalog Controller
const genericController = `import { Standard } from "../models/Standard.js";
import { QCO } from "../models/QCO.js";
import { Laboratory } from "../models/Laboratory.js";
import { Resource } from "../models/Resource.js";
import { Report } from "../models/Report.js";
import { ComplianceJourney } from "../models/ComplianceJourney.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getModel = (type) => {
  switch (type) {
    case 'standards': return Standard;
    case 'qcos': return QCO;
    case 'labs': return Laboratory;
    case 'resources': return Resource;
    case 'reports': return Report;
    case 'compliance-journeys': return ComplianceJourney;
    default: throw new AppError(400, "Invalid resource type", "INVALID_TYPE");
  }
};

export const listResources = (type) => asyncHandler(async (req, res) => {
  const Model = getModel(type);
  const filter = {};
  
  // Enforce ownership for user-specific resources
  if (['reports', 'compliance-journeys'].includes(type)) {
    if (!req.user) throw new AppError(401, "Authentication required", "UNAUTHORIZED");
    filter.userId = req.user.id;
  }

  // Basic search
  if (req.query.q) {
    filter.title = { $regex: req.query.q, $options: 'i' };
  }

  const items = await Model.find(filter).limit(50).lean();
  res.status(200).json({ success: true, data: items });
});

export const getResource = (type) => asyncHandler(async (req, res) => {
  const Model = getModel(type);
  const filter = { _id: req.params.id };

  if (['reports', 'compliance-journeys'].includes(type)) {
    if (!req.user) throw new AppError(401, "Authentication required", "UNAUTHORIZED");
    filter.userId = req.user.id;
  }

  const item = await Model.findOne(filter).lean();
  if (!item) throw new AppError(404, \`\${type} not found\`, "NOT_FOUND");
  
  res.status(200).json({ success: true, data: item });
});

export const compareStandards = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    throw new AppError(400, "Provide at least two standard IDs for comparison", "INVALID_INPUT");
  }
  const items = await Standard.find({ _id: { $in: ids } }).lean();
  res.status(200).json({ success: true, data: items });
});
`;
fs.writeFileSync(path.join(controllersDir, 'catalog.controller.js'), genericController);

// Admin Controller
const adminController = `import { User } from "../models/User.js";
import { Standard } from "../models/Standard.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -__v').limit(50).lean();
  res.status(200).json({ success: true, data: users });
});

export const createStandard = asyncHandler(async (req, res) => {
  const standard = await Standard.create(req.body);
  res.status(201).json({ success: true, data: standard });
});

export const updateStandard = asyncHandler(async (req, res) => {
  const standard = await Standard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!standard) throw new AppError(404, "Standard not found", "NOT_FOUND");
  res.status(200).json({ success: true, data: standard });
});
`;
fs.writeFileSync(path.join(controllersDir, 'admin.controller.js'), adminController);

// Routes
const routeTemplate = (type, hasAuth) => `import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";
${hasAuth ? 'import { protect } from "../middleware/auth.middleware.js";' : ''}

const router = Router();
${hasAuth ? 'router.use(protect);' : ''}

router.get("/", listResources('${type}'));
router.get("/:id", getResource('${type}'));

export default router;
`;

fs.writeFileSync(path.join(routesDir, 'standards.routes.js'), routeTemplate('standards', false));
fs.writeFileSync(path.join(routesDir, 'qcos.routes.js'), routeTemplate('qcos', false));
fs.writeFileSync(path.join(routesDir, 'labs.routes.js'), routeTemplate('labs', false));
fs.writeFileSync(path.join(routesDir, 'resources.routes.js'), routeTemplate('resources', false));
fs.writeFileSync(path.join(routesDir, 'reports.routes.js'), routeTemplate('reports', true));
fs.writeFileSync(path.join(routesDir, 'compliance.routes.js'), routeTemplate('compliance-journeys', true));

// Comparison route
fs.writeFileSync(path.join(routesDir, 'comparison.routes.js'), `import { Router } from "express";
import { compareStandards } from "../controllers/catalog.controller.js";
const router = Router();
router.post("/", compareStandards);
export default router;`);

// Admin route
fs.writeFileSync(path.join(routesDir, 'admin.routes.js'), `import { Router } from "express";
import { listUsers, createStandard, updateStandard } from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);
router.use(restrictTo('admin'));

router.get("/users", listUsers);
router.post("/standards", createStandard);
router.put("/standards/:id", updateStandard);

export default router;`);

console.log("Boilerplate generated successfully!");
