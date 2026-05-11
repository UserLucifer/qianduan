"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Bell,
  BookOpen,
  Check,
  Home,
  Languages,
  Loader2,
  LogOut,
  Moon,
  Newspaper,
  PanelLeft,
  ChevronRight,
  Search,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { getUserNotifications } from "@/api/notification";
import { searchDashboard, type DashboardSearchItemResponse } from "@/api/dashboard";
import { clearUserAuthSession, subscribeUserAuthChanges } from "@/lib/auth-session";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import { DashboardNavGroups, USER_NAV_ITEMS } from "@/components/dashboard/sidebar";
import { locales, localeLabels, normalizeLocale, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PUBLIC_HEADER_LINKS = [
  { titleKey: "public.home", href: "/", icon: Home },
  { titleKey: "public.blog", href: "/blog", icon: Newspaper },
  { titleKey: "public.docs", href: "/docs", icon: BookOpen },
];

function DashboardGlobalSearch() {
  const t = useTranslations("DashboardHeader");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<DashboardSearchItemResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const query = keyword.trim();
    if (!query) {
      setResults([]);
      setLoading(false);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchError(null);
      try {
        const res = await searchDashboard({ keyword: query, scope: "dashboard" });
        if (!cancelled) {
          setResults(res.data.records ?? []);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setSearchError(t("searchFailed"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [keyword, t]);

  const showPanel = open && keyword.trim().length > 0;

  return (
    <div className="relative hidden w-72 xl:block">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="h-9 pl-8 pr-3 text-xs shadow-none focus-visible:ring-1"
        placeholder={t("quickSearch")}
      />
      {showPanel && (
        <div className="absolute left-0 top-11 z-50 w-[24rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
          <div className="border-b border-border/70 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
            {t("searchResults")}
          </div>
          <div className="max-h-80 overflow-y-auto p-1.5">
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("searchLoading")}
              </div>
            ) : searchError ? (
              <div className="px-3 py-4 text-xs text-destructive">{searchError}</div>
            ) : results.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">{t("searchEmpty")}</div>
            ) : (
              results.map((item) => (
                <Button
                  key={`${item.type}-${item.href}-${item.title}`}
                  asChild
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-lg px-3 py-2 text-left"
                >
                  <Link href={item.href || "/dashboard"} onClick={() => setOpen(false)}>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs font-semibold text-foreground">
                          {item.title}
                        </span>
                        <Badge variant="secondary" className="shrink-0 rounded-full px-1.5 py-0 text-[10px]">
                          {item.type || t("searchTypeFallback")}
                        </Badge>
                      </span>
                      {item.description && (
                        <span className="truncate text-[11px] font-normal text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </Button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDashboardNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("DashboardHeader");
  const navT = useTranslations("DashboardNav");

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground lg:hidden"
          aria-label={t("openDashboardNav")}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col p-0 lg:hidden [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{t("dashboardNavTitle")}</SheetTitle>
        <SheetDescription className="sr-only">{t("dashboardNavDescription")}</SheetDescription>

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-black">
              <Image
                src="/images/webcal_console_icon.png"
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="truncate text-lg font-bold tracking-tight">{navT("brand")}</span>
          </Link>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label={t("closeDashboardNav")}
              onClick={closeMenu}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-none">
          <DashboardNavGroups onNavigate={closeMenu} itemClassName="h-11 text-sm" />
        </nav>

        <div className="border-t border-border/50 p-4">
          <p className="text-center text-[10px] font-medium uppercase tracking-tighter text-muted-foreground/40">
            Cloud Compute Platform v0.1
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [theme, setTheme] = useState<string>("dark");
  const [hasUnread, setHasUnread] = useState(false);
  const [languageDrawerOpen, setLanguageDrawerOpen] = useState(false);
  const [desktopLanguageOpen, setDesktopLanguageOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = normalizeLocale(useLocale());
  const t = useTranslations("DashboardHeader");
  const navT = useTranslations("DashboardNav");

  useEffect(() => {
    let mounted = true;
    
    // Fetch user info
    getCurrentUser()
      .then((res) => {
        if (mounted && (res.code === 200 || res.code === 0)) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    // Check for unread notifications
    const checkUnread = async () => {
      try {
        const res = await getUserNotifications({ read_status: 0, pageSize: 1 });
        if (mounted) setHasUnread(res.data.total > 0);
      } catch (err) {
        // Silently ignore notification check errors
      }
    };
    
    checkUnread();
    
    // Refresh unread count occasionally or on route change if needed
    // For now, just on mount is fine.
    
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
        
      checkUnread();
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

  const switchLocale = (nextLocale: AppLocale) => {
    setLanguageDrawerOpen(false);
    if (nextLocale === locale) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("language");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: nextLocale });
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
    <>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <MobileDashboardNav />
        <h1 className="truncate text-lg font-semibold tracking-tight">{getPageTitle()}</h1>
        <div className="hidden h-8 w-px bg-border/50 xl:block" />
        <DashboardGlobalSearch />
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

        <div className="hidden h-8 w-px bg-border lg:block" />

        <div className="ml-2 flex items-center">
          <DropdownMenu onOpenChange={(nextOpen) => {
            if (!nextOpen) setDesktopLanguageOpen(false);
          }}>
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
              <DropdownMenuSeparator className="lg:hidden" />
              {PUBLIC_HEADER_LINKS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="cursor-pointer lg:hidden">
                  <Link href={item.href} className="flex w-full items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {t(item.titleKey)}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setLanguageDrawerOpen(true)}
                className="cursor-pointer lg:hidden"
              >
                <Languages className="mr-2 h-4 w-4" />
                <span className="flex-1">{t("language")}</span>
                <span className="text-xs text-muted-foreground">{localeLabels[locale]}</span>
                <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setDesktopLanguageOpen((value) => !value);
                }}
                className="hidden cursor-pointer lg:flex"
              >
                <Languages className="mr-2 h-4 w-4" />
                <span className="flex-1">{t("language")}</span>
                <span className="text-xs text-muted-foreground">{localeLabels[locale]}</span>
                <ChevronRight
                  className={cn(
                    "ml-1 h-4 w-4 text-muted-foreground transition-transform",
                    desktopLanguageOpen && "rotate-90",
                  )}
                />
              </DropdownMenuItem>
              {desktopLanguageOpen && (
                <div className="hidden px-2 pb-1.5 pt-1 lg:block">
                  <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/35 p-1 shadow-inner animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-200 motion-reduce:animate-none">
                    {locales.map((item) => {
                      const isActive = item === locale;

                      return (
                        <Button
                          key={item}
                          type="button"
                          variant="ghost"
                          className={cn(
                            "group h-8 w-full justify-between rounded-md px-2.5 text-xs font-medium transition-all duration-200 ease-out",
                            isActive
                              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                              : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                          )}
                          onClick={() => switchLocale(item)}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-200",
                                isActive
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-transparent group-hover:text-muted-foreground",
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="truncate">{localeLabels[item]}</span>
                          </span>
                          {isActive && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {t("currentLanguage")}
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === "dark" ? t("switchToLightTheme") : t("switchToDarkTheme")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/notifications" className="flex w-full items-center">
                  <span className="relative mr-2 flex h-4 w-4 items-center justify-center">
                    <Bell className="h-4 w-4" />
                    {hasUnread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                  {navT("items.notifications")}
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
    <Drawer open={languageDrawerOpen} onOpenChange={setLanguageDrawerOpen}>
      <DrawerContent className="w-full">
        <DrawerHeader className="px-6 text-left">
          <DrawerTitle>{t("language")}</DrawerTitle>
          <DrawerDescription>{t("languageDrawerDescription")}</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-2 px-6 pb-2">
          {locales.map((item) => (
            <Button
              key={item}
              type="button"
              variant={item === locale ? "secondary" : "ghost"}
              className="h-12 w-full justify-start gap-3 text-base"
              onClick={() => switchLocale(item)}
            >
              <Check className={cn("h-4 w-4", item === locale ? "opacity-100" : "opacity-0")} />
              <span>{localeLabels[item]}</span>
            </Button>
          ))}
        </div>
        <DrawerFooter className="px-6 pb-6">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="h-11">
              {t("cancel")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </>
  );
}
