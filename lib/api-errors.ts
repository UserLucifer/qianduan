import { defaultLocale, normalizeLocale, type AppLocale } from "@/i18n/locales";
import apiErrorMessages from "@/lib/api-error-messages.json";

export type ApiErrorKind =
  | "auth"
  | "permission"
  | "validation"
  | "conflict"
  | "rate-limit"
  | "not-found"
  | "system"
  | "business";

export type ApiResponseLike = {
  code: number;
  message?: string;
  data?: unknown;
  timestamp?: string;
};

export type ApiClientErrorOptions = {
  code?: number;
  status?: number;
  message?: string;
  data?: unknown;
  response?: unknown;
  cause?: unknown;
  locale?: string;
};

export class ApiClientError extends Error {
  code?: number;
  status?: number;
  data?: unknown;
  response?: unknown;
  kind: ApiErrorKind;
  isApiClientError = true;

  constructor(options: ApiClientErrorOptions) {
    const message = getApiErrorMessage(options, options.locale);
    super(message);
    this.name = "ApiClientError";
    this.code = options.code;
    this.status = options.status;
    this.data = options.data;
    this.response = options.response;
    this.kind = getApiErrorKind(options.code, options.status);
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export const API_SUCCESS_CODE = 0;
const LEGACY_SUCCESS_CODE = 200;

export const AUTH_EXPIRED_CODES = new Set([401, 20011, 20012, 80004]);

type LocalizedMessage = Record<AppLocale, string>;

const fallbackMessages = apiErrorMessages.fallback as LocalizedMessage;
const codeMessages = apiErrorMessages.codes as Record<string, LocalizedMessage>;
const aliasMessages = apiErrorMessages.aliases as Record<string, LocalizedMessage>;
const keywordAliases = apiErrorMessages.keywordAliases as Array<{ keyword: string; alias: string }>;

const directMessages = Object.values(codeMessages).reduce<Record<string, LocalizedMessage>>((acc, message) => {
  acc[message["zh-CN"]] = message;
  acc[message["en-US"]] = message;
  return acc;
}, {});

Object.values(aliasMessages).forEach((message) => {
  directMessages[message["zh-CN"]] = message;
  directMessages[message["en-US"]] = message;
});

function normalizeApiErrorLocale(locale: string | null | undefined): AppLocale {
  return normalizeLocale(locale);
}

function readLocalizedMessage(message: LocalizedMessage | undefined, locale: AppLocale): string | undefined {
  return message?.[locale] ?? message?.[defaultLocale];
}

export const API_ERROR_MESSAGES: Record<number, string> = Object.fromEntries(
  Object.entries(codeMessages).map(([code, message]) => [Number(code), readLocalizedMessage(message, defaultLocale) ?? ""]),
) as Record<number, string>;

export function getApiErrorFallbackMessage(locale?: string | null): string {
  return readLocalizedMessage(fallbackMessages, normalizeApiErrorLocale(locale)) ?? fallbackMessages[defaultLocale];
}

export function translateApiErrorMessage(message: string | null | undefined, locale?: string | null): string {
  const language = normalizeApiErrorLocale(locale);
  const trimmed = message?.trim();
  if (!trimmed) return getApiErrorFallbackMessage(language);

  const exactMessage = directMessages[trimmed];
  const exactTranslation = readLocalizedMessage(exactMessage, language);
  if (exactTranslation) return exactTranslation;

  const normalized = trimmed.toLowerCase();
  const aliasTranslation = readLocalizedMessage(aliasMessages[normalized], language);
  if (aliasTranslation) return aliasTranslation;

  const statusMatch = normalized.match(/^http error! status: (\d{3})$/);
  if (statusMatch) {
    return readLocalizedMessage(codeMessages[statusMatch[1]], language) ?? getApiErrorFallbackMessage(language);
  }

  const keywordAlias = keywordAliases.find(({ keyword }) => normalized.includes(keyword));
  if (keywordAlias) {
    return readLocalizedMessage(aliasMessages[keywordAlias.alias], language) ?? getApiErrorFallbackMessage(language);
  }

  if (/[\u4e00-\u9fff]/.test(trimmed) && language !== defaultLocale) {
    return getApiErrorFallbackMessage(language);
  }

  return /[A-Za-z]/.test(trimmed) ? getApiErrorFallbackMessage(language) : trimmed;
}

export function isApiResponseLike(value: unknown): value is ApiResponseLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as { code: unknown }).code === "number"
  );
}

