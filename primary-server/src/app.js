const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes import
const authRouter = require("./routes/auth.routes");
const sessionRouter = require("./routes/session.routes");
const chatRouter = require("./routes/chat.routes");
const standardsRouter = require("./routes/standards.routes");
const qcoRouter = require("./routes/qco.routes");
const labsRouter = require("./routes/labs.routes");
const resourcesRouter = require("./routes/resources.routes");
const savedRouter = require("./routes/saved.routes");
const comparisonRouter = require("./routes/comparison.routes");
const reportsRouter = require("./routes/reports.routes");
const complianceRouter = require("./routes/compliance.routes");
const adminRouter = require("./routes/admin.routes");

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sessions", sessionRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/standards", standardsRouter);
app.use("/api/v1/qcos", qcoRouter);
app.use("/api/v1/labs", labsRouter);
app.use("/api/v1/resources", resourcesRouter);
app.use("/api/v1/saved", savedRouter);
app.use("/api/v1/comparison", comparisonRouter);
app.use("/api/v1/reports", reportsRouter);
app.use("/api/v1/compliance", complianceRouter);
app.use("/api/v1/admin", adminRouter);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
