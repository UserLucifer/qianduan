import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "算力租赁前端",
  description: "基于 Next.js 的算力租赁前端项目骨架。",
};

const themeScript = `
  (function () {
    try {
      const storageKey = "theme";
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (e) {
      console.error("Theme script failed", e);
    }
  })();
`;

import { CustomerService } from "@/components/CustomerService";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-theme="light"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head />
      <body>
        <Script
          id="theme-strategy"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {children}
        <CustomerService />
      </body>
    </html>
  );
}
