import { ProgressBar } from "@/components/progress-bar";
import type { StudentCoursePageCard } from "@/fake-db/dashboards";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

type CourseCardProps = { course: StudentCoursePageCard };

export function CourseCard({ course }: CourseCardProps) {
  const gradeTone =
    course.gradeNum === null
      ? ""
      : course.gradeNum >= 87
        ? "accent"
        : course.gradeNum >= 70
          ? "warning"
          : "danger";

  return (
    <div className="m-scourse-card">
      <div className="m-scourse-card__head">
        <div
          className="m-scourse-card__chip"
          style={{ color: course.deptColor }}
        >
          {course.deptCode}
        </div>
        <span className="m-scourse-card__code">{course.code}</span>
        {course.grade !== "—" && (
          <span
            className={`m-badge${gradeTone ? ` m-badge--${gradeTone}` : ""}`}
          >
            {course.grade}
          </span>
        )}
        <span className="m-badge">
          {course.status === "active" ? "Active" : course.status}
        </span>
      </div>

      <div className="m-scourse-card__body">
        <div>
          <h3 className="m-scourse-card__title">{course.title}</h3>
          <div className="m-scourse-card__instructor">{course.instructor}</div>
          <div className="m-scourse-card__schedule">
            {course.meetingDisplay}
          </div>
          <div className="m-scourse-card__credits">
            {course.credits} credits · {course.location}
          </div>
        </div>

        <div>
          <div className="m-scourse-card__progress-label">
            <span>
              {course.modulesComplete} of {course.modulesTotal} modules complete
            </span>
            <span>{Math.round(course.progress * 100)}%</span>
          </div>
          <ProgressBar value={course.progress} />
        </div>
      </div>

      <div className="m-scourse-card__foot">
        <span className="m-scourse-card__next">
          <strong>Next · </strong>
          {course.nextDue}
        </span>
        <Link
          href={`/student/courses/${encodeURIComponent(course.code)}`}
          className="m-btn m-btn--primary m-btn--sm"
        >
          <PlayIcon size={12} /> Continue
        </Link>
      </div>
    </div>
  );
}
