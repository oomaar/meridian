"use client";

import { useState } from "react";
import { BookOpenIcon } from "lucide-react";
import type { StudentCoursesPageData } from "@/fake-db/dashboards";
import { CourseCard } from "./course-card";
import { CourseSyllabusSheet } from "./sheets/course-syllabus-sheet";

type StudentCoursesClientProps = { data: StudentCoursesPageData };

// ── Syllabus sheet ────────────────────────────────────────────────────────────

// ── Page component ────────────────────────────────────────────────────────────

export function StudentCoursesClient({ data }: StudentCoursesClientProps) {
  const { student, semesterLabel, activeCourses, totalCredits, gpa, courses } =
    data;
  const [syllabusOpen, setSyllabusOpen] = useState(false);

  return (
    <>
      {syllabusOpen && (
        <CourseSyllabusSheet
          courses={courses}
          onClose={() => setSyllabusOpen(false)}
        />
      )}

      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">{semesterLabel}</span>
          <h1 className="m-page__h">My Courses</h1>
          <p className="m-page__sub">
            {student.name} · {activeCourses} active this semester
          </p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn" onClick={() => setSyllabusOpen(true)}>
            <BookOpenIcon size={14} /> View syllabus
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-grid m-grid-3 m-courses-stats-mb">
          <div className="m-card m-stat">
            <div className="m-stat__label">Active courses</div>
            <div className="m-stat__value">{activeCourses}</div>
          </div>
          <div className="m-card m-stat">
            <div className="m-stat__label">Term credits</div>
            <div className="m-stat__value">
              {totalCredits}
              <sub>cr</sub>
            </div>
          </div>
          <div className="m-card m-stat">
            <div className="m-stat__label">Current GPA</div>
            <div className="m-stat__value">{gpa.toFixed(2)}</div>
          </div>
        </div>

        <div className="m-grid m-grid-2 m-grid--top">
          {courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>
      </div>
    </>
  );
}
