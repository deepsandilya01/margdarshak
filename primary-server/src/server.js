import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { connectRedis, disconnectRedis } from "./services/redis.service.js";

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();
    // Attempt Redis connection
    await connectRedis();

    // Dynamically import Express app AFTER Redis is fully connected
    // This resolves the rateLimit.middleware.js race condition
    const { default: app } = await import("./app.js");
    const { initSocket } = await import("./services/socket.service.js");

    const server = app.listen(env.PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 BIS-SATHI Primary Server running on port: ${env.PORT}`);
      console.log(`🌐 Environment: ${env.NODE_ENV}`);
      console.log(`🩺 Health Check: http://localhost:${env.PORT}/health`);
      console.log(`======================================================\n`);
    });

    // Initialize Socket.io
    initSocket(server);
    console.log(`🔌 Socket.io initialized successfully.`);

    // Graceful Shutdown Handlers
    const shutdown = async (signal) => {
      console.log(`\n[${signal}] Initiating graceful shutdown...`);
      await disconnectRedis();
      server.close(() => {
        console.log("HTTP server closed. Exiting process.");
        process.exit(0);
      });
      // Force close if connections remain open
      setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Fatal startup error:", error);
    process.exit(1);
  }
};

startServer();
