'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from "./theme-toggle";
import ProductMegaMenu from "./ProductMegaMenu";
import UseCaseMegaMenu from "./UseCaseMegaMenu";
import CompanyMegaMenu from "./CompanyMegaMenu";
import SolutionsMegaMenu from "./SolutionsMegaMenu";
import { getCurrentUser, type UserMeResponse } from "@/api/user";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { getAvatarUrl } from "@/lib/avatars";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { useRouter } from "next/navigation";

const navigationItems = [
  { name: "博客", href: "/blog" },
  { name: "帮助中心", href: "/help-center" },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user info on mount
  useEffect(() => {
    const token = localStorage.getItem("user_access_token") || localStorage.getItem("accessToken");
    if (token) {
      getCurrentUser()
        .then((res) => {
          if (res.code === 200 || res.code === 0) {
            setUser(res.data);
          }
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("accessToken");
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
    }, 200); // Small delay to prevent accidental closing
  };

  const handleToggle = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <header className="site-header z-[100] bg-background/95 backdrop-blur sticky top-0" ref={headerRef}>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" onClick={() => setActiveMenu(null)}>
          算力租赁
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {/* Products */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: 'static' }}
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === 'products' ? 'is-active' : ''}`}
              onClick={() => handleToggle('products')}
            >
              产品
            </button>
            <AnimatePresence>
              {activeMenu === 'products' && <ProductMegaMenu />}
            </AnimatePresence>
          </div>

          {/* Use Cases */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: 'static' }}
            onMouseEnter={() => handleMouseEnter('use-cases')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === 'use-cases' ? 'is-active' : ''}`}
              onClick={() => handleToggle('use-cases')}
            >
              产品用例
            </button>
            <AnimatePresence>
              {activeMenu === 'use-cases' && <UseCaseMegaMenu />}
            </AnimatePresence>
          </div>

          {/* Solutions */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: 'static' }}
            onMouseEnter={() => handleMouseEnter('solutions')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === 'solutions' ? 'is-active' : ''}`}
              onClick={() => handleToggle('solutions')}
            >
              解决方案
            </button>
            <AnimatePresence>
              {activeMenu === 'solutions' && <SolutionsMegaMenu />}
            </AnimatePresence>
          </div>

          <Link href="/rental" className="site-nav__link">
            租赁
          </Link>

          {/* Company */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
            style={{ position: 'static' }}
            onMouseEnter={() => handleMouseEnter('company')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === 'company' ? 'is-active' : ''}`}
              onClick={() => handleToggle('company')}
            >
              公司
            </button>
            <AnimatePresence>
              {activeMenu === 'company' && <CompanyMegaMenu />}
            </AnimatePresence>
          </div>

          {navigationItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="site-nav__link"
              onMouseEnter={() => setActiveMenu(null)}
            >
              {item.name}
            </Link>
          ))}
        </nav>


        <div className="site-header__controls">
          <ThemeToggle />
          {user ? (
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
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-background shadow-xl py-1 z-[110]"
                  >
                    <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-sm font-bold text-foreground truncate mt-0.5">
                        {user.userName || "未命名用户"}
                      </p>
                    </div>
                    
                    <Link 
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      控制面板
                    </Link>
                    
                    <Link 
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      账户设置
                    </Link>

                    <div className="h-px bg-border/50 my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="auth-signup">
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
