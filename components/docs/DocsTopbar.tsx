"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localizePathname } from "@/i18n/locales";
import { ChevronDown, ChevronRight, Globe2, Languages, Search } from "lucide-react";
import ThemeToggle from "@/components/marketing/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { docsSectionHref } from "@/components/docs/sections";
import type { DocsLanguage, DocsSection } from "@/api/docs";

const LANGUAGE_KEY = "docs_language";

const languageIcons = {
  "zh-CN": Languages,
  "en-US": Globe2,
};

export function DocsTopbar({
  activeSection,
  language,
  keyword,
}: {
  activeSection: DocsSection;
  language: DocsLanguage;
  keyword?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Docs");
  const localeT = useTranslations("LocaleSwitcher");
  const common = useTranslations("Common");
  const CurrentLanguageIcon = languageIcons[language];

  const updateLanguage = (nextLanguage: DocsLanguage) => {
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);

    const params = new URLSearchParams(window.location.search);
    params.delete("language");
    params.delete("category_id");
    params.delete("pageNo");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { locale: nextLanguage });
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid min-h-16 w-full max-w-[1240px] grid-cols-1 items-center gap-4 px-5 py-3 md:px-10 lg:grid-cols-[minmax(220px,1fr)_minmax(320px,450px)_minmax(220px,1fr)]">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-sm font-black text-foreground">
              {t("brandShort")}
            </span>
            {common("brand")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-2 px-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <CurrentLanguageIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {localeT(language)}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => updateLanguage("zh-CN")}>
                <Languages className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {localeT("zh-CN")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLanguage("en-US")}>
                <Globe2 className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {localeT("en-US")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <form action={localizePathname(docsSectionHref(activeSection), language)} className="min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="keyword"
              defaultValue={keyword}
              placeholder={t("searchPlaceholder")}
              className="h-10 rounded-xl bg-background pl-11 pr-16 text-sm shadow-none"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs font-semibold text-muted-foreground sm:block">
              Ctrl K
            </span>
          </div>
        </form>

        <div className="flex items-center justify-start gap-5 lg:justify-end">
          <Link href="/contact-us" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("support")}
          </Link>
          <Button asChild className="h-9 rounded-full bg-[#4770FF] px-5 font-semibold text-white hover:bg-[#4770FF]">
            <Link href="/">
              {t("systemHome")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
