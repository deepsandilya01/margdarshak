import dns from "node:dns";
import mongoose from "mongoose";
import env from "./env.js";

// Set reliable public DNS resolvers to ensure MongoDB SRV records resolve smoothly on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Fall back to system DNS if custom resolution is restricted
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do not process.exit(1) abruptly so the server can boot and /health can report status
    return null;
  }
};

export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
