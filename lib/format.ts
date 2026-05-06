import { extractApiClientError, getApiErrorMessage } from "@/lib/api-errors";

export function formatEmpty(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

type FormatLocale = "zh-CN" | "en-US";

function normalizeFormatLocale(locale: string | null | undefined): FormatLocale {
  return locale === "en-US" ? "en-US" : "zh-CN";
}

export function formatMoney(
  value: number | null | undefined,
  options: { currency?: string; signed?: boolean; locale?: string } = {},
): string {
  const currency = options.currency ?? "USDT";
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const sign = options.signed && amount > 0 ? "+" : "";
  return `${sign}${amount.toLocaleString(normalizeFormatLocale(options.locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatNumber(value: number | null | undefined, locale?: string): string {
  if (!Number.isFinite(value)) return "0";
  return Number(value).toLocaleString(normalizeFormatLocale(locale));
}

export function formatPercent(value: number | null | undefined, locale?: string): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Number(value).toLocaleString(normalizeFormatLocale(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatDateTime(value: string | null | undefined, locale?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(normalizeFormatLocale(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(value: string | null | undefined, locale?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(normalizeFormatLocale(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function maskSecret(value: string | null | undefined, visible = 6): string {
  if (!value) return "-";
  if (value.length <= visible * 2) return `${value.slice(0, 2)}****${value.slice(-2)}`;
  return `${value.slice(0, visible)}****${value.slice(-visible)}`;
}

const FALLBACK_ERROR_MESSAGES: Record<FormatLocale, string> = {
  "zh-CN": "请求失败，请稍后重试",
  "en-US": "Request failed. Please try again later.",
};

const FALLBACK_ERROR_MESSAGE = FALLBACK_ERROR_MESSAGES["zh-CN"];

const ERROR_MESSAGE_MAP: Record<string, string> = {
  "an unknown error occurred": FALLBACK_ERROR_MESSAGE,
  "bad credentials": "账号或密码错误",
  "email already exists": "邮箱已被注册",
  "failed to send code": "验证码发送失败，请稍后重试",
  "failed to send reset code": "重置验证码发送失败，请稍后重试",
  forbidden: "无权访问该资源",
  "invalid credentials": "账号或密码错误",
  "invalid verification code": "验证码错误或已失效",
  "login failed. please check your credentials.": "登录失败，请检查账号或密码",
  "network error": "网络异常，请检查网络后重试",
  "not found": "请求的资源不存在",
  "passwords do not match": "两次输入的密码不一致",
  "registration failed": "注册失败，请稍后重试",
  "request failed": FALLBACK_ERROR_MESSAGE,
  "reset failed": "密码重置失败，请稍后重试",
  "token expired": "登录已过期，请重新登录",
  unauthorized: "登录已过期，请重新登录",
  "user not found": "用户不存在",
};

const ERROR_MESSAGE_MAP_EN: Record<string, string> = {
  "an unknown error occurred": FALLBACK_ERROR_MESSAGES["en-US"],
  "bad credentials": "Incorrect email or password.",
  "email already exists": "This email is already registered.",
  "failed to send code": "We could not send the verification code. Please try again later.",
  "failed to send reset code": "We could not send the reset code. Please try again later.",
  forbidden: "You do not have permission to access this resource.",
  "invalid credentials": "Incorrect email or password.",
  "invalid verification code": "The verification code is incorrect or has expired.",
  "login failed. please check your credentials.": "Incorrect email or password.",
  "network error": "Network error. Check your connection and try again.",
  "not found": "The requested resource was not found.",
  "passwords do not match": "Passwords do not match.",
  "registration failed": "Registration failed. Please try again later.",
  "request failed": FALLBACK_ERROR_MESSAGES["en-US"],
  "reset failed": "Password reset failed. Please try again later.",
  "token expired": "Your session has expired. Please log in again.",
  unauthorized: "Your session has expired. Please log in again.",
  "user not found": "User not found.",
};

const CHINESE_ERROR_MESSAGE_MAP_EN: Record<string, string> = {
  "请求参数错误": "Invalid request. Check the fields and try again.",
  "未登录或登录已过期": "Your session has expired. Please log in again.",
  "登录已过期，请重新登录": "Your session has expired. Please log in again.",
  "无权限访问": "You do not have permission to access this resource.",
  "无权访问该资源": "You do not have permission to access this resource.",
  "资源不存在": "The requested resource was not found.",
  "请求的资源不存在": "The requested resource was not found.",
  "系统异常，请稍后重试": "System error. Please try again later.",
  "邮箱已注册": "This email is already registered.",
  "邮箱已被注册": "This email is already registered.",
  "邮箱未注册": "This email is not registered.",
  "邮箱或密码错误": "Incorrect email or password.",
  "账号或密码错误": "Incorrect email or password.",
  "用户已禁用": "This account has been disabled.",
  "邮箱验证码无效或已过期": "The verification code is incorrect or has expired.",
  "验证码错误或已失效": "The verification code is incorrect or has expired.",
  "邮箱验证码发送过于频繁": "You're requesting codes too often. Please wait and try again.",
  "邮箱验证码尝试次数过多": "Too many verification attempts. Please request a new code later.",
  "邀请码无效": "The invite code is invalid.",
  "用户不存在": "User not found.",
  "请求失败，请稍后重试": FALLBACK_ERROR_MESSAGES["en-US"],
  "网络异常，请检查网络后重试": "Network error. Check your connection and try again.",
  "请求超时，请稍后重试": "The request timed out. Please try again later.",
  "密码输入有误": "The password is invalid.",
  "两次输入的密码不一致": "Passwords do not match.",
  "注册失败，请稍后重试": "Registration failed. Please try again later.",
  "密码重置失败，请稍后重试": "Password reset failed. Please try again later.",
  "验证码发送失败，请稍后重试": "We could not send the verification code. Please try again later.",
  "重置验证码发送失败，请稍后重试": "We could not send the reset code. Please try again later.",
};

export function translateErrorMessage(message: string | null | undefined, locale?: string): string {
  const language = normalizeFormatLocale(locale);
  const trimmed = message?.trim();
  if (!trimmed) return FALLBACK_ERROR_MESSAGES[language];

  if (/[\u4e00-\u9fa5]/.test(trimmed)) {
    return language === "en-US" ? CHINESE_ERROR_MESSAGE_MAP_EN[trimmed] ?? FALLBACK_ERROR_MESSAGES["en-US"] : trimmed;
  }

  const normalized = trimmed.toLowerCase();
  const messageMap = language === "en-US" ? ERROR_MESSAGE_MAP_EN : ERROR_MESSAGE_MAP;
  if (messageMap[normalized]) return messageMap[normalized];

  const statusMatch = normalized.match(/^http error! status: (\d{3})$/);
  if (statusMatch) {
    const status = Number(statusMatch[1]);
    if (language === "en-US") {
      if (status === 400) return "Invalid request. Check the fields and try again.";
      if (status === 401) return "Your session has expired. Please log in again.";
      if (status === 403) return "You do not have permission to access this resource.";
      if (status === 404) return "The requested resource was not found.";
      if (status >= 500) return "Server error. Please try again later.";
      return FALLBACK_ERROR_MESSAGES["en-US"];
    }
    if (status === 400) return "请求参数错误";
    if (status === 401) return "登录已过期，请重新登录";
    if (status === 403) return "无权访问该资源";
    if (status === 404) return "请求的资源不存在";
    if (status >= 500) return "服务器异常，请稍后重试";
    return FALLBACK_ERROR_MESSAGES["zh-CN"];
  }

  if (language === "en-US") {
    if (normalized.includes("timeout")) return "The request timed out. Please try again later.";
    if (normalized.includes("verification code")) return "The verification code is incorrect or has expired.";
    if (normalized.includes("password")) return "The password is invalid.";
    if (normalized.includes("credential")) return "Incorrect email or password.";
    if (normalized.includes("unauthorized")) return "Your session has expired. Please log in again.";
    if (normalized.includes("forbidden")) return "You do not have permission to access this resource.";
    if (normalized.includes("not found")) return "The requested resource was not found.";
    if (normalized.includes("network")) return "Network error. Check your connection and try again.";
  } else {
    if (normalized.includes("timeout")) return "请求超时，请稍后重试";
    if (normalized.includes("verification code")) return "验证码错误或已失效";
    if (normalized.includes("password")) return "密码输入有误";
    if (normalized.includes("credential")) return "账号或密码错误";
    if (normalized.includes("unauthorized")) return "登录已过期，请重新登录";
    if (normalized.includes("forbidden")) return "无权访问该资源";
    if (normalized.includes("not found")) return "请求的资源不存在";
    if (normalized.includes("network")) return "网络异常，请检查网络后重试";
  }

  return /[A-Za-z]/.test(trimmed) ? FALLBACK_ERROR_MESSAGES[language] : trimmed;
}

export function toErrorMessage(error: unknown, locale?: string): string {
  const apiError = extractApiClientError(error);
  if (apiError) {
    return translateErrorMessage(getApiErrorMessage({
      code: apiError.code,
      status: apiError.status,
      message: apiError.message,
    }), locale);
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "code" in data &&
        typeof data.code === "number"
      ) {
        return translateErrorMessage(getApiErrorMessage({
          code: data.code,
          status:
            "status" in response && typeof response.status === "number"
              ? response.status
              : undefined,
          message:
            "message" in data && typeof data.message === "string"
              ? data.message
              : undefined,
        }), locale);
      }
      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return translateErrorMessage(data.message, locale);
      }
    }
  }
  if (error instanceof Error && error.message) return translateErrorMessage(error.message, locale);
  return FALLBACK_ERROR_MESSAGES[normalizeFormatLocale(locale)];
}
