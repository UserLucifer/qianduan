"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenText,
  CircleDollarSign,
  ClipboardList,
  Cpu,
  Database,
  FileClock,
  Gauge,
  GitBranch,
  Globe,
  KeyRound,
  Layers,
  ListChecks,
  ReceiptText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminMenuGroups = [
  {
    group: "运营中枢",
    items: [
      { name: "数据总览", icon: Gauge, href: "/admins/dashboard" },
      { name: "用户管理", icon: Users, href: "/admins/management" },
      { name: "钱包管理", icon: Wallet, href: "/admins/wallets" },
      { name: "操作日志", icon: Database, href: "/admins/logs" },
    ],
  },
  {
    group: "财务审核",
    items: [
      { name: "充值审核", icon: CircleDollarSign, href: "/admins/recharge" },
      { name: "提现审核", icon: Wallet, href: "/admins/withdraw" },
      { name: "收益记录", icon: TrendingUp, href: "/admins/profits" },
      { name: "佣金记录", icon: ReceiptText, href: "/admins/commissions" },
      { name: "结算订单", icon: ListChecks, href: "/admins/settlements" },
    ],
  },
  {
    group: "算力业务",
    items: [
      { name: "租赁订单", icon: ClipboardList, href: "/admins/orders" },
      { name: "API 凭证", icon: KeyRound, href: "/admins/api" },
      { name: "团队关系", icon: GitBranch, href: "/admins/team" },
      { name: "产品目录", icon: Cpu, href: "/admins/products" },
      { name: "AI 模型", icon: Zap, href: "/admins/models" },
      { name: "GPU 型号", icon: Layers, href: "/admins/gpu" },
      { name: "机房地区", icon: Globe, href: "/admins/regions" },
      { name: "周期规则", icon: FileClock, href: "/admins/rules" },
    ],
  },
  {
    group: "系统配置",
    items: [
      { name: "内容管理", icon: BookOpenText, href: "/admins/content" },
      { name: "通知管理", icon: Bell, href: "/admins/notifications" },
      { name: "系统配置", icon: Settings, href: "/admins/config" },
      { name: "调度任务", icon: SlidersHorizontal, href: "/admins/scheduler" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar fixed left-0 top-0 z-40 h-screen w-64 overflow-hidden border-r backdrop-blur-xl">
      <div className="flex h-full flex-col px-3 py-6">
        <Link href="/admins/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <div className="admin-brand-card flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
            <ShieldCheck className="h-[18px] w-[18px] text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-[var(--admin-text)]">系统管理后台</div>
            <div className="truncate text-[10px] leading-4 text-[var(--admin-muted)]">运营、审计与调度中心</div>
          </div>
        </Link>

        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto space-y-7 pr-0.5">
          {adminMenuGroups.map((group) => (
            <div key={group.group}>
              <div className="mb-3 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--admin-subtle)]">
                {group.group}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-active={isActive}
                      className={cn(
                        "admin-nav-item group flex h-9 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition",
                      )}
                    >
                      <item.icon className="admin-nav-icon h-3.5 w-3.5 shrink-0 transition" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
