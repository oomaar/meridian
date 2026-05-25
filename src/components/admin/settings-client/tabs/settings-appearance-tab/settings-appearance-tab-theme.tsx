"use client";

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { CardSection } from "../../components/card-section";
import { useEffect, useState } from "react";
import { ONE_YEAR } from "../../settings-client";

export function SettingsAppearanceTabTheme() {
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

  function applyTheme(t: "light" | "dark" | "system") {
    setThemeState(t);
  }

  return (
    <CardSection title="Theme">
      <p className="text-[13px] mb-4 text-m-text-3">
        Choose your default appearance. You can also switch from the topbar at
        any time.
      </p>
      <div className="m-theme-picker">
        {(["light", "dark", "system"] as const).map((m) => (
          <button
            key={m}
            className={`m-theme-option${theme === m ? " m-theme-option--active" : ""}`}
            onClick={() => applyTheme(m)}
          >
            <div className="m-theme-option__preview" data-mode={m}>
              {m === "system" && (
                <>
                  <div className="m-theme-option__half m-theme-option__half--light" />
                  <div className="m-theme-option__half m-theme-option__half--dark" />
                </>
              )}
            </div>
            <div className="m-theme-option__footer">
              {m === "light" && <SunIcon size={12} />}
              {m === "dark" && <MoonIcon size={12} />}
              {m === "system" && <MonitorIcon size={12} />}
              <span className="capitalize">{m}</span>
              {theme === m && (
                <CheckIcon size={11} className="ml-auto text-m-accent" />
              )}
            </div>
          </button>
        ))}
      </div>
    </CardSection>
  );
}
