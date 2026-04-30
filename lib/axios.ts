import axios from "axios";

const apiBaseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === "undefined" ? process.env.API_BASE_URL || "http://127.0.0.1:8080" : "");

const baseConfig = {
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// 1. 用户端 Axios 实例
const userAxiosClient = axios.create(baseConfig);

userAxiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("user_access_token") || localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

userAxiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_access_token");
        localStorage.removeItem("accessToken");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// 2. 管理端 Axios 实例
export const adminAxiosClient = axios.create(baseConfig);

adminAxiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_access_token") || localStorage.getItem("adminAccessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

adminAxiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("adminAccessToken");
        if (window.location.pathname !== "/admins/login") {
          window.location.href = "/admins/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default userAxiosClient;
