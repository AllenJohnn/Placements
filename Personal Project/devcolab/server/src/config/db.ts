import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDB() {
  try {
    if (!config.mongoUri) throw new Error("MONGODB_URI is not set");
    await mongoose.connect(config.mongoUri);
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected");
  } catch (error) {
    console.error("✗ MongoDB disconnection failed:", error);
  }
}

export default mongoose;
