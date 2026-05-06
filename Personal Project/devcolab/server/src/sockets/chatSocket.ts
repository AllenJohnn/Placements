import { Server as SocketIOServer, Socket } from "socket.io";
import { Message } from "@/models/Message.js";
import { User } from "@/models/User.js";

export function setupChatSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    // Chat: send message
    socket.on("chat:send", async (data: { teamId: string; content: string }) => {
      try {
        const { teamId, content } = data;

        const message = new Message({
          sender: userId,
          teamId,
          content,
          timestamp: new Date(),
        });

        await message.save();

        const populated = await message.populate("sender", "id name email avatar");

        io.to(`team:${teamId}`).emit("chat:receive", {
          id: message._id,
          sender: {
            id: (populated.sender as any)._id,
            name: (populated.sender as any).name,
            email: (populated.sender as any).email,
            avatar: (populated.sender as any).avatar,
          },
          content: message.content,
          timestamp: message.timestamp,
          teamId,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });
  });
}
