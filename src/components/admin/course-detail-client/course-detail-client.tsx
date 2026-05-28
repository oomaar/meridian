"use client";

import { useState } from "react";
import type { AdminCourseDetailData } from "@/fake-db/dashboards";
import { Tab } from "./types/Tab";
import { CourseDetailClientHeader } from "./course-detail-client-header";
import { CourseDetailClientTabs } from "./course-detail-client-tabs";
import { Overview } from "./tabs/overview/overview";
import { Modules } from "./tabs/modules/modules";
import { Roster } from "./tabs/roster/roster";
import { Grades } from "./tabs/grades/grades";
import { generateGradesValues } from "./helpers/generateGradesValues";
import { Analytics } from "./tabs/analytics/analytics";
import { Settings } from "./tabs/settings/settings";

type CourseDetailClientProps = { data: NonNullable<AdminCourseDetailData> };

export function CourseDetailClient({ data }: CourseDetailClientProps) {
  const {
    course,
    instructor,
    teachingTeam,
    modules,
    moduleLessons,
    resources,
    recentSubmissions,
    roster,
    engagement,
  } = data;

  const [tab, setTab] = useState<Tab>("overview");

  const {
    computedDist,
    gradeData,
    gradeFailRate,
    gradeMean,
    gradeMedian,
    gradeStdev,
    maxDist,
  } = generateGradesValues(roster);

  const atRiskCount = roster.filter(
    (s) => (s.grade ?? 100) < 70 || s.attendance < 75,
  ).length;
  const completionPct = roster.length
    ? Math.round(
        (roster.reduce(
          (sum, s) => sum + s.submitted / Math.max(1, s.totalAssignments),
          0,
        ) /
          roster.length) *
          100,
      )
    : 0;

  return (
    <>
      <CourseDetailClientHeader course={course} instructor={instructor} />
      <CourseDetailClientTabs
        modules={modules}
        roster={roster}
        tab={tab}
        setTab={setTab}
      />
      <div className="m-page__body">
        {tab === "overview" && (
          <Overview
            course={course}
            modules={modules}
            recentSubmissions={recentSubmissions}
            completionPct={completionPct}
            atRiskCount={atRiskCount}
            engagement={engagement}
            teachingTeam={teachingTeam}
          />
        )}
        {tab === "modules" && (
          <Modules
            modules={modules}
            moduleLessons={moduleLessons}
            resources={resources}
          />
        )}
        {tab === "roster" && <Roster course={course} roster={roster} />}
        {tab === "grades" && (
          <Grades
            grades={{
              gradeData,
              computedDist,
              maxDist,
              gradeMean,
              gradeMedian,
              gradeStdev,
              gradeFailRate,
            }}
          />
        )}
        {tab === "analytics" && (
          <Analytics
            course={course}
            engagement={engagement}
            gradeData={gradeData}
            modules={modules}
            roster={roster}
            atRiskCount={atRiskCount}
            completionPct={completionPct}
          />
        )}
        {tab === "settings" && (
          <Settings course={course} instructor={instructor} />
        )}
      </div>
    </>
  );
}
