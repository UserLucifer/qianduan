"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CreditCard, LogOut, Moon, Search, Settings, Sun, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import { USER_NAV_ITEMS } from "@/components/dashboard/sidebar";
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

  const getPageTitle = () => {
    const items = USER_NAV_ITEMS.flatMap((group) => group.items);
    const matched = items
      .filter((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
      .sort((a, b) => b.href.length - a.href.length)[0];

    return matched?.title ?? "控制台";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight">{getPageTitle()}</h1>
        <div className="hidden h-8 w-px bg-border/50 md:block" />
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-9 pl-8 pr-3 text-xs shadow-none focus-visible:ring-1" placeholder="快速搜索..." />
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
            <DropdownMenuContent align="end" className="mt-2 w-56">
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
