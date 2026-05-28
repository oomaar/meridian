import { AreaChart } from "@/components/charts/area";
import type { AdminEngagementDTO } from "@/fake-db/dashboards";

type EngagementProps = {
  engagement: AdminEngagementDTO[];
};

export function Engagement({ engagement }: EngagementProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Engagement trend</span>
        <span className="m-card__sub">12 weeks</span>
      </div>
      <div className="m-card__body">
        <AreaChart
          data={engagement}
          height={140}
          color="var(--m-accent)"
          gradientId="ov-eng"
        />
        <div className="m-mono m-engage-strip">
          <span className="m-text-3">Median attendance</span>
          <b>
            {Math.round(
              engagement.reduce((s, e) => s + e.v, 0) / engagement.length,
            )}
            %
          </b>
        </div>
      </div>
    </div>
  );
}
