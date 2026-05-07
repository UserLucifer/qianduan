import {
  extractApiClientError,
  getApiErrorFallbackMessage,
  getApiErrorMessage,
  translateApiErrorMessage,
} from "@/lib/api-errors";
import { getClientLocale, normalizeLocale, type AppLocale } from "@/i18n/locales";

export function formatEmpty(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

type FormatLocale = AppLocale;

function normalizeFormatLocale(locale: string | null | undefined): FormatLocale {
  return normalizeLocale(locale);
}

function resolveFormatLocale(locale: string | null | undefined): FormatLocale {
  if (locale) return normalizeFormatLocale(locale);
  if (typeof window !== "undefined") return getClientLocale();
  return "zh-CN";
}

export function formatMoney(
  value: number | null | undefined,
  options: { currency?: string; signed?: boolean; locale?: string } = {},
): string {
  const currency = options.currency ?? "USDT";
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const sign = options.signed && amount > 0 ? "+" : "";
  return `${sign}${amount.toLocaleString(resolveFormatLocale(options.locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatNumber(value: number | null | undefined, locale?: string): string {
  if (!Number.isFinite(value)) return "0";
  return Number(value).toLocaleString(resolveFormatLocale(locale));
}

export function formatPercent(value: number | null | undefined, locale?: string): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Number(value).toLocaleString(resolveFormatLocale(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
}

export function formatDateTime(value: string | null | undefined, locale?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(resolveFormatLocale(locale), {
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
  return new Intl.DateTimeFormat(resolveFormatLocale(locale), {
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

export function translateErrorMessage(message: string | null | undefined, locale?: string): string {
  return translateApiErrorMessage(message, resolveFormatLocale(locale));
}

export function toErrorMessage(error: unknown, locale?: string): string {
  const language = resolveFormatLocale(locale);
  const apiError = extractApiClientError(error);
  if (apiError) {
    return translateErrorMessage(getApiErrorMessage({
      code: apiError.code,
      status: apiError.status,
      message: apiError.message,
    }, language), language);
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
        }, language), language);
      }
      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return translateErrorMessage(data.message, language);
      }
    }
  }
  if (error instanceof Error && error.message) return translateErrorMessage(error.message, language);
  return getApiErrorFallbackMessage(language);
}
