import { useSocket } from "@/context/SocketContext";

export const useTeamChat = (teamId: string) => {
  const { socket } = useSocket();

  const joinTeam = () => {
    socket?.emit("join:team", teamId);
  };

  const leaveTeam = () => {
    socket?.emit("leave:team", teamId);
  };

  const sendMessage = (content: string) => {
    socket?.emit("chat:send", { teamId, content });
  };

  return { joinTeam, leaveTeam, sendMessage };
};
