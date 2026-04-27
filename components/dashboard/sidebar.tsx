"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CircleDollarSign,
  CreditCard,
  Cpu,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Network,
  ReceiptText,
  Send,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "控制台", icon: LayoutDashboard, href: "/dashboard" },
  { name: "算力市场", icon: ShoppingBag, href: "/dashboard/products" },
  { name: "租赁订单", icon: ListChecks, href: "/dashboard/orders" },
  { name: "API 管理", icon: KeyRound, href: "/dashboard/api" },
  { name: "钱包中心", icon: Wallet, href: "/dashboard/wallet" },
  { name: "充值管理", icon: CreditCard, href: "/dashboard/recharge" },
  { name: "提现管理", icon: Send, href: "/dashboard/withdraw" },
  { name: "收益中心", icon: TrendingUp, href: "/dashboard/profits" },
  { name: "佣金中心", icon: CircleDollarSign, href: "/dashboard/commissions" },
  { name: "我的团队", icon: Users, href: "/dashboard/team" },
  { name: "结算记录", icon: ReceiptText, href: "/dashboard/settlements" },
  { name: "消息通知", icon: Bell, href: "/dashboard/notifications" },
  { name: "账户设置", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#0b0c0d]/95 dark:backdrop-blur-xl">
      <div className="flex h-full flex-col px-3 py-4">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#5e6ad2]/20 bg-[#5e6ad2] shadow-[0_0_24px_rgba(94,106,210,0.25)] dark:border-white/10">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 dark:text-zinc-50">算力租赁</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-500">
              <Network className="h-3 w-3" />
              GPU 控制台
            </div>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.1)] dark:bg-white/[0.08] dark:text-zinc-50 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:text-zinc-500 dark:hover:bg-white/[0.04] dark:hover:text-zinc-200",
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-[#9aa2ff]" : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-600 dark:group-hover:text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="text-xs font-medium text-slate-900 dark:text-zinc-200">API 安全提示</div>
          <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-zinc-500">
            API Key 和 Token 默认脱敏展示，复制前请确认当前设备环境可信。
          </p>
        </div>
      </div>
    </aside>
  );
}
