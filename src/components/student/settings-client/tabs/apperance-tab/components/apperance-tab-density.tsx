"use client";

import { useEffect, useState } from "react";
import { ONE_YEAR } from "../apperance-tab";
import { CheckIcon } from "lucide-react";

export function ApperanceTabDensity() {
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
    document.documentElement.dataset.density = density;
    document.cookie = `meridian_density=${density}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, [density]);

  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Density</h3>
      </div>
      <p className="m-settings-description">
        Comfortable for daily use; compact when reviewing dense lists.
      </p>
      <div className="m-density-picker">
        {(["comfortable", "compact"] as const).map((mode) => (
          <button
            key={mode}
            className={`m-density-option ${density === mode ? "m-density-option--active" : ""}`}
            onClick={() => setDensityState(mode)}
          >
            <div className="m-density-option__bars">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`m-density-option__bar m-density-option__bar--${mode}`}
                />
              ))}
            </div>
            <div className="m-density-option__label">
              <span>{mode}</span>
              {density === mode && (
                <CheckIcon size={11} className="m-density-check" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
