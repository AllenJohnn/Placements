import api from "./api";

export const messageService = {
  async getMessages(teamId: string) {
    const res = await api.get(`/messages/${teamId}`);
    return res.data.data;
  },
};
