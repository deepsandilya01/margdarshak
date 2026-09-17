import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import { isDatabaseConnected } from "./config/db.js";
import redisService from "./services/redis.service.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./utils/AppError.js";
import { generalLimiter } from "./middleware/rateLimit.middleware.js";
import passport from "passport";
import "./config/passport.js";

// Import modular routes
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import savedRoutes from "./routes/saved.routes.js";
import standardsRoutes from "./routes/standards.routes.js";
import qcosRoutes from "./routes/qcos.routes.js";
import labsRoutes from "./routes/labs.routes.js";
import resourcesRoutes from "./routes/resources.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import complianceRoutes from "./routes/compliance.routes.js";
import comparisonRoutes from "./routes/comparison.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Strict CORS Configuration
const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Rate Limiting
app.use(generalLimiter);

// 4. Body Parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 5. Authentication Setup
app.use(passport.initialize());

// 6. Health Check Endpoints
const healthHandler = (req, res) => {
  const dbConnected = isDatabaseConnected();
  const redisConnected = redisService.isRedisReady();
  
  // App is considered degraded if either DB or Redis is down, but Redis might be considered critical for Auth
  const status = (dbConnected && redisConnected) ? "ok" : "degraded";

  return res.status(dbConnected ? 200 : 503).json({
    status,
    services: {
      database: dbConnected ? "ok" : "disconnected",
      redis: redisConnected ? "ok" : "disconnected",
    },
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", healthHandler);
app.get("/api/v1/health", healthHandler);

// 6. Mount Prototype MVP API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/saved", savedRoutes);

// Catalog Routes
app.use("/api/v1/standards", standardsRoutes);
app.use("/api/v1/qcos", qcosRoutes);
app.use("/api/v1/labs", labsRoutes);
app.use("/api/v1/resources", resourcesRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/compliance-journeys", complianceRoutes);
app.use("/api/v1/comparison", comparisonRoutes);
app.use("/api/v1/admin", adminRoutes);

// 7. Handle Unmatched 404 Routes
app.all("*", (req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`, "ROUTE_NOT_FOUND"));
});

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;
