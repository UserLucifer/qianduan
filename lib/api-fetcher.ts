"use client";

import {
  createApiClientError,
  getApiErrorMessage,
  isApiResponseLike,
  isSuccessApiCode,
  shouldClearAuthSession,
} from "@/lib/api-errors";
import { clearUserAuthSession, getUserAccessToken } from "@/lib/auth-session";
import { getClientLocale, localizePathname, stripLocaleFromPathname } from "@/i18n/locales";

/**
 * Shared fetcher for the Spring Boot backend.
 * Adds Authorization: Bearer <token> when a user token is available.
 */
export async function apiFetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getUserAccessToken();
  const locale = getClientLocale();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const responseData = await response.json().catch(() => null);

  if (isApiResponseLike(responseData) && !isSuccessApiCode(responseData.code)) {
    if (shouldClearAuthSession(responseData.code, response.status) && typeof window !== "undefined") {
      clearUserAuthSession();
      if (stripLocaleFromPathname(window.location.pathname) !== "/login") {
        window.location.href = localizePathname("/login", getClientLocale());
      }
    }

    throw createApiClientError({
      code: responseData.code,
      status: response.status,
      message: responseData.message,
      data: responseData.data,
      response: responseData,
      locale,
    });
  }

  if (!response.ok) {
    // Handle common HTTP errors.
    if (shouldClearAuthSession(undefined, response.status) && typeof window !== "undefined") {
      clearUserAuthSession();
      if (stripLocaleFromPathname(window.location.pathname) !== "/login") {
        window.location.href = localizePathname("/login", getClientLocale());
      }
    }

    throw createApiClientError({
      status: response.status,
      message: getApiErrorMessage({
        status: response.status,
        message:
          responseData && typeof responseData === "object" && "message" in responseData
            ? String(responseData.message)
            : undefined,
      }, locale),
      data: responseData,
      response: responseData,
      locale,
    });
  }

  return responseData as T;
}