export function isSuccessApiCode(code: number | undefined): boolean {
  return code === API_SUCCESS_CODE || code === LEGACY_SUCCESS_CODE;
}

export function getApiErrorKind(
  code: number | undefined,
  status: number | undefined,
): ApiErrorKind {
  if (status === 401 || AUTH_EXPIRED_CODES.has(code ?? -1)) return "auth";
  if (status === 403 || code === 403 || code === 20004 || code === 80002 || code === 80005) {
    return "permission";
  }
  if (status === 422 || code === 422) return "validation";
  if (status === 409 || code === 10002 || code === 11004 || code === 11006) return "conflict";
  if (status === 429 || code === 10003 || code === 20006 || code === 20007) return "rate-limit";
  if (status === 404 || code === 404) return "not-found";
  if ((status && status >= 500) || (code && [20008, 20009, 41202, 41203, 80010].includes(code))) {
    return "system";
  }
  if (code && [40007, 60015, 70010].includes(code)) return "conflict";
  return "business";
}

export function getApiErrorMessage(options: {
  code?: number;
  status?: number;
  message?: string;
}, locale?: string | null): string {
  const language = normalizeApiErrorLocale(locale);
  if (options.code && codeMessages[String(options.code)]) {
    return readLocalizedMessage(codeMessages[String(options.code)], language) ?? getApiErrorFallbackMessage(language);
  }
  if (options.status && codeMessages[String(options.status)]) {
    return readLocalizedMessage(codeMessages[String(options.status)], language) ?? getApiErrorFallbackMessage(language);
  }
  if (options.message?.trim()) {
    return translateApiErrorMessage(options.message, language);
  }
  if (options.status && options.status >= 500) {
    return readLocalizedMessage(codeMessages["500"], language) ?? getApiErrorFallbackMessage(language);
  }
  return getApiErrorFallbackMessage(language);
}

export function createApiClientError(options: ApiClientErrorOptions): ApiClientError {
  return new ApiClientError(options);
}

export function shouldClearAuthSession(code: number | undefined, status: number | undefined): boolean {
  return status === 401 || AUTH_EXPIRED_CODES.has(code ?? -1);
}

export function getValidationErrors(data: unknown): Record<string, string> {
  if (!data || typeof data !== "object") return {};
  return Object.entries(data as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (typeof value === "string") acc[key] = value;
      else if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        acc[key] = value.join(", ");
      }
      return acc;
    },
    {},
  );
}

export function extractApiClientError(error: unknown): ApiClientError | null {
  if (error instanceof ApiClientError) return error;
  if (typeof error !== "object" || error === null) return null;

  const maybeError = error as {
    code?: unknown;
    status?: unknown;
    response?: { status?: unknown; data?: unknown };
    message?: unknown;
  };
  const responseData = maybeError.response?.data;
  if (isApiResponseLike(responseData)) {
    return createApiClientError({
      code: responseData.code,
      status: typeof maybeError.response?.status === "number" ? maybeError.response.status : undefined,
      message: responseData.message,
      data: responseData.data,
      response: responseData,
      cause: error,
    });
  }

  if (typeof maybeError.code === "number" || typeof maybeError.status === "number") {
    return createApiClientError({
      code: typeof maybeError.code === "number" ? maybeError.code : undefined,
      status: typeof maybeError.status === "number" ? maybeError.status : undefined,
      message: typeof maybeError.message === "string" ? maybeError.message : undefined,
      cause: error,
    });
  }

  return null;
}
