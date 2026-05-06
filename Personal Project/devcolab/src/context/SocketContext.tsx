import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { tokenManager } from "@/utils/tokenManager";

interface SocketCtx {
  socket: Socket | null;
  connected: boolean;
}

const Ctx = createContext<SocketCtx>({} as SocketCtx);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      setConnected(true);
      console.log("✓ Socket connected");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      console.log("✗ Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Ctx.Provider value={{ socket, connected }}>
      {children}
    </Ctx.Provider>
  );
};

export const useSocket = () => useContext(Ctx);
