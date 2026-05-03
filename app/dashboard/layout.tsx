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
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
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
