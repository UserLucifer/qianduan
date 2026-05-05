import axios from "axios";
import { toast } from "sonner";
import {
  createApiClientError,
  getApiErrorMessage,
  isApiResponseLike,
  isSuccessApiCode,
  shouldClearAuthSession,
} from "@/lib/api-errors";
import { clearUserAuthSession, getUserAccessToken } from "@/lib/auth-session";

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

type ClientScope = "user" | "admin";

function notifyError(message: string) {
  if (typeof window !== "undefined") {
    toast.error(message);
  }
}

function clearAuthSession(scope: ClientScope) {
  if (typeof window === "undefined") return;

  if (scope === "admin") {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("adminAccessToken");
    if (window.location.pathname !== "/admins/login") {
      window.location.href = "/admins/login";
    }
    return;
  }

  clearUserAuthSession();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function handleApiResponse(response: { data: unknown; status: number }, scope: ClientScope) {
  const payload = response.data;
  if (!isApiResponseLike(payload) || isSuccessApiCode(payload.code)) {
    return payload;
  }

  const error = createApiClientError({
    code: payload.code,
    status: response.status,
    message: payload.message,
    data: payload.data,
    response: payload,
  });

  if (shouldClearAuthSession(error.code, error.status)) {
    clearAuthSession(scope);
  } else {
    notifyError(error.message);
  }

  return Promise.reject(error);
}

function handleAxiosError(error: unknown, scope: ClientScope, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (isApiResponseLike(payload)) {
      const apiError = createApiClientError({
        code: payload.code,
        status,
        message: payload.message,
        data: payload.data,
        response: payload,
        cause: error,
      });

      if (shouldClearAuthSession(apiError.code, apiError.status)) {
        clearAuthSession(scope);
      } else {
        notifyError(apiError.message);
      }

      return Promise.reject(apiError);
    }

    const message =
      error.request && !error.response
        ? "网络连接超时，请检查网络设置"
        : getApiErrorMessage({ status, message: fallbackMessage });
    const apiError = createApiClientError({
      status,
      message,
      data: payload,
      response: payload,
      cause: error,
    });

    if (shouldClearAuthSession(apiError.code, apiError.status)) {
      clearAuthSession(scope);
    } else {
      notifyError(apiError.message);
    }

    return Promise.reject(apiError);
  }

  notifyError(fallbackMessage);
  return Promise.reject(error);
}

// 1. 用户端 Axios 实例
const userAxiosClient = axios.create(baseConfig);

userAxiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getUserAccessToken();
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
    return handleApiResponse(response, "user") as never;
  },
  (error) => {
    return handleAxiosError(error, "user", "系统繁忙，请稍后再试");
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
    return handleApiResponse(response, "admin") as never;
  },
  (error) => {
    return handleAxiosError(error, "admin", "管理后台系统异常");
  },
);

export default userAxiosClient;
