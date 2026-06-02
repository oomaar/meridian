"use client";

import { useEffect, useState } from "react";
import { ONE_YEAR } from "../apperance-tab";

export function ApperanceTabTheme() {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "dark";
    return (
      (document.documentElement.dataset.theme as
        | "light"
        | "dark"
        | undefined) ?? "dark"
    );
  });

  useEffect(() => {
    const effective =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.dataset.theme = effective;
    document.cookie = `meridian_theme=${effective}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, [theme]);

  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Theme</h3>
      </div>
      <p className="m-settings-description">
        Choose your default appearance. You can switch from the topbar at any
        time.
      </p>
      <div className="m-theme-selector">
        {(["light", "dark", "system"] as const).map((mode) => (
          <button
            key={mode}
            className={`m-theme-option ${theme === mode ? "m-theme-option--active" : ""}`}
            onClick={() => setThemeState(mode)}
          >
            <div className={`m-theme-preview m-theme-preview--${mode}`} />
            <span className="m-theme-label">{mode}</span>
            {theme === mode && <span className="m-theme-badge">Current</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
