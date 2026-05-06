"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  CircleDollarSign,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react";

import MarketingMegaMenu from "./MarketingMegaMenu";

type HostingItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

const hostingItems: HostingItem[] = [
  { key: "hosting", href: "/hosting", icon: Users },
  { key: "dataCenter", href: "/data-center", icon: Building2 },
  { key: "financing", href: "/financing", icon: CircleDollarSign },
  { key: "hardware", href: "/hardware", icon: Server },
];

export default function HostingMegaMenu() {
  const t = useTranslations("MegaMenus.hosting");

  return (
    <MarketingMegaMenu className="w-[620px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("title")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {hostingItems.map((item) => {
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
        <div className="rounded-md bg-muted p-2 text-foreground">
          <Server className="h-4 w-4" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          {t("sideTitle")}
        </h3>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t("sideDescription")}
        </p>
        <Link
          href="/hardware"
          prefetch={false}
          className="mt-auto text-xs font-semibold text-primary hover:underline"
        >
          {t("sideLink")}
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
