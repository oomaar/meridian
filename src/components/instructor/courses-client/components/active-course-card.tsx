import type { InstructorCoursePageItem } from "@/fake-db/dashboards";
import Link from "next/link";
import { GradeDistribution } from "./grade-distribution";

type ActiveCourseCardProps = {
  course: InstructorCoursePageItem;
};

export function ActiveCourseCard({ course }: ActiveCourseCardProps) {
  return (
    <div className="m-course-card">
      <div className="m-course-card__row">
        <div className="m-inst-dept-badge">{course.deptAbbr}</div>
        <div className="m-inst-course-row__info">
          <div className="m-inst-course-row__title">{course.title}</div>
          <div className="m-inst-course-row__meta m-mono">
            {course.code} · {course.enrolled}/{course.cap} enrolled ·{" "}
            {course.modality} · {course.location}
          </div>
        </div>
        <div className="m-inst-course-row__stat">
          <span className="m-inst-course-row__stat-label">UNGRADED</span>
          <b
            className={`m-mono${course.ungraded > 10 ? " m-inst-course-row__stat-warn" : ""}`}
          >
            {course.ungraded}
          </b>
        </div>
        <div className="m-inst-course-row__stat">
          <span className="m-inst-course-row__stat-label">AVG GRADE</span>
          <b className="m-mono">{course.avgGrade}</b>
        </div>
        <div className="m-inst-course-row__stat">
          <span className="m-inst-course-row__stat-label">PASS RATE</span>
          <b className="m-mono">{course.passRate}%</b>
        </div>
        <Link
          href={`/instructor/courses/${encodeURIComponent(course.code)}`}
          className="m-btn m-btn--sm"
        >
          Open
        </Link>
      </div>
      <GradeDistribution bars={course.gradeBars} />
    </div>
  );
}
