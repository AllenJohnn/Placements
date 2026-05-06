import api from "./api";
import { tokenManager } from "@/utils/tokenManager";

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  message?: string;
}

export const authService = {
  async register(name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
    if (res.data.data?.accessToken) {
      tokenManager.setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.data?.accessToken) {
      tokenManager.setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenManager.clearAccessToken();
    }
  },

  async refresh() {
    const res = await api.post("/auth/refresh");
    if (res.data.data?.accessToken) {
      tokenManager.setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get("/auth/me");
    return res.data.data;
  },
};
