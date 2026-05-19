"use client";

import { Moon, Sun } from "lucide-react";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.cookie = `meridian_theme=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
  };

  return (
    <button
      type="button"
      className="m-btn m-btn--ghost m-btn--icon"
      onClick={toggle}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <Sun size={14} className="theme-icon-sun" />
      <Moon size={14} className="theme-icon-moon" />
    </button>
  );
}
