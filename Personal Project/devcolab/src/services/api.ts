import axios, { AxiosInstance } from "axios";
import { tokenManager } from "@/utils/tokenManager";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        tokenManager.setAccessToken(res.data.data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
