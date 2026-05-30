import { ProgressBar } from "@/components/progress-bar";
import type { StudentCoursePageCard } from "@/fake-db/dashboards";
import { PlayIcon } from "lucide-react";

type CourseCardProps = { course: StudentCoursePageCard };

export function CourseCard({ course: c }: CourseCardProps) {
  const gradeTone =
    c.gradeNum === null
      ? ""
      : c.gradeNum >= 87
        ? "accent"
        : c.gradeNum >= 70
          ? "warning"
          : "danger";

  return (
    <div className="m-scourse-card">
      <div className="m-scourse-card__head">
        <div className="m-scourse-card__chip" style={{ color: c.deptColor }}>
          {c.deptCode}
        </div>
        <span className="m-scourse-card__code">{c.code}</span>
        {c.grade !== "—" && (
          <span
            className={`m-badge${gradeTone ? ` m-badge--${gradeTone}` : ""}`}
          >
            {c.grade}
          </span>
        )}
        <span className="m-badge">
          {c.status === "active" ? "Active" : c.status}
        </span>
      </div>

      <div className="m-scourse-card__body">
        <div>
          <h3 className="m-scourse-card__title">{c.title}</h3>
          <div className="m-scourse-card__instructor">{c.instructor}</div>
          <div className="m-scourse-card__schedule">{c.meetingDisplay}</div>
          <div className="m-scourse-card__credits">
            {c.credits} credits · {c.location}
          </div>
        </div>

        <div>
          <div className="m-scourse-card__progress-label">
            <span>
              {c.modulesComplete} of {c.modulesTotal} modules complete
            </span>
            <span>{Math.round(c.progress * 100)}%</span>
          </div>
          <ProgressBar value={c.progress} />
        </div>
      </div>

      <div className="m-scourse-card__foot">
        <span className="m-scourse-card__next">
          <strong>Next · </strong>
          {c.nextDue}
        </span>
        <button className="m-btn m-btn--primary m-btn--sm">
          <PlayIcon size={12} /> Continue
        </button>
      </div>
    </div>
  );
}
