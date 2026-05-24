import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { COURSES_ATTENTION } from "../data/COURSES_ATTENTION";

export function OverviewCourses() {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <h3 className="m-card__title">Courses needing attention</h3>
        <Link href="/admin/courses" className="m-btn m-btn--ghost m-btn--sm">
          All courses <ArrowUpRightIcon size={12} />
        </Link>
      </div>
      <div className="m-card__body m-card__body--flush">
        <table className="m-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Ungraded</th>
              <th>Avg. lag</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COURSES_ATTENTION.map((r) => (
              <tr key={r.code} className="m-table__row-link">
                <td>
                  <div className="m-table-course">
                    <span className="m-table-course__name">{r.title}</span>
                    <span className="m-table-course__meta">
                      {r.code} · Prof. {r.inst}
                    </span>
                  </div>
                </td>
                <td className="m-mono m-num-tnum">{r.ungraded}</td>
                <td className="m-mono">{r.lag}</td>
                <td>
                  {r.sla ? (
                    <span className="m-badge m-badge--warning">
                      <span className="m-badge__dot" />
                      SLA breach
                    </span>
                  ) : (
                    <span className="m-badge">On track</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
