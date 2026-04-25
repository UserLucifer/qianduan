'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import ThemeToggle from "./theme-toggle";
import ProductMegaMenu from "./ProductMegaMenu";
import UseCaseMegaMenu from "./UseCaseMegaMenu";
import CompanyMegaMenu from "./CompanyMegaMenu";

const navigationItems = [
  { name: "博客", href: "#" },
  { name: "解决方案", href: "#" },
  { name: "行业", href: "#" },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" onClick={() => setActiveMenu(null)}>
          算力租赁
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {/* Products */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
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
            onMouseEnter={() => handleMouseEnter('use-cases')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`site-nav__link nav-dropdown-trigger ${activeMenu === 'use-cases' ? 'is-active' : ''}`}
              onClick={() => handleToggle('use-cases')}
            >
              用例
            </button>
            <AnimatePresence>
              {activeMenu === 'use-cases' && <UseCaseMegaMenu />}
            </AnimatePresence>
          </div>

          {/* Company */}
          <div 
            className="nav-dropdown-wrapper nav-dropdown-wrapper--mega"
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
          <Link href="/login" className="auth-signup">
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}
