"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

/**
 * 管理后台导航配置强类型
 */
export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/**
 * 系统管理后台菜单配置
 */
export const ADMIN_NAV_ITEMS: NavGroup[] = [
  {
    label: "运营大盘",
    items: [
      { title: "数据概览", icon: LayoutDashboard, href: "/admins/dashboard" },
      { title: "资产管理", icon: Wallet, href: "/admins/wallets" },
      { title: "操作审计", icon: Database, href: "/admins/logs" },
    ],
  },
  {
    label: "用户体系",
    items: [
      { title: "客户名单", icon: Users, href: "/admins/users" },
      { title: "团队拓扑", icon: GitBranch, href: "/admins/team" },
    ],
  },
  {
    label: "财务结算",
    items: [
      { title: "充值审核", icon: CircleDollarSign, href: "/admins/recharge" },
      { title: "提现审核", icon: Wallet, href: "/admins/withdraw" },
      { title: "收益对账", icon: TrendingUp, href: "/admins/profits" },
      { title: "佣金明细", icon: ReceiptText, href: "/admins/commissions" },
      { title: "结算工单", icon: ListChecks, href: "/admins/settlements" },
    ],
  },
  {
    label: "算力调度",
    items: [
      { title: "租赁订单", icon: ClipboardList, href: "/admins/orders" },
      { title: "API 凭证", icon: KeyRound, href: "/admins/api" },
      { title: "产品库", icon: Cpu, href: "/admins/products" },
      { title: "模型参数", icon: Zap, href: "/admins/models" },
      { title: "GPU 型号", icon: Layers, href: "/admins/gpu" },
      { title: "节点区域", icon: Globe, href: "/admins/regions" },
      { title: "周期策略", icon: FileClock, href: "/admins/rules" },
    ],
  },
  {
    label: "系统基座",
    items: [
      { title: "管理权限", icon: ShieldCheck, href: "/admins/management" },
      { title: "全局公告", icon: Bell, href: "/admins/notifications" },
      { title: "内容发布", icon: BookOpenText, href: "/admins/content" },
      { title: "文档系统", icon: FileText, href: "/admins/docs" },
      { title: "系统参数", icon: Settings, href: "/admins/config" },
      { title: "异步调度", icon: SlidersHorizontal, href: "/admins/scheduler" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col">
        {/* Brand Area */}
        <div className="flex h-16 items-center px-6">
          <Link href="/admins/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold tracking-tight">管理后台</span>
              <span className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5 opacity-60">Admin Control Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav Scroll Area */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-none">
          <div className="space-y-7">
            {ADMIN_NAV_ITEMS.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <h4 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                  {group.label}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admins" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer info */}
        <div className="border-t border-border/40 p-4">
          <div className="rounded-lg bg-muted/30 p-2 text-center">
            <p className="text-[9px] text-muted-foreground font-mono uppercase opacity-40">
              Admin Core Engine v1.0.4
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
