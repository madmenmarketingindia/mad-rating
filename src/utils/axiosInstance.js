// src/lib/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "./axiosConfig";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ✅ Request interceptor to add token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const userData = localStorage?.getItem("user");
    let token = null;

    if (userData) {
      const parsed = JSON.parse(userData);
      token = parsed?.data?.user?.accessToken || null;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Accept"] = "application/json";
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
