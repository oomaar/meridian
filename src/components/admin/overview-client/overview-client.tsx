"use client";

import type { AdminOverviewData } from "@/fake-db/dashboards";
import type { Meta } from "./types/Meta";
import { OverviewThroughput } from "./components/overview-throughput/overview-throughput";
import { OverviewTasks } from "./components/overview-tasks/overview-tasks";
import { semesterMeta } from "./helpers/semesterMeta";
import { OverviewBanner } from "./components/overview-banner";
import { DEPT_COLORS } from "./data/DEPT_COLORS";
import { OverviewHeader } from "./components/overview-header";
import { OverviewAnnouncements } from "./components/overview-announcements";
import { OverviewStats } from "./components/overview-stats/overview-stats";
import { OverviewEnrollmentDepartment } from "./components/overview-enrollment-department";
import { OverviewLiveActivity } from "./components/overview-live-activity";
import { OverviewCourses } from "./components/overview-courses";

type OverviewClientProps = { data: AdminOverviewData };

export function OverviewClient({ data }: OverviewClientProps) {
  const {
    activeSemester,
    analytics,
    totals,
    submissionsLast7d,
    throughputByWindow,
    departmentLoad,
    recentActivity,
  } = data;

  const meta: Meta = activeSemester ? semesterMeta(activeSemester) : null;

  const deptBars = departmentLoad
    .filter((d) => d.totalStudents > 0)
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 8)
    .map((d) => ({
      l: d.departmentCode,
      v: d.totalStudents,
      color: DEPT_COLORS[d.departmentCode] ?? "var(--m-accent)",
    }));

  return (
    <>
      <OverviewHeader
        analytics={analytics}
        meta={meta}
        activeSemester={activeSemester}
      />
      <div className="m-page__body">
        <div className="m-stack">
          {activeSemester && meta && (
            <OverviewBanner
              meta={meta}
              totals={totals}
              activeSemester={activeSemester}
            />
          )}
          <OverviewStats
            totals={totals}
            submissionsLast7d={submissionsLast7d}
          />
          <div className="m-grid m-grid-2-1">
            <OverviewThroughput
              windows={throughputByWindow}
              submissionsLast7d={submissionsLast7d}
            />
            <OverviewTasks />
          </div>
          <div className="m-grid m-grid-2-1">
            <OverviewEnrollmentDepartment
              deptBars={deptBars}
              sem={activeSemester}
            />
            <OverviewLiveActivity recentActivity={recentActivity} />
          </div>
          <div className="m-grid m-grid-2">
            <OverviewCourses />
            <OverviewAnnouncements />
          </div>
        </div>
      </div>
    </>
  );
}
