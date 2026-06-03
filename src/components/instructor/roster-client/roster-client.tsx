"use client";

import type {
  AdminCourseRosterRow,
  InstructorRosterData,
} from "@/fake-db/dashboards";
import { useState } from "react";
import { RosterHeader } from "./components/roster-header";
import { RosterTable } from "./components/roster-table";

type RosterRow = AdminCourseRosterRow & { courseCode?: string };

type RosterClientProps = { data: InstructorRosterData };

export function RosterClient({ data }: RosterClientProps) {
  const { instructor, semesterName, totalStudents, courses } = data;
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const activeCourse = selectedCourseId
    ? (courses.find((c) => c.id === selectedCourseId) ?? null)
    : null;

  const displayedRoster: RosterRow[] = activeCourse
    ? activeCourse.roster
    : courses.flatMap((c) =>
        c.roster.map((r) => ({ ...r, courseCode: c.code })),
      );

  const headerTitle = activeCourse
    ? `Roster · ${activeCourse.enrolled} of ${activeCourse.cap} enrolled`
    : `Roster · ${totalStudents} students`;

  return (
    <>
      <div className="m-page__header m-page__header--compact">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Faculty · Roster</span>
          <h1 className="m-page__h">{instructor.fullName}</h1>
          <div className="m-grading-header-meta">
            <span>{semesterName}</span>
            <span>·</span>
            <span>{courses.length} courses</span>
            <span>·</span>
            <span>{totalStudents} students</span>
          </div>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-card">
          <RosterHeader title={headerTitle} />
          <div className="m-tabs" role="tablist">
            <button
              role="tab"
              className="m-tab"
              data-selected={!selectedCourseId}
              onClick={() => setSelectedCourseId(null)}
            >
              All
              <span className="m-tab__count">{totalStudents}</span>
            </button>
            {courses.map((c) => (
              <button
                key={c.id}
                role="tab"
                className="m-tab"
                data-selected={selectedCourseId === c.id}
                onClick={() => setSelectedCourseId(c.id)}
              >
                {c.code}
                <span className="m-tab__count">{c.enrolled}</span>
              </button>
            ))}
          </div>
          <RosterTable
            roster={displayedRoster}
            showCourse={!selectedCourseId}
          />
        </div>
      </div>
    </>
  );
}
