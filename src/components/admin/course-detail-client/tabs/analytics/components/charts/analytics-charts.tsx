import { ChartsHeader } from "./charts-header";
import { AreaChart } from "@/components/charts/area";
import { ChartsFooter } from "./charts-footer";
import { AdminEngagementDTO } from "@/fake-db/dashboards";

type AnalyticsChartsProps = {
  analyticsRange: "7d" | "12w" | "term";
  setAnalyticsRange: React.Dispatch<
    React.SetStateAction<"7d" | "12w" | "term">
  >;
  analyticsData: AdminEngagementDTO[];
};

export function AnalyticsCharts({
  analyticsData,
  analyticsRange,
  setAnalyticsRange,
}: AnalyticsChartsProps) {
  return (
    <div className="m-card">
      <ChartsHeader
        analyticsRange={analyticsRange}
        setAnalyticsRange={setAnalyticsRange}
      />
      <div className="m-card__body">
        <AreaChart
          data={analyticsData}
          height={180}
          color="var(--m-accent)"
          gradientId="an-eng"
        />
        <ChartsFooter analyticsData={analyticsData} />
      </div>
    </div>
  );
}
