"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem("theme");
      const theme =
        storedTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      console.error("Theme initialization failed", error);
    }
  }, []);

  return null;
}
