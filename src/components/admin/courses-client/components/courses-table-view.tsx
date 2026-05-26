import { ProgressBar } from "@/components/progress-bar";
import { AdminCourseRow } from "@/fake-db/dashboards";
import { truncateString } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CoursesViewsStatusBadge } from "./courses-views-status-badge";
import { CoursesViewsRowMenu } from "./courses-views-row-menu";

type CoursesTableViewProps = {
  displayed: AdminCourseRow[];
  deleteRow(id: string): void;
};

export function CoursesTableView({
  displayed,
  deleteRow,
}: CoursesTableViewProps) {
  const router = useRouter();

  return (
    <table className="m-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Title</th>
          <th>Instructor</th>
          <th>Modality</th>
          <th className="m-num">Enrolled</th>
          <th>Capacity</th>
          <th className="m-num">Avg.</th>
          <th className="m-num">Ungraded</th>
          <th>Status</th>
          <th style={{ width: 32 }} />
        </tr>
      </thead>
      <tbody>
        {displayed.map((c) => (
          <tr
            key={c.id}
            className="m-table__row-link"
            onClick={() => router.push(`/admin/courses/${c.code}`)}
          >
            <td className="m-mono">{c.code}</td>
            <td>
              <div className="m-course-title-cell" title={c.title}>
                <span
                  className="m-dept-swatch"
                  style={{ background: c.deptColor }}
                />
                {truncateString(c.title, 32)}
              </div>
            </td>
            <td className="m-td-dim">Prof. {c.instructorName}</td>
            <td>
              <span className="m-badge">{c.modality}</span>
            </td>
            <td className="m-num m-mono">{c.enrolled}</td>
            <td>
              <div className="m-cap-cell">
                <ProgressBar value={c.enrolled / c.cap} />
                <span className="m-cap-cell__label">
                  {c.enrolled}/{c.cap}
                </span>
              </div>
            </td>
            <td className="m-num m-mono">
              {c.avgGrade != null ? c.avgGrade.toFixed(1) : "—"}
            </td>
            <td
              className="m-num m-mono"
              style={{
                color: c.ungraded > 10 ? "var(--m-warning)" : "var(--m-text-2)",
              }}
            >
              {c.ungraded || "—"}
            </td>
            <td>
              <CoursesViewsStatusBadge status={c.status} />
            </td>
            <td onClick={(e) => e.stopPropagation()}>
              <CoursesViewsRowMenu
                courseCode={c.code}
                onDelete={() => deleteRow(c.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
