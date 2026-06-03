import type { InstructorScheduleItem } from "@/fake-db/dashboards";

type ScheduleItemProps = {
  item: InstructorScheduleItem;
  last: boolean;
};

export function ScheduleItem({ item, last }: ScheduleItemProps) {
  return (
    <div className={`m-schedule-item${last ? " m-schedule-item--last" : ""}`}>
      <div
        className={`m-schedule-item__time m-schedule-item__time--${item.tone}`}
      >
        <b>{item.time}</b>
        <span>{item.until}</span>
      </div>
      <div className="m-schedule-item__body">
        <div className="m-schedule-item__label">{item.label}</div>
        <div className="m-schedule-item__loc">{item.location}</div>
      </div>
    </div>
  );
}
