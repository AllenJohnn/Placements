import api from "./api";

export const teamService = {
  async createTeam(name: string) {
    const res = await api.post("/teams", { name });
    return res.data.data;
  },

  async getTeam(id: string) {
    const res = await api.get(`/teams/${id}`);
    return res.data.data;
  },

  async getTeamMembers(id: string) {
    const res = await api.get(`/teams/${id}/members`);
    return res.data.data;
  },

  async joinTeam(inviteCode: string) {
    const res = await api.post("/teams/join", { inviteCode });
    return res.data.data;
  },

  async removeMember(teamId: string, userId: string) {
    const res = await api.delete(`/teams/${teamId}/members/${userId}`);
    return res.data.data;
  },

  async regenerateInvite(id: string) {
    const res = await api.post(`/teams/${id}/regenerate-invite`);
    return res.data.data;
  },

  async deleteTeam(id: string) {
    await api.delete(`/teams/${id}`);
  },
};
