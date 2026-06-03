import { ProgressBar } from "@/components/progress-bar";
import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import type { AdminCourseRosterRow } from "@/fake-db/dashboards";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { Users } from "lucide-react";

type RosterRow = AdminCourseRosterRow & { courseCode?: string };

type RosterTableProps = {
  roster: RosterRow[];
  showCourse?: boolean;
};

export function RosterTable({ roster, showCourse = false }: RosterTableProps) {
  if (roster.length === 0) {
    return (
      <EmptyState
        icon={Users}
        heading="No students enrolled"
        body="Students will appear here once they enroll in this course."
        size="sm"
      />
    );
  }

  return (
    <table className="m-table">
      <thead>
        <tr>
          <th>Student</th>
          {showCourse && <th>Course</th>}
          <th>ID</th>
          <th>Standing</th>
          <th className="m-num">Grade</th>
          <th className="m-num">Attendance</th>
          <th>Submissions</th>
          <th>Last active</th>
        </tr>
      </thead>
      <tbody>
        {roster.map((s, i) => (
          <tr key={`${s.id}-${i}`}>
            <td>
              <div className="m-sub-cell">
                <Avatar name={s.name} />
                <span>{s.name}</span>
              </div>
            </td>
            {showCourse && <td className="m-mono m-text-2">{s.courseCode}</td>}
            <td className="m-mono">{s.studentNumber}</td>
            <td className="m-text-2">{s.standing}</td>
            <td
              className="m-num m-mono"
              style={{
                color: (s.grade ?? 100) < 70 ? "var(--m-danger)" : "inherit",
              }}
            >
              {s.grade != null ? s.grade.toFixed(1) : "—"}
            </td>
            <td className="m-num">
              <div className="m-attend-cell">
                <span
                  className="m-mono"
                  style={{
                    color: s.attendance < 75 ? "var(--m-warning)" : "inherit",
                  }}
                >
                  {s.attendance}%
                </span>
                <div className="m-progress-wrap--sm">
                  <ProgressBar value={s.attendance / 100} />
                </div>
              </div>
            </td>
            <td className="m-mono m-text-3">
              {s.submitted}/{s.totalAssignments}
            </td>
            <td className="m-mono m-text-3">{s.lastActive}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
