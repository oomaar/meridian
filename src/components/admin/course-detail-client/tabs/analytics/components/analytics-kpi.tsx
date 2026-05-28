type AnalyticsKPIProps = {
  atRiskCount: number;
  completionPct: number;
  onTimePct: number;
  weeklySubmissions: number;
};

export function AnalyticsKPI({
  atRiskCount,
  completionPct,
  onTimePct,
  weeklySubmissions,
}: AnalyticsKPIProps) {
  return (
    <div className="m-grid m-grid-4">
      {[
        {
          label: "Submissions / week",
          value: weeklySubmissions,
          unit: "",
          delta: "+12 wk/wk",
          up: true,
        },
        {
          label: "Avg completion",
          value: completionPct,
          unit: "%",
          delta: "across all modules",
          up: true,
        },
        {
          label: "On-time rate",
          value: onTimePct,
          unit: "%",
          delta: `${100 - onTimePct}% submitted late`,
          up: onTimePct > 85,
        },
        {
          label: "At-risk students",
          value: atRiskCount,
          unit: "",
          delta: "grade < 70 or attendance < 75%",
          up: atRiskCount === 0,
        },
      ].map((s) => (
        <div key={s.label} className="m-card">
          <div className="m-card__body">
            <div className="m-kpi-card__label">{s.label}</div>
            <div className="m-kpi-card__value">
              {s.value}
              <span className="m-kpi-card__unit">{s.unit}</span>
            </div>
            <div
              className={`m-kpi-card__delta m-kpi-card__delta--${s.up ? "up" : "down"}`}
            >
              {s.delta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
