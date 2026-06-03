import type { InstructorCoursesPageData } from "@/fake-db/dashboards";
import Link from "next/link";
import { ActiveCourseCard } from "./components/active-course-card";
import { PastSemesterSection } from "./components/past-semester-section";

type CoursesClientProps = { data: InstructorCoursesPageData };

export function CoursesClient({ data }: CoursesClientProps) {
  const {
    instructor,
    semesterName,
    activeCount,
    totalStudents,
    ungradedTotal,
    courses,
    history,
  } = data;

  return (
    <>
      <div className="m-page__header m-page__header--compact">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Faculty · My Courses</span>
          <h1 className="m-page__h">{instructor.fullName}</h1>
          <div className="m-grading-header-meta">
            <span>{semesterName}</span>
            <span>·</span>
            <span>{activeCount} active</span>
            <span>·</span>
            <span>{totalStudents} students</span>
            <span>·</span>
            <span
              className={
                ungradedTotal > 0 ? "m-badge m-badge--warning" : "m-badge"
              }
            >
              {ungradedTotal} ungraded
            </span>
          </div>
        </div>
        <div className="m-page__actions">
          <Link href="/instructor/grading" className="m-btn m-btn--primary">
            Open grading queue
          </Link>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-stack">
          <div className="m-card">
            <div className="m-card__head">
              <div className="m-card__title">This semester</div>
              <span className="m-card__sub">{semesterName}</span>
            </div>
            {courses.map((course) => (
              <ActiveCourseCard key={course.code} course={course} />
            ))}
          </div>

          {history.length > 0 && (
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">Teaching history</div>
                <span className="m-card__sub">previous semesters</span>
              </div>
              {history.map((semester) => (
                <PastSemesterSection key={semester.name} semester={semester} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
