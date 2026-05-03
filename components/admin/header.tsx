"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutGrid, LogOut, Moon, Search, Settings, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
      className="relative h-9 w-9 overflow-hidden text-muted-foreground hover:text-foreground"
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

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-primary">
          <LayoutGrid className="h-4 w-4" />
        </div>
        <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
          {pathSegments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-muted-foreground">/</span> : null}
              <span className={index === pathSegments.length - 1 ? "text-foreground" : "text-muted-foreground"}>
                {breadcrumbLabels[segment] ?? segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-72 lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 rounded-lg bg-muted/40 pl-9"
            placeholder="搜索用户、订单、流水或配置"
          />
        </div>
        <AdminThemeToggle />
        <Button asChild variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Link href="/admins/notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Link href="/admins/config">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="ml-1 h-9 gap-2 rounded-lg px-2 sm:px-3"
            >
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarFallback className="rounded-md bg-primary/10 text-xs font-medium text-primary">
                  {(admin?.userName || "A").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate text-sm text-muted-foreground sm:inline">
                {admin?.userName || "管理员"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
