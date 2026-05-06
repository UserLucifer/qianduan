"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Leaf,
  type LucideIcon,
} from "lucide-react";

import MarketingMegaMenu from "./MarketingMegaMenu";

type CompanyItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

const companyItems: CompanyItem[] = [
  { key: "about", href: "/about", icon: Building2 },
  { key: "sustainability", href: "/sustainability", icon: Leaf },
  { key: "enterprise", href: "/enterprise", icon: BriefcaseBusiness },
];

export default function CompanyMegaMenu() {
  const t = useTranslations("MegaMenus.company");

  return (
    <MarketingMegaMenu className="w-[660px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("title")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {companyItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                prefetch={false}
                className="group rounded-lg p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-muted p-1.5 text-foreground transition-colors group-hover:bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
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
      </main>

      <aside className="flex w-64 shrink-0 flex-col bg-muted/30 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("sideTitle")}
        </h3>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t("sideDescription")}
        </p>
        <Link
          href="/contact"
          prefetch={false}
          className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
        >
          {t("contact")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
