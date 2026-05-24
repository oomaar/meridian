import type { AdminSemesterCard } from "@/fake-db/dashboards";
import { toneFor } from "../helpers/toneFor";

type TimelineProps = {
  semesters: AdminSemesterCard[];
  todayPct: number;
  tlLabels: { label: string; pct: number }[];
};

export function Timeline({ semesters, todayPct, tlLabels }: TimelineProps) {
  return (
    <div className="m-tl-wrap">
      <div className="m-tl-baseline" />
      {tlLabels.map((l) => (
        <div
          key={l.label}
          className="m-tl-tick"
          style={{ left: `${l.pct}%` }}
        />
      ))}
      {tlLabels.map((l) => (
        <div
          key={l.label + "-lbl"}
          className="m-tl-label m-mono"
          style={{ left: `${l.pct}%` }}
        >
          {l.label}
        </div>
      ))}
      {semesters.map((sem) =>
        sem.tlWidth > 0 ? (
          <div
            key={sem.id}
            className={`m-tl-bar m-tl-bar--${toneFor(sem.status)}`}
            style={{ left: `${sem.tlLeft}%`, width: `${sem.tlWidth}%` }}
            title={sem.name}
          >
            {sem.status === "active" && <span className="m-pulse-dot" />}
            <span className="m-tl-bar__label">{sem.name}</span>
          </div>
        ) : null,
      )}
      <div className="m-tl-today" style={{ left: `${todayPct}%` }}>
        <div className="m-tl-today__dot" />
        <div className="m-tl-today__lbl m-mono">Today</div>
      </div>
    </div>
  );
}
