import type { StudentDeadlineItem } from "@/fake-db/dashboards";
import { DEADLINE_TONE } from "./data/DEADLINE_TONE";

type UpcomingProps = {
  deadlines: StudentDeadlineItem[];
};

export function Upcoming({ deadlines }: UpcomingProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Upcoming</span>
        <span className="m-card__sub">next 14 days</span>
      </div>
      {deadlines.map((d) => {
        const tone = DEADLINE_TONE[d.type] ?? "";
        return (
          <div key={d.id} className="m-deadline-row">
            <div className="m-deadline-row__date">
              <div className="m-deadline-row__day">{d.dayLabel}</div>
              <div className="m-deadline-row__time m-mono">{d.timeLabel}</div>
            </div>
            <div>
              <div className="m-deadline-row__title">{d.title}</div>
              <div className="m-deadline-row__meta m-mono">
                {d.course} · {d.inLabel}
              </div>
            </div>
            <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
              {d.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
