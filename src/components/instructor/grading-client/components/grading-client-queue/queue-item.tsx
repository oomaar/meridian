import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { CheckCheckIcon } from "lucide-react";
import { forwardRef } from "react";

type QueueItemProps = {
  item: InstructorGradingQueueItem;
  active: boolean;
  released: boolean;
  onClick: () => void;
};

export const QueueItem = forwardRef<HTMLButtonElement, QueueItemProps>(
  function QueueItem({ item, active, released, onClick }, ref) {
    return (
      <button
        ref={ref}
        className={`m-grading-queue-item${active ? " m-grading-queue-item--active" : ""}${released ? " m-grading-queue-item--released" : ""}`}
        onClick={onClick}
      >
        <div className="m-grading-queue-item__top">
          <div className="m-avatar m-grading-queue-avatar">
            {item.studentInitials}
          </div>
          <span className="m-grading-queue-item__name">{item.studentName}</span>
          {released ? (
            <CheckCheckIcon
              size={12}
              className="m-grading-queue-item__released"
            />
          ) : item.status === "flagged" ? (
            <span className="m-badge m-badge--warning">!</span>
          ) : item.status === "pending" ? (
            <span className="m-grading-queue-item__dot" />
          ) : null}
        </div>
        <div className="m-grading-queue-item__meta m-mono">
          {item.courseCode} · {item.submittedLabel}
        </div>
      </button>
    );
  },
);
