import { Fragment } from "react/jsx-runtime";
import { SCHEDULE_HOURS } from "./data/SCHEDULE_HOURS";
import { SCHEDULE_DAYS } from "./data/SCHEDULE_DAYS";
import { StudentScheduleEvent } from "@/fake-db/dashboards";

type ScheduleProps = {
  scheduleEvents: StudentScheduleEvent[];
};

export function Schedule({ scheduleEvents }: ScheduleProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">This week</span>
      </div>
      <div className="m-card__body">
        <div className="m-schedule">
          <div />
          {SCHEDULE_DAYS.map((d) => (
            <div key={d} className="m-schedule__head">
              {d}
            </div>
          ))}
          {SCHEDULE_HOURS.map((h, r) => (
            <Fragment key={h}>
              <div className="m-schedule__hour">
                {h}
                {r > 3 ? "p" : "a"}
              </div>
              {Array.from({ length: 5 }).map((_, c) => {
                const ev = scheduleEvents.find(
                  (e) => e.row === r && e.col === c,
                );
                return (
                  <div key={c} className="m-schedule__cell">
                    {ev && (
                      <div
                        className={`m-schedule__event${ev.tone ? ` m-schedule__event--${ev.tone}` : ""}`}
                      >
                        <b>{ev.course}</b>
                        <span>
                          {ev.displayTime} · {ev.location}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
