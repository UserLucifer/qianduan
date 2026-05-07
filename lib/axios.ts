import axios from "axios";
import { toast } from "sonner";
import {
  createApiClientError,
  getApiErrorMessage,
  isApiResponseLike,
  isSuccessApiCode,
  shouldClearAuthSession,
  translateApiErrorMessage,
} from "@/lib/api-errors";
import { clearUserAuthSession, getUserAccessToken } from "@/lib/auth-session";
import { getClientLocale, localizePathname, stripLocaleFromPathname } from "@/i18n/locales";

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
    if (stripLocaleFromPathname(window.location.pathname) !== "/admins/login") {
      window.location.href = localizePathname("/admins/login", getClientLocale());
    }
    return;
  }

  clearUserAuthSession();
  if (stripLocaleFromPathname(window.location.pathname) !== "/login") {
    window.location.href = localizePathname("/login", getClientLocale());
  }
}

function handleApiResponse(response: { data: unknown; status: number }, scope: ClientScope) {
  const payload = response.data;
  if (!isApiResponseLike(payload) || isSuccessApiCode(payload.code)) {
    return payload;
  }
  const locale = getClientLocale();

  const error = createApiClientError({
    code: payload.code,
    status: response.status,
    message: payload.message,
    data: payload.data,
    response: payload,
    locale,
  });

  if (shouldClearAuthSession(error.code, error.status)) {
    clearAuthSession(scope);
  } else {
    notifyError(error.message);
  }

  return Promise.reject(error);
}

function handleAxiosError(error: unknown, scope: ClientScope, fallbackMessage: string) {
  const locale = getClientLocale();

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
        locale,
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
        ? translateApiErrorMessage("network timeout", locale)
        : getApiErrorMessage({ status, message: fallbackMessage }, locale);
    const apiError = createApiClientError({
      status,
      message,
      data: payload,
      response: payload,
      cause: error,
      locale,
    });

    if (shouldClearAuthSession(apiError.code, apiError.status)) {
      clearAuthSession(scope);
    } else {
      notifyError(apiError.message);
    }

    return Promise.reject(apiError);
  }

  notifyError(translateApiErrorMessage(fallbackMessage, locale));
  return Promise.reject(error);
}

// User-facing Axios instance.
const userAxiosClient = axios.create(baseConfig);

userAxiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      config.headers["Accept-Language"] = getClientLocale();
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
    return handleAxiosError(error, "user", "system busy");
  },
);

// Admin Axios instance.
export const adminAxiosClient = axios.create(baseConfig);

adminAxiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      config.headers["Accept-Language"] = getClientLocale();
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
    return handleAxiosError(error, "admin", "admin system error");
  },
);

export default userAxiosClient;
