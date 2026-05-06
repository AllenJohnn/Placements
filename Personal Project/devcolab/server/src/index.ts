import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "@/config/env.js";
import { connectDB } from "@/config/db.js";
import { authMiddleware } from "@/middleware/authMiddleware.js";
import { errorMiddleware } from "@/middleware/errorMiddleware.js";
import authRoutes from "@/routes/authRoutes.js";
import teamRoutes from "@/routes/teamRoutes.js";
import projectRoutes from "@/routes/projectRoutes.js";
import taskRoutes from "@/routes/taskRoutes.js";
import messageRoutes from "@/routes/messageRoutes.js";
import { setupSocketAuth, setupSocketHandlers } from "@/sockets/socketHandler.js";
import { setupChatSocket } from "@/sockets/chatSocket.js";
import { setupTaskSocket } from "@/sockets/taskSocket.js";

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.clientOrigin,
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: "Too many requests, please try again later",
});

// Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/messages", messageRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket setup
setupSocketAuth(io);
setupSocketHandlers(io);
setupChatSocket(io);
setupTaskSocket(io);

// Error middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Start server
async function start() {
  try {
    await connectDB();
    httpServer.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Socket.io ready on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

export default app;
