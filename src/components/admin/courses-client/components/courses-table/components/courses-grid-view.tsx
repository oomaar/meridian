import { ProgressBar } from "@/components/progress-bar";
import { RowMenu } from "./row-menu";
import { StatusBadge } from "./status-badge";
import { useRouter } from "next/navigation";
import { AdminCourseRow } from "@/fake-db/dashboards";

type CoursesGridViewProps = {
  displayed: AdminCourseRow[];
  deleteRow(id: string): void;
};

export function CoursesGridView({
  displayed,
  deleteRow,
}: CoursesGridViewProps) {
  const router = useRouter();

  return (
    <div className="m-course-grid">
      {displayed.map((c) => (
        <div
          key={c.id}
          className="m-card m-table__row-link"
          onClick={() => router.push(`/admin/courses/${c.code}`)}
        >
          <div
            className="m-course-banner"
            style={{
              background: `linear-gradient(135deg, ${c.deptColor}30, ${c.deptColor}08)`,
            }}
          >
            <span
              className="m-course-banner__code"
              style={{ color: c.deptColor }}
            >
              {c.code}
            </span>
            <span className="m-spacer" />
            <StatusBadge status={c.status} />
            <div onClick={(e) => e.stopPropagation()}>
              <RowMenu courseCode={c.code} onDelete={() => deleteRow(c.id)} />
            </div>
          </div>
          <div className="m-course-banner__body">
            <div className="m-course-card__title">{c.title}</div>
            <div className="m-course-card__meta">
              Prof. {c.instructorName} · {c.credits} cr.
            </div>
            <div className="m-cap-cell m-mt-6">
              <ProgressBar value={c.enrolled / c.cap} />
              <span className="m-cap-cell__label">
                {c.enrolled}/{c.cap}
              </span>
            </div>
            <div className="m-course-card__tags m-mt-4">
              <span className="m-badge">{c.modality}</span>
              {c.ungraded > 10 && (
                <span className="m-badge m-badge--warning">
                  {c.ungraded} ungraded
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
