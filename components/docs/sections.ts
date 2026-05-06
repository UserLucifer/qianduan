import type { DocsLanguage, DocsSection } from "@/api/docs";
import { defaultLocale } from "@/i18n/locales";

export const DOCS_SECTION_ITEMS: Array<{
  section: DocsSection;
  label: string;
  href: string;
}> = [
  { section: "guide", label: "\u5411\u5bfc", href: "/docs" },
  { section: "integration", label: "\u96c6\u6210", href: "/docs/integrations" },
  { section: "faq", label: "\u5e38\u89c1\u95ee\u9898", href: "/docs/faq" },
];

export const DOCS_DEFAULT_LANGUAGE: DocsLanguage = defaultLocale;

export const DOCS_LANGUAGE_ITEMS: Array<{
  language: DocsLanguage;
  label: string;
}> = [
  { language: "zh-CN", label: "\u4e2d\u6587" },
  { language: "en-US", label: "English" },
];

const sectionLabels: Record<DocsLanguage, Record<DocsSection, string>> = {
  "zh-CN": {
    guide: "\u5411\u5bfc",
    integration: "\u96c6\u6210",
    faq: "\u5e38\u89c1\u95ee\u9898",
    support: "\u652f\u6301",
  },
  "en-US": {
    guide: "Guide",
    integration: "Integrations",
    faq: "FAQ",
    support: "Support",
  },
};

export function docsSectionHref(section: DocsSection) {
  if (section === "support") return "/docs/support";
  return DOCS_SECTION_ITEMS.find((item) => item.section === section)?.href ?? "/docs";
}

export function docsSectionLabel(section: DocsSection, language: DocsLanguage = DOCS_DEFAULT_LANGUAGE) {
  return sectionLabels[language][section] ?? sectionLabels[DOCS_DEFAULT_LANGUAGE].guide;
}

export function docsLanguageLabel(language: DocsLanguage) {
  return DOCS_LANGUAGE_ITEMS.find((item) => item.language === language)?.label ?? DOCS_LANGUAGE_ITEMS[0].label;
}

export function normalizeDocsLanguage(language: string | undefined | null): DocsLanguage {
  return language === "en-US" ? "en-US" : DOCS_DEFAULT_LANGUAGE;
}

export function withDocsLanguage(href: string, language: DocsLanguage) {
  const [pathname, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.delete("language");
  const nextQuery = params.toString();

  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
