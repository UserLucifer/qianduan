"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

import { SysConfigProvider } from "@/app/contexts/SysConfigContext";
import { AdminAuthProvider } from "@/app/contexts/AdminAuthContext";

type AdminTheme = "light" | "dark";

function getSavedAdminTheme(): AdminTheme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("adminTheme") === "dark" ? "dark" : "light";
}

function applyAdminTheme(theme: AdminTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.adminTheme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admins/login";

  useEffect(() => {
    applyAdminTheme(getSavedAdminTheme());
  }, []);

  const content = isLoginPage ? (
    <>{children}</>
  ) : (
    <div className="admin-shell flex min-h-screen selection:bg-[#5e6ad2]/30">
      <AdminSidebar />
      <div className="relative flex-1 pl-64">
        <AdminHeader />
        <main className="admin-main min-h-[calc(100vh-64px)] p-8">{children}</main>
      </div>
    </div>
  );

  return (
    <SysConfigProvider>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Hide Salesmartly customer service widget on all admin related pages */
        #salesmartly-iframe-container,
        .salesmartly-widget,
        .salesmartly-messenger,
        [id^="ss-"],
        [class^="ss-"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        :root {
          --admin-bg: #08090a;
          --admin-panel: rgba(15, 16, 17, 0.88);
          --admin-panel-strong: rgba(24, 24, 27, 0.94);
          --admin-panel-soft: rgba(255, 255, 255, 0.04);
          --admin-text: #f7f8f8;
          --admin-muted: #8a8f98;
          --admin-subtle: #5b616b;
          --admin-border: rgba(255, 255, 255, 0.08);
          --admin-hover: rgba(255, 255, 255, 0.06);
          --admin-active: rgba(94, 106, 210, 0.16);
          --admin-brand: #5e6ad2;
          --admin-brand-soft: #9aa2ff;
        }


        :root[data-admin-theme="light"] {
          --admin-bg: #F8FAFC;
          --admin-panel: #FFFFFF;
          --admin-panel-strong: #FFFFFF;
          --admin-panel-soft: #F9FAFB;
          --admin-text: #0F172A;
          --admin-muted: #64748B;
          --admin-subtle: #94A3B8;
          --admin-border: #E2E8F0;
          --admin-hover: #F1F5F9;
          --admin-active: rgba(37, 99, 235, 0.08);
          --admin-brand: #2563EB;
          --admin-brand-soft: #60A5FA;
        }

        .admin-card {
          background: var(--admin-panel);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02);
        }

        :root[data-admin-theme="dark"] .admin-card {
          box-shadow: none;
        }


        .admin-shell {
          background:
            radial-gradient(circle at 88% 4%, rgba(94, 106, 210, 0.12), transparent 34rem),
            radial-gradient(circle at 8% 92%, rgba(14, 165, 233, 0.06), transparent 28rem),
            var(--admin-bg);
          color: var(--admin-text);
          transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :root[data-admin-theme="light"] .admin-shell {
          background:
            radial-gradient(circle at 86% 2%, rgba(94, 106, 210, 0.14), transparent 32rem),
            radial-gradient(circle at 8% 92%, rgba(14, 165, 233, 0.09), transparent 28rem),
            var(--admin-bg);
        }

        .admin-sidebar,
        .admin-header,
        .admin-user-chip,
        .admin-nav-item,
        .admin-search,
        .admin-brand-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-sidebar,
        .admin-header,
        .admin-user-chip {
          border-color: var(--admin-border);
          background: var(--admin-panel);
          color: var(--admin-text);
        }

        .admin-main {
          background: transparent;
        }

        .admin-muted {
          color: var(--admin-muted);
          transition: color 0.4s ease;
        }

        .admin-subtle {
          color: var(--admin-subtle);
          transition: color 0.4s ease;
        }

        .admin-icon-button {
          color: var(--admin-muted);
        }

        .admin-icon-button:hover {
          background: var(--admin-hover);
          color: var(--admin-text);
        }

        .admin-search {
          border-color: var(--admin-border);
          background: var(--admin-panel-soft);
          color: var(--admin-text);
        }

        .admin-search::placeholder {
          color: var(--admin-subtle);
        }

        .admin-search:focus {
          border-color: rgba(94, 106, 210, 0.62);
        }

        .admin-brand-card {
          border-color: var(--admin-border);
          background: var(--admin-brand);
          box-shadow: 0 0 30px rgba(94, 106, 210, 0.28);
        }

        .admin-nav-item {
          color: var(--admin-muted);
        }

        .admin-nav-item:hover {
          background: var(--admin-hover);
          color: var(--admin-text);
        }

        .admin-nav-item[data-active="true"] {
          background: var(--admin-active);
          color: var(--admin-text);
          box-shadow: inset 0 0 0 1px var(--admin-border);
        }

        .admin-nav-icon {
          color: var(--admin-subtle);
        }


        .admin-nav-item:hover .admin-nav-icon,
        .admin-nav-item[data-active="true"] .admin-nav-icon {
          color: var(--admin-brand-soft);
        }

        /* View Transition API optimization */
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }

        ::view-transition-old(root) {
          z-index: 1;
        }

        ::view-transition-new(root) {
          z-index: 2;
          animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
        }}
      />
      <AdminAuthProvider>
        {content}
      </AdminAuthProvider>
    </SysConfigProvider>
  );
}

