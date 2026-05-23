import { AdminCourseRosterRow } from "@/fake-db/dashboards";

type SegmentsProps = {
  roster: AdminCourseRosterRow[];
};

export function Segments({ roster }: SegmentsProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Student performance segments</span>
        <span className="m-card__sub">based on grade and attendance</span>
      </div>
      <div className="m-card__body">
        {(() => {
          const segments = [
            {
              label: "Excellent",
              desc: "Grade ≥ 90 and attendance ≥ 90%",
              color: "var(--m-success)",
              count: roster.filter(
                (s) => (s.grade ?? 0) >= 90 && s.attendance >= 90,
              ).length,
            },
            {
              label: "On track",
              desc: "Grade 70–89 and attendance ≥ 75%",
              color: "var(--m-accent)",
              count: roster.filter(
                (s) =>
                  (s.grade ?? 0) >= 70 &&
                  (s.grade ?? 0) < 90 &&
                  s.attendance >= 75,
              ).length,
            },
            {
              label: "Needs attention",
              desc: "Grade 60–69 or attendance 60–74%",
              color: "var(--m-warning)",
              count: roster.filter(
                (s) =>
                  ((s.grade ?? 100) >= 60 && (s.grade ?? 100) < 70) ||
                  (s.attendance >= 60 && s.attendance < 75),
              ).length,
            },
            {
              label: "At risk",
              desc: "Grade < 60 or attendance < 60%",
              color: "var(--m-danger)",
              count: roster.filter(
                (s) => (s.grade ?? 100) < 60 || s.attendance < 60,
              ).length,
            },
          ];

          const total = Math.max(
            1,
            segments.reduce((s, seg) => s + seg.count, 0),
          );

          return (
            <div className="m-stack m-gap-10">
              {segments.map((seg) => (
                <div key={seg.label} className="m-segment-row">
                  <div
                    className="m-segment-dot"
                    style={{ background: seg.color }}
                  />
                  <div className="m-segment-body">
                    <div className="m-segment-head">
                      <span className="m-segment-label">{seg.label}</span>
                      <span className="m-segment-count m-mono">
                        {seg.count} student{seg.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="m-segment-track">
                      <div
                        className="m-segment-fill"
                        style={{
                          width: `${(seg.count / total) * 100}%`,
                          background: seg.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="m-segment-pct m-mono">
                    {Math.round((seg.count / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
