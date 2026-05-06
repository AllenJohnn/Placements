import api from "./api";

export const projectService = {
  async createProject(teamId: string, title: string, description?: string) {
    const res = await api.post("/projects", { title, description, teamId });
    return res.data.data;
  },

  async getProjectsByTeam(teamId: string) {
    const res = await api.get(`/projects/team/${teamId}`);
    return res.data.data;
  },

  async getProject(id: string) {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
  },

  async deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
  },
};
