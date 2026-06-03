import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { CheckIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type GradingClientViewModalHeaderProps = {
  selected: InstructorGradingQueueItem;
  autoTestPass: number;
  autoTestTotal: number;
  setViewOpen: Dispatch<SetStateAction<boolean>>;
};

export function GradingClientViewModalHeader({
  selected,
  autoTestPass,
  autoTestTotal,
  setViewOpen,
}: GradingClientViewModalHeaderProps) {
  return (
    <div className="m-grading-view-modal__head">
      <div className="m-avatar m-grading-queue-avatar">
        {selected.studentInitials}
      </div>
      <div className="m-grading-view-modal__meta">
        <div className="m-grading-view-modal__name">
          {selected.studentName}
          {selected.late && (
            <span className="m-badge m-badge--danger m-grading-view-modal__late">
              late
            </span>
          )}
        </div>
        <div className="m-grading-view-modal__sub m-mono">
          {selected.assignmentTitle} · {selected.courseCode} ·{" "}
          {selected.submissionId} · attempt {selected.attempt} ·{" "}
          {selected.submittedLabel}
        </div>
      </div>
      <div className="m-grading-view-modal__badges">
        <span className="m-badge m-badge--success">
          <CheckIcon size={10} /> {autoTestPass}/{autoTestTotal} pass
        </span>
        {autoTestTotal - autoTestPass > 0 && (
          <span className="m-badge m-badge--danger">
            {autoTestTotal - autoTestPass} fail
          </span>
        )}
      </div>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={() => setViewOpen(false)}
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
