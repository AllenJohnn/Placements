import { Server as SocketIOServer, Socket } from "socket.io";
import { Task } from "@/models/Task.js";

export function setupTaskSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    // Task: task moved (drag-drop)
    socket.on(
      "task:moved",
      async (data: { taskId: string; newStatus: string; newOrder: number; projectId: string }) => {
        try {
          const { taskId, newStatus, newOrder, projectId } = data;

          const task = await Task.findByIdAndUpdate(
            taskId,
            { status: newStatus, order: newOrder, updatedAt: new Date() },
            { new: true }
          )
            .populate("assignedTo", "id name email avatar")
            .populate("createdBy", "id name");

          io.to(`project:${projectId}`).emit("task:updated", {
            task: task?.toObject(),
          });
        } catch (error) {
          socket.emit("error", { message: "Failed to move task" });
        }
      }
    );

    // Task: new task created
    socket.on("task:created", async (data: { task: any; projectId: string }) => {
      try {
        const { task, projectId } = data;
        io.to(`project:${projectId}`).emit("task:new", { task });
      } catch (error) {
        socket.emit("error", { message: "Failed to create task" });
      }
    });

    // Task: task deleted
    socket.on("task:deleted", async (data: { taskId: string; projectId: string }) => {
      try {
        const { taskId, projectId } = data;
        io.to(`project:${projectId}`).emit("task:removed", { taskId });
      } catch (error) {
        socket.emit("error", { message: "Failed to delete task" });
      }
    });
  });
}
