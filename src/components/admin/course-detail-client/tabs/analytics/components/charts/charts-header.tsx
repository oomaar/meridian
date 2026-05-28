import { Dispatch, SetStateAction } from "react";

type ChartsHeaderProps = {
  analyticsRange: "7d" | "12w" | "term";
  setAnalyticsRange: Dispatch<SetStateAction<"7d" | "12w" | "term">>;
};

export function ChartsHeader({
  analyticsRange,
  setAnalyticsRange,
}: ChartsHeaderProps) {
  return (
    <div className="m-card__head">
      <span className="m-card__title">Weekly engagement</span>
      <span className="m-card__sub">student activity score</span>
      <div className="m-spacer" />
      <div className="m-seg">
        {(["7d", "12w", "term"] as const).map((r) => (
          <button
            key={r}
            aria-pressed={analyticsRange === r}
            onClick={() => setAnalyticsRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
