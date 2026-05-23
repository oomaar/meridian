import {
  AdminCourseDTO,
  AdminCourseModule,
  AdminCourseRosterRow,
  AdminEngagementDTO,
} from "@/fake-db/dashboards";
import { useState } from "react";
import { Segments } from "./components/segments";
import { ModuleCompletion } from "./components/module-completion";
import { AnalyticsCharts } from "./components/charts/analytics-charts";
import { AnalyticsKPI } from "./components/analytics-kpi";

type AnalyticsProps = {
  roster: AdminCourseRosterRow[];
  modules: AdminCourseModule[];
  engagement: AdminEngagementDTO[];
  course: AdminCourseDTO;
  gradeData: number[];
  atRiskCount: number;
  completionPct: number;
};

export function Analytics({
  roster,
  modules,
  engagement,
  course,
  gradeData,
  atRiskCount,
  completionPct,
}: AnalyticsProps) {
  const [analyticsRange, setAnalyticsRange] = useState<"7d" | "12w" | "term">(
    "12w",
  );

  const onTimePct = Math.round(85 - (gradeData.length % 12));
  const weeklySubmissions = Math.round(
    course.enrolled * 0.6 + (gradeData.length % 20),
  );

  const analyticsData =
    analyticsRange === "7d"
      ? engagement.slice(-2).map((d, i) => ({ l: `D${i * 3 + 1}`, v: d.v }))
      : engagement;

  return (
    <div className="m-stack">
      <AnalyticsKPI
        atRiskCount={atRiskCount}
        completionPct={completionPct}
        onTimePct={onTimePct}
        weeklySubmissions={weeklySubmissions}
      />
      <div className="m-grid m-grid-2-1">
        <AnalyticsCharts
          analyticsData={analyticsData}
          analyticsRange={analyticsRange}
          setAnalyticsRange={setAnalyticsRange}
        />
        <ModuleCompletion modules={modules} />
      </div>
      <Segments roster={roster} />
    </div>
  );
}
