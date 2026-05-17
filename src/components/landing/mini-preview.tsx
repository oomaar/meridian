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
      style={{
        background: "var(--m-canvas)",
        padding: 18,
        minHeight: compact ? 380 : 480,
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 14,
      }}
    >
      {/* mini sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            className="m-brand-mark"
            style={{ width: 20, height: 20, fontSize: 12 }}
          >
            M
          </div>
          <span
            style={{
              fontFamily: "var(--m-font-serif)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Meridian
          </span>
        </div>
        {SIDEBAR_ITEMS.map((l, i) => (
          <div
            key={l}
            style={{
              padding: "5px 8px",
              borderRadius: 4,
              fontSize: 11.5,
              background: i === 0 ? "var(--m-elevated)" : "transparent",
              color: i === 0 ? "var(--m-text)" : "var(--m-text-3)",
              borderLeft:
                i === 0 ? "2px solid var(--m-accent)" : "2px solid transparent",
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* mini main */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--m-text-3)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              SPRING 2026 · FINALS WEEK
            </div>
            <div
              style={{
                fontFamily: "var(--m-font-serif)",
                fontSize: 19,
                fontWeight: 500,
              }}
            >
              Good afternoon, Ines.
            </div>
          </div>
          <div
            style={{
              height: 22,
              padding: "0 8px",
              borderRadius: 4,
              background: "var(--m-accent)",
              color: "var(--m-on-accent)",
              display: "flex",
              alignItems: "center",
              fontSize: 10.5,
            }}
          >
            + New course
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {[
            { k: "Enrollment", v: db.students.length.toLocaleString() },
            { k: "Submissions 7d", v: submissions7d.toLocaleString() },
            { k: "Avg. turnaround", v: "38h" },
            { k: "Open assignments", v: openAssignments.toLocaleString() },
          ].map((s) => (
            <div
              key={s.k}
              style={{
                padding: 8,
                background: "var(--m-surface)",
                border: "1px solid var(--m-line)",
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "var(--m-text-3)",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                }}
              >
                {s.k}
              </div>
              <div
                style={{
                  fontFamily: "var(--m-font-serif)",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--m-surface)",
            border: "1px solid var(--m-line)",
            borderRadius: 6,
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              color: "var(--m-text-3)",
              marginBottom: 4,
            }}
          >
            SUBMISSION THROUGHPUT · 12 WEEKS
          </div>
          <AreaChart data={trend} height={compact ? 110 : 140} />
        </div>

        {!compact && (
          <div
            style={{
              marginTop: 12,
              background: "var(--m-surface)",
              border: "1px solid var(--m-line)",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                color: "var(--m-text-3)",
                marginBottom: 6,
              }}
            >
              LIVE ACTIVITY
            </div>
            {recent.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "8px 1fr auto",
                  gap: 8,
                  alignItems: "center",
                  padding: "5px 0",
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 50,
                    background: "var(--m-accent)",
                  }}
                />
                <span
                  style={{
                    color: "var(--m-text-2)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.body}
                </span>
                <span
                  style={{
                    fontFamily: "var(--m-font-mono)",
                    color: "var(--m-text-3)",
                    fontSize: 10,
                  }}
                >
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
