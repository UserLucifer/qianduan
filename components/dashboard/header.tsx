"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, KeyRound, Moon, Search, Sun, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type UserMeResponse } from "@/api/user";

export function Header() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((res) => {
        if (mounted && (res.code === 200 || res.code === 0)) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    // Initialize theme state
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#08090a]/80">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-600" />
        <input
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5e6ad2]/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-100 dark:placeholder:text-zinc-600"
          placeholder="搜索订单号、API 凭证或资金流水"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-slate-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:bg-gray-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100">
          <Link href="/dashboard/wallet">
            <Wallet className="h-4 w-4" />
            钱包
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:bg-gray-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100">
          <Link href="/dashboard/api">
            <KeyRound className="h-4 w-4" />
            API
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="relative text-slate-500 hover:bg-gray-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100">
          <Link href="/dashboard/notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
          </Link>
        </Button>
        <div className="ml-3 flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 transition-colors dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5e6ad2]/20 text-xs font-medium text-[#5e6ad2] dark:text-[#9aa2ff]">
            {(user?.nickname || user?.email || "U").slice(0, 1).toUpperCase()}
          </div>
          <span className="max-w-32 truncate text-sm font-medium text-slate-700 dark:text-muted-foreground">{user?.nickname || user?.email || "当前用户"}</span>
        </div>
      </div>
    </header>
  );
}
