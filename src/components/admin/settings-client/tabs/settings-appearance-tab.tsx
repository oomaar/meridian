import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CardSection } from "../components/card-section";
import { ONE_YEAR } from "../settings-client";

export function SettingsAppearanceTab() {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "dark";
    return (
      (document.documentElement.dataset.theme as
        | "light"
        | "dark"
        | undefined) ?? "dark"
    );
  });

  const [density, setDensityState] = useState<"comfortable" | "compact">(() => {
    if (typeof window === "undefined") return "comfortable";
    return (
      (document.documentElement.dataset.density as
        | "comfortable"
        | "compact"
        | undefined) ?? "comfortable"
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

  useEffect(() => {
    document.documentElement.dataset.density = density;
    document.cookie = `meridian_density=${density}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, [density]);

  function applyTheme(t: "light" | "dark" | "system") {
    setThemeState(t);
  }
  function applyDensity(d: "comfortable" | "compact") {
    setDensityState(d);
  }

  return (
    <div className="m-grid m-grid-2">
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

      <CardSection title="Density">
        <p className="text-[13px] mb-4 text-m-text-3">
          Comfortable for daily use; compact when reviewing dense rosters.
        </p>
        <div className="m-density-picker">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              className={`m-density-option${density === d ? " m-density-option--active" : ""}`}
              onClick={() => applyDensity(d)}
            >
              <div className="m-density-option__bars">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`m-density-option__bar${density === "compact" ? " mb-0.75" : " mb-1.75"}`}
                  />
                ))}
              </div>
              <div className="m-density-option__label">
                <span>{d}</span>
                {density === d && (
                  <CheckIcon size={11} className="text-m-accent" />
                )}
              </div>
            </button>
          ))}
        </div>
      </CardSection>
    </div>
  );
}
