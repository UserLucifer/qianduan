import type { DocsLanguage, DocsSection } from "@/api/docs";

export const DOCS_SECTION_ITEMS: Array<{
  section: DocsSection;
  label: string;
  href: string;
}> = [
  { section: "guide", label: "向导", href: "/docs" },
  { section: "integration", label: "集成", href: "/docs/integrations" },
  { section: "faq", label: "常见问题", href: "/docs/faq" },
];

export const DOCS_DEFAULT_LANGUAGE: DocsLanguage = "zh-CN";

export const DOCS_LANGUAGE_ITEMS: Array<{
  language: DocsLanguage;
  label: string;
}> = [
  { language: "zh-CN", label: "中文" },
  { language: "en-US", label: "English" },
];

export function docsSectionHref(section: DocsSection) {
  if (section === "support") return "/docs/support";
  return DOCS_SECTION_ITEMS.find((item) => item.section === section)?.href ?? "/docs";
}

export function docsSectionLabel(section: DocsSection) {
  if (section === "support") return "支持";
  return DOCS_SECTION_ITEMS.find((item) => item.section === section)?.label ?? "向导";
}

export function docsLanguageLabel(language: DocsLanguage) {
  return DOCS_LANGUAGE_ITEMS.find((item) => item.language === language)?.label ?? "中文";
}

export function normalizeDocsLanguage(language: string | undefined | null): DocsLanguage {
  return language === "en-US" ? "en-US" : DOCS_DEFAULT_LANGUAGE;
}

export function withDocsLanguage(href: string, language: DocsLanguage) {
  if (language === DOCS_DEFAULT_LANGUAGE) return href;

  const [pathname, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("language", language);
  const nextQuery = params.toString();

  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
