"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import MarketingMegaMenu from "./MarketingMegaMenu";
import { solutionIndustryItems, solutionScenarioCategories } from "./solution-menu-data";

export default function SolutionsMegaMenu() {
  const t = useTranslations("MegaMenus.solutions");

  return (
    <MarketingMegaMenu className="items-stretch">
      <main className="w-2/3 p-8">
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("byScenario")}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {solutionScenarioCategories.map((category) => (
            <div key={category.key} className="space-y-4">
              <h4 className="border-b border-border/50 pb-2 text-xs font-medium text-muted-foreground/80">
                {t(`categories.${category.key}`)}
              </h4>
              <div className="space-y-3">
                {category.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      prefetch={false}
                      className="group block rounded-lg p-2 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 rounded-md bg-muted p-1.5 text-foreground transition-colors group-hover:bg-background">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold leading-tight text-foreground">
                            {t(`items.${item.key}.name`)}
                          </div>
                          <div className="mt-1 text-xs leading-snug text-muted-foreground">
                            {t(`items.${item.key}.description`)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="flex w-1/3 flex-col bg-muted/30 p-8">
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("byIndustry")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {solutionIndustryItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                prefetch={false}
                className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {t(`industries.${item.key}`)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("ctaDescription")}
            </p>
            <Link
              href="/contact"
              prefetch={false}
              className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              {t("ctaLink")}
            </Link>
          </div>
        </div>
      </aside>
    </MarketingMegaMenu>
  );
}
