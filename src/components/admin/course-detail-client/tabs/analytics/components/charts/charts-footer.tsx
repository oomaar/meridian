import type { AdminEngagementDTO } from "@/fake-db/dashboards";

type ChartsFooterProps = {
  analyticsData: AdminEngagementDTO[];
};

export function ChartsFooter({ analyticsData }: ChartsFooterProps) {
  return (
    <div className="m-chart-footer">
      {[
        {
          l: "PEAK",
          v: `W${analyticsData.reduce((b, d, i, a) => (d.v > a[b].v ? i : b), 0) + 1}`,
        },
        {
          l: "AVG",
          v: `${Math.round(analyticsData.reduce((s, d) => s + d.v, 0) / (analyticsData.length || 1))}%`,
        },
        {
          l: "TREND",
          v:
            analyticsData.length > 1 &&
            analyticsData[analyticsData.length - 1].v > analyticsData[0].v
              ? "↑ Rising"
              : "→ Stable",
        },
      ].map((s) => (
        <div key={s.l}>
          <div className="m-chart-stat__label">{s.l}</div>
          <b className="m-mono">{s.v}</b>
        </div>
      ))}
    </div>
  );
}
