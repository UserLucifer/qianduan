"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, KeyRound, Moon, Search, Sun, Wallet, LogOut, Settings, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [theme, setTheme] = useState<string>("dark");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((res) => {
        if (mounted && (res.code === 200 || res.code === 0)) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    const currentTheme = document.documentElement.dataset.theme || "dark";
    setTheme(currentTheme);

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    document.documentElement.style.colorScheme = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  // Get dynamic title based on path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "概览";
    if (pathname.includes("/settings")) return "个人设置";
    if (pathname.includes("/orders")) return "我的实例";
    if (pathname.includes("/wallet")) return "我的钱包";
    if (pathname.includes("/api")) return "API 管理";
    return "控制台";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight">{getPageTitle()}</h1>
        <div className="hidden h-8 w-px bg-border/50 md:block" />
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-9 w-full rounded-md border border-border bg-transparent pl-8 pr-3 text-xs outline-none transition-colors focus:border-primary/50 focus:bg-muted/30"
            placeholder="快速搜索..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/notifications">
            <Bell className="h-4 w-4" />
          </Link>
        </Button>

        <div className="ml-2 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-9 items-center gap-2 rounded-full px-1.5 py-1.5 hover:bg-muted">
                <UserAvatar 
                  src={getAvatarUrl(user?.avatarKey)}
                  name={user?.userName || user?.email || "U"}
                  className="h-7 w-7 ring-1 ring-border"
                />
                <span className="max-w-[100px] truncate text-xs font-bold text-foreground">
                  {user?.userName || "账户"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
                <span className="text-xs font-bold">{user?.userName}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{user?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  个人中心
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/billing" className="flex w-full items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  账单记录
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/wallet" className="flex w-full items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  我的钱包
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
