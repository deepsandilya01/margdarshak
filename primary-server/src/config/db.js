import mongoose from "mongoose";
import env from "./env.js";

const { MONGODB_URI, NODE_ENV } = env;

export async function connectDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    if (NODE_ENV !== "test") {
      console.log("MongoDB connected");
    }

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
