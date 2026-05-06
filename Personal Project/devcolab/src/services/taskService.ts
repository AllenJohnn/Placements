import api from "./api";

export const taskService = {
  async createTask(projectId: string, title: string, description?: string, assignedTo?: string, deadline?: string) {
    const res = await api.post("/tasks", {
      title,
      description,
      assignedTo,
      deadline,
      projectId,
    });
    return res.data.data;
  },

  async getTasksByProject(projectId: string) {
    const res = await api.get(`/tasks/project/${projectId}`);
    return res.data.data;
  },

  async updateTask(id: string, updates: any) {
    const res = await api.patch(`/tasks/${id}`, updates);
    return res.data.data;
  },

  async reorderTask(id: string, newStatus: string, newOrder: number) {
    const res = await api.patch(`/tasks/${id}/reorder`, { newStatus, newOrder });
    return res.data.data;
  },

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  },
};
