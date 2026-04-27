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
        return data.message;
      }
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "请求失败，请稍后重试";
}

export function pickNumber(value: string | number | boolean | null | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function pickString(value: string | number | boolean | null | undefined): string {
  if (typeof value === "string") return value || "-";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "-";
}
