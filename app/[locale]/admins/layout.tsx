"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
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
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <AdminSidebar />
      <div className="relative flex-1 lg:pl-64">
        <AdminHeader />
        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );

  const adminStyles = (
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
  );

  if (isLoginPage) {
    return (
      <>
        {adminStyles}
        {content}
      </>
    );
  }

  return (
    <SysConfigProvider>
      {adminStyles}
      <AdminAuthProvider>
        {content}
      </AdminAuthProvider>
    </SysConfigProvider>
  );
}
