"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Wallet,
  CircleDollarSign,
  ClipboardList,
  TrendingUp,
  ReceiptText,
  ListChecks,
  Cpu,
  Zap,
  Layers,
  Globe,
  FileClock,
  FileText,
  Bell,
  BookOpenText,
  Settings,
  SlidersHorizontal,
  Database,
  KeyRound,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  titleKey: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  labelKey: string;
  items: NavItem[];
};

export const ADMIN_NAV_ITEMS: NavGroup[] = [
  {
    labelKey: "groups.operations",
    items: [
      { titleKey: "items.dashboard", icon: LayoutDashboard, href: "/admins/dashboard" },
      { titleKey: "items.wallets", icon: Wallet, href: "/admins/wallets" },
      { titleKey: "items.logs", icon: Database, href: "/admins/logs" },
    ],
  },
  {
    labelKey: "groups.users",
    items: [
      { titleKey: "items.users", icon: Users, href: "/admins/users" },
      { titleKey: "items.team", icon: GitBranch, href: "/admins/team" },
    ],
  },
  {
    labelKey: "groups.finance",
    items: [
      { titleKey: "items.recharge", icon: CircleDollarSign, href: "/admins/recharge" },
      { titleKey: "items.withdraw", icon: Wallet, href: "/admins/withdraw" },
      { titleKey: "items.profits", icon: TrendingUp, href: "/admins/profits" },
      { titleKey: "items.commissions", icon: ReceiptText, href: "/admins/commissions" },
      { titleKey: "items.settlements", icon: ListChecks, href: "/admins/settlements" },
    ],
  },
  {
    labelKey: "groups.compute",
    items: [
      { titleKey: "items.orders", icon: ClipboardList, href: "/admins/orders" },
      { titleKey: "items.api", icon: KeyRound, href: "/admins/api" },
      { titleKey: "items.products", icon: Cpu, href: "/admins/products" },
      { titleKey: "items.models", icon: Zap, href: "/admins/models" },
      { titleKey: "items.gpu", icon: Layers, href: "/admins/gpu" },
      { titleKey: "items.regions", icon: Globe, href: "/admins/regions" },
      { titleKey: "items.rules", icon: FileClock, href: "/admins/rules" },
    ],
  },
  {
    labelKey: "groups.system",
    items: [
      { titleKey: "items.management", icon: ShieldCheck, href: "/admins/management" },
      { titleKey: "items.notifications", icon: Bell, href: "/admins/notifications" },
      { titleKey: "items.content", icon: BookOpenText, href: "/admins/content" },
      { titleKey: "items.docs", icon: FileText, href: "/admins/docs" },
      { titleKey: "items.config", icon: Settings, href: "/admins/config" },
      { titleKey: "items.scheduler", icon: SlidersHorizontal, href: "/admins/scheduler" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("AdminNav");

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6">
          <Link href="/admins/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[13px] font-bold tracking-tight">{t("brand")}</span>
              <span className="mt-0.5 truncate text-[9px] font-medium uppercase text-muted-foreground opacity-60">
                {t("subtitle")}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 scrollbar-none">
          <div className="space-y-7">
            {ADMIN_NAV_ITEMS.map((group) => (
              <div key={group.labelKey} className="space-y-1.5">
                <h4 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                  {t(group.labelKey)}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admins" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-primary" : "group-hover:text-foreground",
                          )}
                        />
                        <span className="truncate">{t(item.titleKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-border/40 p-4">
          <div className="rounded-lg bg-muted/30 p-2 text-center">
            <p className="font-mono text-[9px] uppercase text-muted-foreground opacity-40">
              Admin Core Engine v1.0.4
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
