"use client";

import { useState } from "react";
import type { SemesterGrades } from "@/fake-db/dashboards";

type GradesClientProps = {
  semesterGrades: SemesterGrades[];
};

export function GradesClient({ semesterGrades }: GradesClientProps) {
  const [activeSemesterId, setActiveSemesterId] = useState(
    semesterGrades[0]?.semesterId || "",
  );

  const activeSemester = semesterGrades.find(
    (s) => s.semesterId === activeSemesterId,
  );

  if (!activeSemester) return null;

  const sortedGrades = [...activeSemester.courses].sort((a, b) => {
    const gradeOrder: Record<string, number> = {
      A: 5,
      "A-": 4.7,
      "B+": 4.3,
      B: 4,
      "B-": 3.7,
      "C+": 3.3,
      C: 3,
      "—": 0,
    };
    const aOrder = gradeOrder[a.grade] ?? 0;
    const bOrder = gradeOrder[b.grade] ?? 0;
    return bOrder - aOrder;
  });

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academic</span>
          <h1 className="m-page__h">Grades</h1>
          <p className="m-page__sub">
            {activeSemester.courses.length} course
            {activeSemester.courses.length !== 1 ? "s" : ""} · GPA{" "}
            {activeSemester.gpa.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="m-page__body">
        {semesterGrades.length > 1 && (
          <div className="m-tabs" role="tablist">
            {semesterGrades.map((sem) => (
              <button
                key={sem.semesterId}
                role="tab"
                className="m-tab"
                aria-selected={activeSemesterId === sem.semesterId}
                data-selected={activeSemesterId === sem.semesterId}
                onClick={() => setActiveSemesterId(sem.semesterId)}
              >
                {sem.semesterName}
              </button>
            ))}
          </div>
        )}

        <div className="m-grades-layout">
          <div className="m-grades-grid">
            {sortedGrades.length > 0 ? (
              sortedGrades.map((grade) => (
                <div key={grade.code} className="m-grade-card">
                  <div className="m-grade-card__header">
                    <div className="m-grade-card__title">
                      <div className="m-grade-card__code">{grade.code}</div>
                      <div className="m-grade-card__name">{grade.title}</div>
                    </div>
                    <div
                      className={`m-grade-card__grade m-grade-card__grade--${
                        grade.gradeNum
                          ? grade.gradeNum >= 90
                            ? "a"
                            : grade.gradeNum >= 80
                              ? "b"
                              : grade.gradeNum >= 70
                                ? "c"
                                : grade.gradeNum >= 60
                                  ? "d"
                                  : "f"
                          : "na"
                      }`}
                    >
                      {grade.grade}
                    </div>
                  </div>
                  <div className="m-grade-card__meta m-mono">
                    <span>{grade.instructor}</span>
                  </div>
                  <div className="m-grade-card__progress">
                    <div className="m-progress-bar">
                      <div
                        className="m-progress-bar__fill"
                        style={{ width: `${grade.progress * 100}%` }}
                      />
                    </div>
                    <span className="m-mono">
                      {Math.round(grade.progress * 100)}% complete
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="m-grades-empty">
                <p>No courses for this semester</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
