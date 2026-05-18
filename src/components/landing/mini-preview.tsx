import {
  db,
  generateRecentActivity,
  generateSemesterAnalytics,
  generateSubmissionsLast7d,
  generateSubmissionThroughput,
  getActiveSemester,
  NOW,
} from "@/fake-db";
import { AreaChart } from "./area-chart";

const SIDEBAR_ITEMS = [
  "Overview",
  "Activity",
  "Courses",
  "Students",
  "Instructors",
  "Semesters",
  "Users",
];

function relTime(iso: string): string {
  const diffMs = NOW.getTime() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function MiniPreview({ compact = false }: { compact?: boolean }) {
  const trend = generateSubmissionThroughput(12);
  const recent = generateRecentActivity(3);
  const submissions7d = generateSubmissionsLast7d();
  const activeSemester = getActiveSemester();
  const openAssignments = activeSemester
    ? generateSemesterAnalytics(activeSemester.id).openAssignmentsCount
    : 0;

  return (
    <div
      className={`m-mini-preview${compact ? " m-mini-preview--compact" : ""}`}
    >
      {/* mini sidebar */}
      <div className="m-mini-preview__sidebar">
        <div className="m-mini-preview__brand">
          <div className="m-brand-mark">M</div>
          <span className="m-mini-preview__brand-name">Meridian</span>
        </div>
        {SIDEBAR_ITEMS.map((l, i) => (
          <div
            key={l}
            className={
              "m-mini-preview__nav-item" +
              (i === 0 ? " m-mini-preview__nav-item--active" : "")
            }
          >
            {l}
          </div>
        ))}
      </div>

      {/* mini main */}
      <div>
        <div className="m-mini-preview__header">
          <div>
            <div className="m-mini-preview__eyebrow">
              SPRING 2026 · FINALS WEEK
            </div>
            <div className="m-mini-preview__greeting">
              Good afternoon, Ines.
            </div>
          </div>
          <div className="m-mini-preview__cta">+ New course</div>
        </div>

        <div className="m-mini-preview__stats">
          {[
            { k: "Enrollment", v: db.students.length.toLocaleString() },
            { k: "Submissions 7d", v: submissions7d.toLocaleString() },
            { k: "Avg. turnaround", v: "38h" },
            { k: "Open assignments", v: openAssignments.toLocaleString() },
          ].map((s) => (
            <div key={s.k} className="m-mini-preview__stat">
              <div className="m-mini-preview__stat-label">{s.k}</div>
              <div className="m-mini-preview__stat-value">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="m-mini-preview__panel">
          <div className="m-mini-preview__panel-label">
            SUBMISSION THROUGHPUT · 12 WEEKS
          </div>
          <AreaChart data={trend} height={compact ? 110 : 140} />
        </div>

        {!compact && (
          <div className="m-mini-preview__panel m-mini-preview__panel--feed">
            <div className="m-mini-preview__panel-label">LIVE ACTIVITY</div>
            {recent.map((it) => (
              <div key={it.id} className="m-mini-preview__feed-row">
                <span className="m-mini-preview__feed-dot" />
                <span className="m-mini-preview__feed-body">{it.body}</span>
                <span className="m-mini-preview__feed-time">
                  {relTime(it.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
