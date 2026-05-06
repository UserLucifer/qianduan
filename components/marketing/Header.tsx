"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import ProductMegaMenu from "./ProductMegaMenu";
import UseCaseMegaMenu from "./UseCaseMegaMenu";
import CompanyMegaMenu from "./CompanyMegaMenu";
import SolutionsMegaMenu from "./SolutionsMegaMenu";
import HostingMegaMenu from "./HostingMegaMenu";
import MobileMarketingNav from "./MobileMarketingNav";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { clearUserAuthSession, getUserAccessToken, subscribeUserAuthChanges } from "@/lib/auth-session";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogOut, User } from "lucide-react";

const navigationItems = [
  { titleKey: "blog", href: "/blog" },
  { titleKey: "helpCenter", href: "/help-center" },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const t = useTranslations("MarketingHeader");
  const common = useTranslations("Common");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadUser = () => {
      const token = getUserAccessToken();
      if (!token) {
        setUser(null);
        return;
      }

      getCurrentUser()
        .then((res) => {
          if (mounted && (res.code === 200 || res.code === 0)) {
            setUser(res.data);
          }
        })
        .catch(() => {
          if (mounted) setUser(null);
        });
    };

    loadUser();
    const unsubscribeAuth = subscribeUserAuthChanges((action) => {
      if (action === "logout") {
        setUser(null);
        setUserMenuOpen(false);
        return;
      }

      loadUser();
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, []);

  const handleLogout = () => {
    clearUserAuthSession();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleToggle = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <header className="site-header sticky top-0 z-[100] bg-background/95 backdrop-blur" ref={headerRef}>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand text-foreground transition-colors hover:text-foreground/80" onClick={() => setActiveMenu(null)}>
          {common("brand")}
        </Link>

        <nav className="site-nav !hidden lg:!flex" aria-label={t("mainNav")}>
          <div
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: "static" }}
            onMouseEnter={() => handleMouseEnter("products")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === "products" ? "is-active" : ""}`}
              onClick={() => handleToggle("products")}
            >
              {t("products")}
            </button>
            <AnimatePresence>
              {activeMenu === "products" && <ProductMegaMenu />}
            </AnimatePresence>
          </div>

          <div
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: "static" }}
            onMouseEnter={() => handleMouseEnter("use-cases")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === "use-cases" ? "is-active" : ""}`}
              onClick={() => handleToggle("use-cases")}
            >
              {t("useCases")}
            </button>
            <AnimatePresence>
              {activeMenu === "use-cases" && <UseCaseMegaMenu />}
            </AnimatePresence>
          </div>

          <div
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: "static" }}
            onMouseEnter={() => handleMouseEnter("solutions")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === "solutions" ? "is-active" : ""}`}
              onClick={() => handleToggle("solutions")}
            >
              {t("solutions")}
            </button>
            <AnimatePresence>
              {activeMenu === "solutions" && <SolutionsMegaMenu />}
            </AnimatePresence>
          </div>

          <div
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: "static" }}
            onMouseEnter={() => handleMouseEnter("hosting")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === "hosting" ? "is-active" : ""}`}
              onClick={() => handleToggle("hosting")}
            >
              {t("hosting")}
            </button>
            <AnimatePresence>
              {activeMenu === "hosting" && <HostingMegaMenu />}
            </AnimatePresence>
          </div>

          <Link href="/rental" className="site-nav__link">
            {t("rental")}
          </Link>

          <div
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: "static" }}
            onMouseEnter={() => handleMouseEnter("company")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === "company" ? "is-active" : ""}`}
              onClick={() => handleToggle("company")}
            >
              {t("company")}
            </button>
            <AnimatePresence>
              {activeMenu === "company" && <CompanyMegaMenu />}
            </AnimatePresence>
          </div>

          {navigationItems.map((item) => (
            <Link
              key={item.titleKey}
              href={item.href}
              className="site-nav__link"
              onMouseEnter={() => setActiveMenu(null)}
            >
              {t(item.titleKey)}
            </Link>
          ))}
        </nav>

        <div className="site-header__controls">
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link href="/dashboard" className="auth-console-link">
                  {common("console")}
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center transition-transform hover:scale-105"
                  >
                    <UserAvatar
                      src={getAvatarUrl(user.avatarKey)}
                      name={user.userName}
                      className="h-9 w-9 border border-border shadow-sm"
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-[110] mt-2 w-48 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-xl"
                      >
                        <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
                          <p className="truncate text-xs font-medium text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                            {user.userName || common("unnamedUser")}
                          </p>
                        </div>

                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          {common("accountSettings")}
                        </Link>

                        <div className="my-1 h-px bg-border/50" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-500 transition-colors hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          {common("logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <InteractiveHoverButton
                type="button"
                className="h-9 min-w-[74px] border-border bg-background px-4 text-[0.9rem] font-semibold shadow-[var(--shadow-soft)]"
                onClick={() => router.push("/login")}
              >
                {common("login")}
              </InteractiveHoverButton>
            )}
          </div>
          <LanguageSwitcher />
          <MobileMarketingNav user={user} onLogout={handleLogout} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
