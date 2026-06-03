"use client";

import { useState } from "react";
import { useGradingCount } from "@/lib/grading-count-context";
import { buildRubric } from "./helpers/buildRubric";
import { GradingClientHeader } from "./components/grading-client-header";
import { GradingClientQueue } from "./components/grading-client-queue/grading-client-queue";
import { GradingClientSubmissionPreview } from "./components/grading-client-submission-preview";
import { GradingClientRubric } from "./components/grading-client-rubric/grading-client-rubric";
import { GradingClientInstructorComments } from "./components/grading-client-instructor-comments";
import type { DraftState } from "./types/DraftState";
import type { ReleaseState } from "./types/ReleaseState";
import type { InstructorGradingData } from "@/fake-db/dashboards";

export type InstructorCommentsState = {
  draft: DraftState;
  release: ReleaseState;
};

export type FileTabState = {
  activeFileTab: number;
  modalFileTab: number;
};

export function GradingClient({ data }: { data: InstructorGradingData }) {
  const { queue, totalInQueue, gradedCount } = data;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [prevSelectedIdx, setPrevSelectedIdx] = useState(selectedIdx);
  const [releasedIds, setReleasedIds] = useState<Set<string>>(new Set());
  const [instructorCommentsState, setInstructorCommentsState] =
    useState<InstructorCommentsState>({
      draft: "idle",
      release: "idle",
    });
  const [fileTabState, setFileTabState] = useState<FileTabState>({
    activeFileTab: 0,
    modalFileTab: 0,
  });

  const { decrement } = useGradingCount();

  // Reset file tab and comment state when switching submissions
  if (selectedIdx !== prevSelectedIdx) {
    setPrevSelectedIdx(selectedIdx);
    setFileTabState({
      activeFileTab: 0,
      modalFileTab: 0,
    });
    setInstructorCommentsState({
      draft: "idle",
      release: "idle",
    });
  }

  const selected = queue[selectedIdx];
  if (!selected) return null;
  const isReleased = releasedIds.has(selected.id);
  const rubric = buildRubric(selected);

  const gradedCountLocal = gradedCount + releasedIds.size;
  const queueCountLocal = totalInQueue - releasedIds.size;

  function goNext() {
    setSelectedIdx((i) => Math.min(i + 1, queue.length - 1));
  }

  function goPrev() {
    setSelectedIdx((i) => Math.max(i - 1, 0));
  }

  function handleReleaseGrade() {
    setInstructorCommentsState((prev) => ({ ...prev, release: "releasing" }));

    setTimeout(() => {
      setInstructorCommentsState((prev) => ({ ...prev, release: "released" }));
      setReleasedIds((prev) => new Set([...prev, selected.id]));
      decrement();

      setTimeout(() => {
        setInstructorCommentsState((prev) => ({ ...prev, release: "idle" }));
        goNext();
      }, 1200);
    }, 1000);
  }

  return (
    <>
      <GradingClientHeader
        selectedIdx={selectedIdx}
        queue={queue}
        goPrev={goPrev}
        goNext={goNext}
        gradedCountLocal={gradedCountLocal}
        queueCountLocal={queueCountLocal}
        handleReleaseGrade={handleReleaseGrade}
        isReleased={isReleased}
        releaseState={instructorCommentsState.release}
        selected={selected}
      />
      <div className="m-page__body">
        <div className="m-grading-layout">
          <GradingClientQueue
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
            queueCountLocal={queueCountLocal}
            queue={queue}
            releasedIds={releasedIds}
          />
          <GradingClientSubmissionPreview
            fileTabState={fileTabState}
            setFileTabState={setFileTabState}
            selected={selected}
            rubric={rubric}
          />
          <div className="m-stack">
            <GradingClientRubric rubric={rubric} />
            <GradingClientInstructorComments
              instructorCommentsState={instructorCommentsState}
              setInstructorCommentsState={setInstructorCommentsState}
              isReleased={isReleased}
              handleReleaseGrade={handleReleaseGrade}
            />
          </div>
        </div>
      </div>
    </>
  );
}
