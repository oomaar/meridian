"use client";

import { useEffect, useState } from "react";
import { CardSection } from "../../components/card-section";
import { CheckIcon } from "lucide-react";
import { ONE_YEAR } from "../../settings-client";

export function SettingsAppearanceTabDensity() {
  const [density, setDensityState] = useState<"comfortable" | "compact">(() => {
    if (typeof window === "undefined") return "comfortable";
    return (
      (document.documentElement.dataset.density as
        | "comfortable"
        | "compact"
        | undefined) ?? "comfortable"
    );
  });

  function applyDensity(d: "comfortable" | "compact") {
    setDensityState(d);
  }

  useEffect(() => {
    document.documentElement.dataset.density = density;
    document.cookie = `meridian_density=${density}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, [density]);

  return (
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
  );
}
