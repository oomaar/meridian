"use client";

import { EyeIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FileTabState } from "../grading-client";
import { GradingClientViewModalFooter } from "./grading-client-view-modal-footer";
import { GradingClientViewModalBody } from "./grading-client-view-modal-body";
import { GradingClientViewModalHeader } from "./grading-client-view-modal-header";
import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import type { RubricCriterion } from "../types/RubricCriterion";
import type { FileTab } from "../types/FileTab";

type GradingClientViewModalProps = {
  fileTabState: FileTabState;
  setFileTabState: Dispatch<SetStateAction<FileTabState>>;
  selected: InstructorGradingQueueItem;
  inlineComment: string;
  autoTestPass: number;
  autoTestTotal: number;
  fileTabs: FileTab[] | null;
  textContent: string;
  rubric: RubricCriterion[];
};

export function GradingClientViewModal({
  fileTabState,
  setFileTabState,
  selected,
  inlineComment,
  autoTestPass,
  autoTestTotal,
  fileTabs,
  textContent,
  rubric,
}: GradingClientViewModalProps) {
  const [viewOpen, setViewOpen] = useState(false);

  // Escape key closes the modal
  useEffect(() => {
    if (!viewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewOpen]);

  return (
    <>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={() => setViewOpen(true)}
      >
        <EyeIcon size={14} />
      </button>
      {viewOpen && (
        <div
          className="m-grading-view-overlay"
          onClick={() => setViewOpen(false)}
        >
          <div
            className="m-grading-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <GradingClientViewModalHeader
              selected={selected}
              autoTestPass={autoTestPass}
              autoTestTotal={autoTestTotal}
              setViewOpen={setViewOpen}
            />
            <GradingClientViewModalBody
              fileTabState={fileTabState}
              setFileTabState={setFileTabState}
              fileTabs={fileTabs}
              textContent={textContent}
            />
            <GradingClientViewModalFooter
              rubric={rubric}
              inlineComment={inlineComment}
            />
          </div>
        </div>
      )}
    </>
  );
}
