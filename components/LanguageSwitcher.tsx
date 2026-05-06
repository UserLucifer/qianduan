"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, normalizeLocale, type AppLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = normalizeLocale(useLocale());
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("language");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-9 gap-2 px-2 text-muted-foreground hover:text-foreground", className)}
          aria-label={t("label")}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span className="hidden text-xs font-medium sm:inline">{localeLabels[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => switchLocale(item)}
            className="cursor-pointer gap-2"
          >
            <Check className={cn("h-4 w-4", item === locale ? "opacity-100" : "opacity-0")} />
            {t(item)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
