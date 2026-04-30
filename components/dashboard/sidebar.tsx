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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  icon: any;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navConfig: NavGroup[] = [
  {
    title: "概览",
    items: [
      { name: "控制台", icon: LayoutDashboard, href: "/dashboard" },
      { name: "数据分析", icon: BarChart3, href: "/dashboard/analytics" },
    ],
  },
  {
    title: "算力资源",
    items: [
      { name: "产品大厅", icon: ShoppingBag, href: "/dashboard/products" },
      { name: "我的实例", icon: ListChecks, href: "/dashboard/orders" },
      { name: "API 管理", icon: KeyRound, href: "/dashboard/api" },
    ],
  },
  {
    title: "财务中心",
    items: [
      { name: "我的钱包", icon: Wallet, href: "/dashboard/wallet" },
      { name: "充值", icon: CreditCard, href: "/dashboard/recharge" },
      { name: "提现", icon: Send, href: "/dashboard/withdraw" },
      { name: "账单", icon: ReceiptText, href: "/dashboard/billing" },
    ],
  },
  {
    title: "推广收益",
    items: [
      { name: "算力收益", icon: TrendingUp, href: "/dashboard/profits" },
      { name: "我的团队", icon: Users, href: "/dashboard/team" },
      { name: "佣金明细", icon: CircleDollarSign, href: "/dashboard/commissions" },
      { name: "结算记录", icon: ClipboardList, href: "/dashboard/settlements" },
    ],
  },
];

const accountConfig: NavGroup = {
  title: "账户设置",
  items: [
    { name: "消息通知", icon: Bell, href: "/dashboard/notifications" },
    { name: "设置", icon: Settings, href: "/dashboard/settings" },
  ],
};

export function Sidebar() {
  const pathname = usePathname();

  const renderNavGroup = (group: NavGroup) => (
    <div key={group.title} className="mb-6">
      <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {group.title}
      </h3>
      <div className="space-y-1">
        {group.items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-l-2 border-primary bg-accent/50 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("mr-3 h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col py-6">
        <div className="mb-8 px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">GPU 控制台</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 scrollbar-none">
          {navConfig.map(renderNavGroup)}
        </nav>

        <div className="mt-auto px-3 pt-6">
          {renderNavGroup(accountConfig)}
        </div>
      </div>
    </aside>
  );
}
