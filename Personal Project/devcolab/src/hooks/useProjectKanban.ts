import { useSocket } from "@/context/SocketContext";

export const useProjectKanban = (projectId: string) => {
  const { socket } = useSocket();

  const joinProject = () => {
    socket?.emit("join:project", projectId);
  };

  const leaveProject = () => {
    socket?.emit("leave:project", projectId);
  };

  const moveTask = (taskId: string, newStatus: string, newOrder: number) => {
    socket?.emit("task:moved", { taskId, newStatus, newOrder, projectId });
  };

  const onTaskUpdated = (callback: (data: any) => void) => {
    socket?.on("task:updated", callback);
    return () => socket?.off("task:updated", callback);
  };

  return { joinProject, leaveProject, moveTask, onTaskUpdated };
};
