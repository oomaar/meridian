import type { StudentDeadlineItem } from "@/fake-db/dashboards";
import { DEADLINE_TONE } from "@/components/student/dashboard-client/components/upcoming/data/DEADLINE_TONE";

type DeadlineGroupProps = {
  heading: string;
  deadlines: StudentDeadlineItem[];
};

export function DeadlineGroup({ heading, deadlines }: DeadlineGroupProps) {
  return (
    <div className="m-deadline-group">
      <div className="m-deadline-group__heading">{heading}</div>
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
