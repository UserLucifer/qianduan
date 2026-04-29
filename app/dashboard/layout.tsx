"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors duration-300 dark:bg-[#08090a] dark:text-zinc-100">
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        :root[data-theme="light"] {
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

        :root[data-theme="dark"] .admin-card {
          box-shadow: none;
        }
      `
        }}
      />
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="min-h-[calc(100vh-64px)] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
