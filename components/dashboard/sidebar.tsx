"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const USER_NAV_ITEMS: NavGroup[] = [
  {
    label: "概览",
    items: [
      { title: "控制台", icon: LayoutDashboard, href: "/dashboard" },
      { title: "数据分析", icon: BarChart3, href: "/dashboard/analytics" },
    ],
  },
  {
    label: "算力资源",
    items: [
      { title: "产品大厅", icon: ShoppingBag, href: "/dashboard/products" },
      { title: "我的实例", icon: ListChecks, href: "/dashboard/orders" },
      { title: "API 管理", icon: KeyRound, href: "/dashboard/api" },
    ],
  },
  {
    label: "财务中心",
    items: [
      { title: "我的钱包", icon: Wallet, href: "/dashboard/wallet" },
      { title: "充值中心", icon: CreditCard, href: "/dashboard/recharge" },
      { title: "提现申请", icon: Send, href: "/dashboard/withdraw" },
      { title: "账单明细", icon: ReceiptText, href: "/dashboard/billing" },
    ],
  },
  {
    label: "推广收益",
    items: [
      { title: "算力收益", icon: TrendingUp, href: "/dashboard/profits" },
      { title: "我的团队", icon: Users, href: "/dashboard/team" },
      { title: "佣金明细", icon: CircleDollarSign, href: "/dashboard/commissions" },
      { title: "结算记录", icon: ClipboardList, href: "/dashboard/settlements" },
    ],
  },
  {
    label: "账户设置",
    items: [
      { title: "消息通知", icon: Bell, href: "/dashboard/notifications" },
      { title: "个人设置", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">GPU 控制台</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 scrollbar-none">
          <div className="space-y-6">
            {USER_NAV_ITEMS.map((group) => (
              <div key={group.label} className="space-y-1">
                <h4 className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {group.label}
                </h4>
                <div className="space-y-0.5 pt-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "group h-9 w-full justify-start gap-3 px-3 font-medium",
                          !isActive && "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                          <span>{item.title}</span>
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
