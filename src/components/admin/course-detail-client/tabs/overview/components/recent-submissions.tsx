import { AdminCourseDTO, AdminCourseSubmission } from "@/fake-db/dashboards";
import { SubBadge } from "../../../components/sub-badge";
import { Avatar } from "../../../components/avatar";

type RecentSubmissionsProps = {
  course: AdminCourseDTO;
  recentSubmissions: AdminCourseSubmission[];
};

export function RecentSubmissions({
  course,
  recentSubmissions,
}: RecentSubmissionsProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Recent submissions</span>
        <span className="m-card__sub">
          {recentSubmissions.length} this week · {course.ungraded} ungraded
        </span>
        <div className="m-spacer" />
        <button className="m-btn m-btn--ghost m-btn--sm">
          Open grading queue
        </button>
      </div>
      <table className="m-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Assignment</th>
            <th>Submitted</th>
            <th className="m-num">Attempt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentSubmissions.map((s) => (
            <tr key={s.id}>
              <td>
                <div className="m-sub-cell">
                  <Avatar name={s.studentName} />
                  <span>{s.studentName}</span>
                </div>
              </td>
              <td className="m-text-2">{s.assignmentTitle}</td>
              <td className="m-mono m-text-3">{s.submittedAt}</td>
              <td className="m-num m-mono">{s.attempts}</td>
              <td>
                <SubBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
