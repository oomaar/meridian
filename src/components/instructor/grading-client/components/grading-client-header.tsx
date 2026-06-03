import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReleaseState } from "../types/ReleaseState";

type GradingClientHeaderProps = {
  selected: InstructorGradingQueueItem;
  gradedCountLocal: number;
  queueCountLocal: number;
  goPrev(): void;
  goNext(): void;
  selectedIdx: number;
  queue: InstructorGradingQueueItem[];
  handleReleaseGrade(): void;
  isReleased: boolean;
  releaseState: ReleaseState;
};

export function GradingClientHeader({
  selected,
  gradedCountLocal,
  queueCountLocal,
  goPrev,
  goNext,
  selectedIdx,
  queue,
  handleReleaseGrade,
  isReleased,
  releaseState,
}: GradingClientHeaderProps) {
  return (
    <div className="m-page__header m-page__header--compact">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Faculty · Grading</span>
        <h1 className="m-page__h">{selected.assignmentTitle}</h1>
        <div className="m-grading-header-meta">
          <span className="m-mono">{selected.courseCode}</span>
          <span>·</span>
          <span>
            {gradedCountLocal} of {queueCountLocal} graded
          </span>
          <span>·</span>
          <span className="m-badge m-badge--warning">{selected.dueLabel}</span>
        </div>
      </div>
      <div className="m-page__actions">
        <button className="m-btn" onClick={goPrev} disabled={selectedIdx === 0}>
          <ChevronLeftIcon size={14} /> Prev
        </button>
        <button
          className="m-btn"
          onClick={goNext}
          disabled={selectedIdx === queue.length - 1}
        >
          Next <ChevronRightIcon size={14} />
        </button>
        <button
          className="m-btn m-btn--primary"
          onClick={handleReleaseGrade}
          disabled={isReleased || releaseState !== "idle"}
        >
          <CheckIcon size={14} /> Save &amp; next
        </button>
      </div>
    </div>
  );
}
