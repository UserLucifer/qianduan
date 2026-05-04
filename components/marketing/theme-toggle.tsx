"use client";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="切换明暗主题"
    >
      <svg
        className="theme-icon theme-icon--moon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14.63 3.2a1 1 0 0 1 .82 1.53 7.7 7.7 0 0 0-1.14 4.04c0 4.29 3.47 7.76 7.76 7.76.48 0 .96-.04 1.42-.13a1 1 0 0 1 1.02 1.55A10.8 10.8 0 1 1 14.63 3.2Z"
          fill="currentColor"
        />
      </svg>

      <svg
        className="theme-icon theme-icon--sun"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          d="M12 2.75V5.5M12 18.5v2.75M21.25 12H18.5M5.5 12H2.75M18.54 5.46l-1.95 1.95M7.4 16.6l-1.94 1.94M18.54 18.54l-1.95-1.95M7.4 7.4 5.46 5.46"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
