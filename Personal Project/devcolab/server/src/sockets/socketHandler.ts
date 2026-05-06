import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyAccessToken } from "@/utils/generateTokens.js";

export function setupSocketAuth(io: SocketIOServer) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const payload = await verifyAccessToken(token);
      if (!payload) {
        return next(new Error("Invalid token"));
      }

      socket.data.userId = payload.userId;
      next();
    } catch (error) {
      next(error instanceof Error ? error : new Error("Auth failed"));
    }
  });
}

export function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`✓ User ${userId} connected:`, socket.id);

    // Join team room
    socket.on("join:team", (teamId: string) => {
      socket.join(`team:${teamId}`);
      console.log(`User ${userId} joined team ${teamId}`);
    });

    // Leave team room
    socket.on("leave:team", (teamId: string) => {
      socket.leave(`team:${teamId}`);
      console.log(`User ${userId} left team ${teamId}`);
    });

    // Join project room
    socket.on("join:project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${userId} joined project ${projectId}`);
    });

    // Leave project room
    socket.on("leave:project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${userId} left project ${projectId}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`✗ User ${userId} disconnected`);
    });
  });
}
