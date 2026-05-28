import { ProgressBar } from "@/components/progress-bar";
import type { AdminCourseDTO } from "@/fake-db/dashboards";

type AtaGlanceProps = {
  course: AdminCourseDTO;
  completionPct: number;
  atRiskCount: number;
};

export function AtaGlance({
  course,
  completionPct,
  atRiskCount,
}: AtaGlanceProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">At a glance</span>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-14">
          <div className="m-stat-row m-stat-row--baseline">
            <span className="m-text-3">Enrollment</span>
            <span className="m-mono">
              <b className="m-stat-num">{course.enrolled}</b>
              <span className="m-stat-denom"> / {course.cap}</span>
            </span>
          </div>
          <ProgressBar value={course.enrolled / course.cap} />
          <hr className="m-rule" />
          <div className="m-stat-row">
            <span className="m-text-3">Avg. grade</span>
            <b className="m-mono">
              {course.avgGrade != null ? course.avgGrade.toFixed(1) : "—"}
            </b>
          </div>
          <div className="m-stat-row">
            <span className="m-text-3">Median completion</span>
            <b className="m-mono">{completionPct}%</b>
          </div>
          <div className="m-stat-row">
            <span className="m-text-3">Ungraded</span>
            <b className="m-mono" style={{ color: "var(--m-warning)" }}>
              {course.ungraded}
            </b>
          </div>
          <div className="m-stat-row">
            <span className="m-text-3">At-risk students</span>
            <b
              className="m-mono"
              style={{
                color: atRiskCount > 3 ? "var(--m-danger)" : "var(--m-text)",
              }}
            >
              {atRiskCount}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
