import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import env from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`Primary server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
