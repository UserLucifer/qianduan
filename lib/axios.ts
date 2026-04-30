import axios from "axios";
import { toast } from "sonner";

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
  (response) => {
    const res = response.data;
    // 自动处理业务级报错 (code 非 200 或 0)
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code !== 200 && res.code !== 0 && res.message) {
        toast.error(res.message);
      }
    }
    return res;
  },
  (error) => {
    let errorMessage = "系统繁忙，请稍后再试";
    
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        errorMessage = "登录已过期，请重新登录";
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_access_token");
          localStorage.removeItem("accessToken");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } else if (status === 500) {
        errorMessage = "服务器内部错误";
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      errorMessage = "网络连接超时，请检查网络设置";
    }

    toast.error(errorMessage);
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
  (response) => {
    const res = response.data;
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code !== 200 && res.code !== 0 && res.message) {
        toast.error(res.message);
      }
    }
    return res;
  },
  (error) => {
    let errorMessage = "管理后台系统异常";
    
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        errorMessage = "管理员登录过期";
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("adminAccessToken");
          if (window.location.pathname !== "/admins/login") {
            window.location.href = "/admins/login";
          }
        }
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    }
    
    toast.error(errorMessage);
    return Promise.reject(error);
  },
);

export default userAxiosClient;
