"use client";

import type { AdminOverviewData } from "@/fake-db/dashboards";
import { ThroughputCard } from "./components/throughput-card/throughput-card";
import { TasksCard } from "./components/tasks-card/tasks-card";
import { semesterMeta } from "./helpers/semesterMeta";
import type { Meta } from "./types/Meta";
import { OverviewBanner } from "./components/overview-banner";
import { DEPT_COLORS } from "./data/DEPT_COLORS";
import { OverviewHeader } from "./components/overview-header";
import { OverviewAnnouncements } from "./components/overview-announcements";
import { OverviewStats } from "./components/overview-stats";
import { OverviewEnrollmentDepartment } from "./components/overview-enrollment-department";
import { OverviewLiveActivity } from "./components/overview-live-activity";
import { OverviewCourses } from "./components/overview-courses";

export function OverviewClient({ data }: { data: AdminOverviewData }) {
  const {
    activeSemester: sem,
    analytics,
    totals,
    submissionsLast7d,
    throughputByWindow,
    departmentLoad,
    recentActivity,
  } = data;

  const meta: Meta = sem ? semesterMeta(sem) : null;

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
      <OverviewHeader analytics={analytics} meta={meta} sem={sem} />
      <div className="m-page__body">
        <div className="m-stack">
          {sem && meta && (
            <OverviewBanner meta={meta} totals={totals} sem={sem} />
          )}
          <OverviewStats
            totals={totals}
            submissionsLast7d={submissionsLast7d}
          />
          <div className="m-grid m-grid-2-1">
            <ThroughputCard
              windows={throughputByWindow}
              submissionsLast7d={submissionsLast7d}
            />
            <TasksCard />
          </div>
          <div className="m-grid m-grid-2-1">
            <OverviewEnrollmentDepartment deptBars={deptBars} sem={sem} />
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
