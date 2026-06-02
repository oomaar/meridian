"use client";

import type { StudentCoursePageCard } from "@/fake-db/dashboards";
import { useState } from "react";
import { OFFICE_HOURS } from "./data/OFFICE_HOURS";
import { GRADING_SCHEMAS } from "./data/GRADING_SCHEMAS";
import { strHash } from "./helpers/strHash";
import { ClockIcon, MailIcon } from "lucide-react";
import { instructorEmail } from "./helpers/instructorEmail";
import { SYLLABUS_POLICIES } from "./data/SYLLABUS_POLICIES";
import { CourseSyllabusSheetHeader } from "./components/course-syllabus-sheet-header";
import { CourseSyllabusSheetCoursePicker } from "./components/course-syllabus-sheet-course-picker";

type CourseSyllabusSheetProps = {
  courses: StudentCoursePageCard[];
  onClose: () => void;
};
export function CourseSyllabusSheet({
  courses,
  onClose,
}: CourseSyllabusSheetProps) {
  const [activeCode, setActiveCode] = useState(courses[0]?.code ?? "");
  const course = courses.find((x) => x.code === activeCode) ?? courses[0];

  if (!course) return null;

  const h = strHash(course.code);
  const officeHours = OFFICE_HOURS[h % OFFICE_HOURS.length];
  const grading = GRADING_SCHEMAS[h % GRADING_SCHEMAS.length];

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <CourseSyllabusSheetHeader onClose={onClose} />
        <CourseSyllabusSheetCoursePicker
          courses={courses}
          activeCode={activeCode}
          setActiveCode={setActiveCode}
        />
        <div className="m-sheet__body">
          <div>
            <div className="m-course-title">{course.title}</div>
            <div className="m-course-meta">
              {course.credits} credit hours · {course.deptCode}
            </div>
          </div>
          <div>
            <div className="m-syllabus-section__label">Instructor</div>
            <div className="m-section-flex m-section-flex--gap-7">
              <div className="m-syllabus-instructor__name">
                {course.instructor}
              </div>
              <div className="m-syllabus-instructor__meta">
                <MailIcon size={13} />
                {instructorEmail(course.instructor)}
              </div>
              <div className="m-syllabus-instructor__meta">
                <ClockIcon size={13} />
                {officeHours}
              </div>
            </div>
          </div>
          <div>
            <div className="m-syllabus-section__label">Schedule</div>
            <div className="m-section-flex m-section-flex--gap-6">
              <div className="m-syllabus-schedule__row">
                <strong>Meetings: </strong>
                {course.meetingDisplay}
              </div>
              <div className="m-syllabus-schedule__row">
                <strong>Location: </strong>
                {course.location}
              </div>
            </div>
          </div>
          <div>
            <div className="m-syllabus-section__label">Grading breakdown</div>
            <div className="m-section-flex m-section-flex--gap-10">
              {grading.map((grade) => (
                <div key={grade.label} className="m-modal-breakdown-row">
                  <div className="m-modal-breakdown-row__label">
                    {grade.label}
                  </div>
                  <div className="m-modal-breakdown-row__track">
                    <div
                      className="m-modal-breakdown-row__fill"
                      style={{
                        width: `${grade.pct}%`,
                        background: grade.color,
                      }}
                    />
                  </div>
                  <div className="m-modal-breakdown-row__pct">{grade.pct}%</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="m-syllabus-section__label">Course policies</div>
            <div className="m-section-flex m-section-flex--gap-16">
              {SYLLABUS_POLICIES.map((p) => (
                <div key={p.title}>
                  <div className="m-syllabus-policy__title">{p.title}</div>
                  <p className="m-syllabus-policy__body">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
