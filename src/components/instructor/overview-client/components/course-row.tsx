import type { InstructorCourseRow } from "@/fake-db/dashboards";
import Link from "next/link";

type CourseRowProps = { course: InstructorCourseRow };

export function CourseRow({ course }: CourseRowProps) {
  return (
    <div className="m-inst-course-row">
      <div className="m-inst-dept-badge">{course.deptAbbr}</div>
      <div className="m-inst-course-row__info">
        <div className="m-inst-course-row__title">{course.title}</div>
        <div className="m-inst-course-row__meta m-mono">
          {course.code} · {course.enrolled} students · {course.modality}
        </div>
      </div>
      <div className="m-inst-course-row__stat">
        <span className="m-inst-course-row__stat-label">UNGRADED</span>
        <b
          className={`m-mono ${course.ungraded > 10 ? "m-inst-course-row__stat-warn" : ""}`}
        >
          {course.ungraded}
        </b>
      </div>
      <div className="m-inst-course-row__stat">
        <span className="m-inst-course-row__stat-label">AVG.</span>
        <b className="m-mono">{course.avgGrade.toFixed(1)}</b>
      </div>
      <Link
        href={`/instructor/courses/${encodeURIComponent(course.code)}`}
        className="m-btn m-btn--sm"
      >
        Open
      </Link>
    </div>
  );
}
