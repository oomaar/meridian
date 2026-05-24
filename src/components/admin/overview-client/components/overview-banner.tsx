import { ProgressBar } from "@/components/progress-bar";
import { fmtDate } from "../helpers/fmtDate";
import type { Meta } from "../types/Meta";
import type { Semester } from "@/fake-db";

type OverviewBannerProps = {
  meta: Meta;
  totals: {
    students: number;
    instructors: number;
    courses: number;
    activeCourses: number;
  };
  sem?: Semester;
};

export function OverviewBanner({ meta, totals, sem }: OverviewBannerProps) {
  return (
    <div className="m-card">
      <div className="m-sem-banner">
        <div className="m-sem-banner__identity">
          <span className="m-pulse-dot" />
          <div>
            <div className="m-sem-banner__label">Active term</div>
            <div className="m-sem-banner__name">{sem?.name}</div>
          </div>
        </div>
        <div className="m-sem-banner__track">
          <div className="m-sem-banner__dates">
            {sem && <span>{fmtDate(sem.startDate)}</span>}
            {meta && (
              <span>
                Week {meta.weekNumber} of {meta.totalWeeks} ·{" "}
                {Math.round((meta.progress ?? 0) * 100)}%
              </span>
            )}
            {sem && <span>{fmtDate(sem.endDate)}</span>}
          </div>
          <ProgressBar value={meta?.progress ?? 0} lg />
        </div>
        <div className="m-sem-banner__metrics">
          {[
            {
              label: "STUDENTS",
              value: totals.students.toLocaleString(),
            },
            {
              label: "SECTIONS",
              value: totals.courses.toLocaleString(),
            },
            {
              label: "FACULTY",
              value: totals.instructors.toLocaleString(),
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="m-sem-banner__metric-label">{label}</div>
              <div className="m-sem-banner__metric-value">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
