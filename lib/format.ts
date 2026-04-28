export function formatEmpty(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function formatMoney(
  value: number | null | undefined,
  options: { currency?: string; signed?: boolean } = {},
): string {
  const currency = options.currency ?? "USDT";
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const sign = options.signed && amount > 0 ? "+" : "";
  return `${sign}${amount.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (!Number.isFinite(value)) return "0";
  return Number(value).toLocaleString("zh-CN");
}

export function formatPercent(value: number | null | undefined): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
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

const FALLBACK_ERROR_MESSAGE = "请求失败，请稍后重试";

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

export function translateErrorMessage(message: string | null | undefined): string {
  const trimmed = message?.trim();
  if (!trimmed) return FALLBACK_ERROR_MESSAGE;
  if (/[\u4e00-\u9fa5]/.test(trimmed)) return trimmed;

  const normalized = trimmed.toLowerCase();
  if (ERROR_MESSAGE_MAP[normalized]) return ERROR_MESSAGE_MAP[normalized];

  const statusMatch = normalized.match(/^http error! status: (\d{3})$/);
  if (statusMatch) {
    const status = Number(statusMatch[1]);
    if (status === 400) return "请求参数错误";
    if (status === 401) return "登录已过期，请重新登录";
    if (status === 403) return "无权访问该资源";
    if (status === 404) return "请求的资源不存在";
    if (status >= 500) return "服务器异常，请稍后重试";
    return FALLBACK_ERROR_MESSAGE;
  }

  if (normalized.includes("timeout")) return "请求超时，请稍后重试";
  if (normalized.includes("verification code")) return "验证码错误或已失效";
  if (normalized.includes("password")) return "密码输入有误";
  if (normalized.includes("credential")) return "账号或密码错误";
  if (normalized.includes("unauthorized")) return "登录已过期，请重新登录";
  if (normalized.includes("forbidden")) return "无权访问该资源";
  if (normalized.includes("not found")) return "请求的资源不存在";
  if (normalized.includes("network")) return "网络异常，请检查网络后重试";

  return /[A-Za-z]/.test(trimmed) ? FALLBACK_ERROR_MESSAGE : trimmed;
}

export function toErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return translateErrorMessage(data.message);
      }
    }
  }
  if (error instanceof Error && error.message) return translateErrorMessage(error.message);
  return "请求失败，请稍后重试";
}

