"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutGrid, LogOut, Moon, Search, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminLogout, getAdminMe, type AdminMeResponse } from "@/api/admin";

type AdminTheme = "light" | "dark";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => void;
};

const breadcrumbLabels: Record<string, string> = {
  admins: "管理后台",
  dashboard: "数据总览",
  management: "用户管理",
  wallets: "钱包管理",
  recharge: "充值审核",
  withdraw: "提现审核",
  orders: "租赁订单",
  api: "API 凭证",
  profits: "收益记录",
  commissions: "佣金记录",
  settlements: "结算订单",
  team: "团队关系",
  products: "产品目录",
  models: "AI 模型",
  gpu: "GPU 型号",
  regions: "机房地区",
  rules: "周期规则",
  content: "内容管理",
  notifications: "通知管理",
  config: "系统配置",
  scheduler: "调度任务",
  logs: "操作日志",
};

function getCurrentTheme(): AdminTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.adminTheme === "light" ? "light" : "dark";
}

function setAdminTheme(theme: AdminTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.adminTheme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("adminTheme", theme);
}


function AdminThemeToggle() {
  const [theme, setTheme] = useState<AdminTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getCurrentTheme());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-9 w-9" />;

  const nextTheme: AdminTheme = theme === "dark" ? "light" : "dark";

  const handleToggle = () => {
    const viewTransitionDocument = document as DocumentWithViewTransition;
    if (typeof viewTransitionDocument.startViewTransition === "function") {
      viewTransitionDocument.startViewTransition(() => {
        setAdminTheme(nextTheme);
        setTheme(nextTheme);
      });
    } else {
      setAdminTheme(nextTheme);
      setTheme(nextTheme);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="admin-icon-button relative h-9 w-9 overflow-hidden"
      aria-label={`切换到${nextTheme === "dark" ? "暗色" : "明亮"}主题`}
      title={`切换到${nextTheme === "dark" ? "暗色" : "明亮"}主题`}
      onClick={handleToggle}
    >
      <div className="relative h-4 w-4">
        {theme === "dark" ? (
          <Sun className="absolute inset-0 h-4 w-4 transition-all duration-500 hover:rotate-45" />
        ) : (
          <Moon className="absolute inset-0 h-4 w-4 transition-all duration-500 hover:-rotate-12" />
        )}
      </div>
    </Button>
  );
}

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminMeResponse | null>(null);
  const pathSegments = pathname.split("/").filter(Boolean);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("adminAccessToken");
      router.push("/admins/login");
    }
  };

  useEffect(() => {
    let mounted = true;
    getAdminMe()
      .then((res) => {
        if (mounted && (res.code === 200 || res.code === 0)) setAdmin(res.data);
      })
      .catch(() => {
        if (mounted) setAdmin(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="admin-header sticky top-0 z-30 flex h-16 items-center justify-between border-b px-8 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel-soft)]">
          <LayoutGrid className="h-4 w-4 text-[var(--admin-brand-soft)]" />
        </div>
        <div className="flex min-w-0 items-center gap-2 text-sm">
          {pathSegments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="admin-subtle">/</span> : null}
              <span className={index === pathSegments.length - 1 ? "text-[var(--admin-text)]" : "admin-muted"}>
                {breadcrumbLabels[segment] ?? segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-72 lg:block">
          <Search className="admin-subtle absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            className="admin-search h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none transition"
            placeholder="搜索用户、订单、流水或配置"
          />
        </div>
        <AdminThemeToggle />
        <Button asChild variant="ghost" size="icon" className="admin-icon-button relative">
          <Link href="/admins/notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="admin-icon-button">
          <Link href="/admins/config">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="admin-user-chip ml-3 flex h-9 items-center gap-2 rounded-lg border px-3 transition-colors hover:bg-[var(--admin-hover)]"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5e6ad2]/20 text-xs font-medium text-[var(--admin-brand-soft)]">
              {(admin?.nickname || admin?.username || "A").slice(0, 1).toUpperCase()}
            </div>
            <span className="max-w-32 truncate text-sm text-[var(--admin-muted)]">
              {admin?.nickname || admin?.username || "管理员"}
            </span>
          </button>
          
          {dropdownOpen ? (
            <div className="absolute right-0 top-full mt-1.5 w-32 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel-strong)] py-1 shadow-lg backdrop-blur-xl">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-500/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
