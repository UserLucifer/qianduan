export const locales = ["zh-CN", "en-US"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "zh-CN";

export const localeLabels: Record<AppLocale, string> = {
  "zh-CN": "中文",
  "en-US": "English",
};

export const localeCookieName = "NEXT_LOCALE";

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  return isAppLocale(value) ? value : defaultLocale;
}

export function getLocaleFromPathname(pathname: string | null | undefined): AppLocale | undefined {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];
  return isAppLocale(firstSegment) ? firstSegment : undefined;
}

export function stripLocaleFromPathname(pathname: string | null | undefined): string {
  if (!pathname) return "/";

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isAppLocale(segments[0])) {
    const stripped = `/${segments.slice(1).join("/")}`;
    return stripped === "/" ? stripped : stripped.replace(/\/$/, "");
  }

  return pathname;
}

export function localizePathname(pathname: string, locale: AppLocale): string {
  if (/^https?:\/\//i.test(pathname) || pathname.startsWith("#")) {
    return pathname;
  }

  const [path = "/", query = ""] = pathname.split("?");
  const normalizedPath = stripLocaleFromPathname(path);
  const localizedPath = normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
  return query ? `${localizedPath}?${query}` : localizedPath;
}

export function getClientLocale(): AppLocale {
  if (typeof window === "undefined") return defaultLocale;

  const pathnameLocale = getLocaleFromPathname(window.location.pathname);
  if (pathnameLocale) return pathnameLocale;

  return normalizeLocale(window.localStorage.getItem(localeCookieName));
}
