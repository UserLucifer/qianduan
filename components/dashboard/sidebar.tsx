"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  ListChecks,
  KeyRound,
  Wallet,
  CreditCard,
  Send,
  ReceiptText,
  TrendingUp,
  Users,
  CircleDollarSign,
  ClipboardList,
  Bell,
  Settings,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const USER_NAV_ITEMS: NavGroup[] = [
  {
    labelKey: "groups.overview",
    items: [
      { titleKey: "items.dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { titleKey: "items.analytics", icon: BarChart3, href: "/dashboard/analytics" },
    ],
  },
  {
    labelKey: "groups.compute",
    items: [
      { titleKey: "items.products", icon: ShoppingBag, href: "/dashboard/products" },
      { titleKey: "items.orders", icon: ListChecks, href: "/dashboard/orders" },
      { titleKey: "items.api", icon: KeyRound, href: "/dashboard/api" },
    ],
  },
  {
    labelKey: "groups.finance",
    items: [
      { titleKey: "items.wallet", icon: Wallet, href: "/dashboard/wallet" },
      { titleKey: "items.recharge", icon: CreditCard, href: "/dashboard/recharge" },
      { titleKey: "items.withdraw", icon: Send, href: "/dashboard/withdraw" },
      { titleKey: "items.billing", icon: ReceiptText, href: "/dashboard/billing" },
    ],
  },
  {
    labelKey: "groups.growth",
    items: [
      { titleKey: "items.profits", icon: TrendingUp, href: "/dashboard/profits" },
      { titleKey: "items.team", icon: Users, href: "/dashboard/team" },
      { titleKey: "items.commissions", icon: CircleDollarSign, href: "/dashboard/commissions" },
      { titleKey: "items.settlements", icon: ClipboardList, href: "/dashboard/settlements" },
    ],
  },
  {
    labelKey: "groups.account",
    items: [
      { titleKey: "items.notifications", icon: Bell, href: "/dashboard/notifications" },
      { titleKey: "items.settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("DashboardNav");

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t("brand")}</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 scrollbar-none">
          <div className="space-y-6">
            {USER_NAV_ITEMS.map((group) => (
              <div key={group.labelKey} className="space-y-1">
                <h4 className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {t(group.labelKey)}
                </h4>
                <div className="space-y-0.5 pt-1.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "group h-9 w-full justify-start gap-3 px-3 font-medium",
                          !isActive && "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-primary" : "group-hover:text-foreground",
                            )}
                          />
                          <span className="truncate">{t(item.titleKey)}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-border/50 p-4">
          <p className="text-center text-[10px] font-medium uppercase tracking-tighter text-muted-foreground/40">
            Cloud Compute Platform v0.1
          </p>
        </div>
      </div>
    </aside>
  );
}
