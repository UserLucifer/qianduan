"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Bell,
  BookOpen,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Search,
  Settings,
  Sun,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { clearUserAuthSession, subscribeUserAuthChanges } from "@/lib/auth-session";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { USER_NAV_ITEMS } from "@/components/dashboard/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PUBLIC_HEADER_LINKS = [
  { titleKey: "public.home", href: "/", icon: Home },
  { titleKey: "public.blog", href: "/blog", icon: Newspaper },
  { titleKey: "public.docs", href: "/docs", icon: BookOpen },
];

export function Header() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [theme, setTheme] = useState<string>("dark");
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("DashboardHeader");
  const navT = useTranslations("DashboardNav");

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

    const unsubscribeAuth = subscribeUserAuthChanges((action) => {
      if (action === "logout") {
        setUser(null);
        router.replace("/login");
        return;
      }

      getCurrentUser()
        .then((res) => {
          if (res.code === 200 || res.code === 0) setUser(res.data);
        })
        .catch(() => setUser(null));
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    document.documentElement.style.colorScheme = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    clearUserAuthSession();
    setUser(null);
    router.push("/login");
  };

  const getPageTitle = () => {
    const items = USER_NAV_ITEMS.flatMap((group) => group.items);
    const matched = items
      .filter(
        (item) =>
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href)),
      )
      .sort((a, b) => b.href.length - a.href.length)[0];

    return matched ? navT(matched.titleKey) : t("pageFallback");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <h1 className="truncate text-lg font-semibold tracking-tight">{getPageTitle()}</h1>
        <div className="hidden h-8 w-px bg-border/50 xl:block" />
        <div className="relative hidden w-64 xl:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-9 pl-8 pr-3 text-xs shadow-none focus-visible:ring-1" placeholder={t("quickSearch")} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t("publicNav")}>
          {PUBLIC_HEADER_LINKS.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className="h-9 gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{t(item.titleKey)}</span>
              </Link>
            </Button>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label={t("openPublicNav")}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-44 lg:hidden">
            <DropdownMenuLabel>{t("siteNav")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PUBLIC_HEADER_LINKS.map((item) => (
              <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                <Link href={item.href} className="flex w-full items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {t(item.titleKey)}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <LanguageSwitcher />

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
                <span className="hidden max-w-[100px] truncate text-xs font-bold text-foreground sm:block">
                  {user?.userName || t("accountFallback")}
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
                  {t("personalCenter")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/billing" className="flex w-full items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("billingRecords")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/wallet" className="flex w-full items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  {t("wallet")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
