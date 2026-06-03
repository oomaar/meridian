import { CheckIcon, DownloadIcon } from "lucide-react";
import { GradingClientViewModal } from "../grading-client-view-modal/grading-client-view-modal";
import { getFileTabs } from "../helpers/getFileTabs";
import { getTextContent } from "../helpers/getTextContent";
import { getInlineComment } from "../helpers/getInlineComment";
import { strHash } from "../helpers/strHash";
import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import { FileTabState } from "../grading-client";
import type { RubricCriterion } from "../types/RubricCriterion";

type GradingClientSubmissionPreviewProps = {
  fileTabState: FileTabState;
  setFileTabState: Dispatch<SetStateAction<FileTabState>>;
  selected: InstructorGradingQueueItem;
  rubric: RubricCriterion[];
};

export function GradingClientSubmissionPreview({
  fileTabState,
  setFileTabState,
  selected,
  rubric,
}: GradingClientSubmissionPreviewProps) {
  const fileTabs = getFileTabs(selected);
  const textContent = getTextContent(selected);
  const inlineComment = getInlineComment(selected);

  const autoTestPass = 12 + (strHash(selected.id + "pass") % 5);
  const autoTestTotal = 16;

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-avatar m-grading-queue-avatar">
          {selected.studentInitials}
        </div>
        <div className="m-grading-preview-student">
          <div className="m-grading-preview-student__name">
            {selected.studentName}
          </div>
          <div className="m-grading-preview-student__meta m-mono">
            {selected.submissionId} · attempt {selected.attempt} ·{" "}
            {selected.submittedLabel}
            {selected.late && <span className="m-grading-late"> · late</span>}
          </div>
        </div>
        <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" disabled>
          <DownloadIcon size={14} />
        </button>
        <GradingClientViewModal
          fileTabState={fileTabState}
          setFileTabState={setFileTabState}
          selected={selected}
          inlineComment={inlineComment}
          autoTestPass={autoTestPass}
          autoTestTotal={autoTestTotal}
          fileTabs={fileTabs}
          textContent={textContent}
          rubric={rubric}
        />
      </div>

      <div className="m-grading-content">
        {fileTabs ? (
          <>
            <div className="m-grading-filetabs">
              {fileTabs.map((tab, i) => (
                <button
                  key={tab.name}
                  className={`m-grading-filetab${i === fileTabState.activeFileTab ? " m-grading-filetab--active" : ""}`}
                  onClick={() =>
                    setFileTabState((prev) => ({ ...prev, activeFileTab: i }))
                  }
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <pre className="m-grading-code">
              {fileTabs[fileTabState.activeFileTab].content}
            </pre>
          </>
        ) : (
          <div className="m-grading-text">{textContent}</div>
        )}

        <div className="m-grading-inline-note">
          <b>Inline comment</b>
          <div className="m-grading-inline-note__body">{inlineComment}</div>
        </div>
      </div>

      <div className="m-card__foot">
        <span>Auto-tests:</span>
        <span className="m-badge m-badge--success">
          <CheckIcon size={10} /> {autoTestPass}/{autoTestTotal} pass
        </span>
        {autoTestTotal - autoTestPass > 0 && (
          <span className="m-badge m-badge--danger">
            {autoTestTotal - autoTestPass} fail
          </span>
        )}
        <span className="m-spacer" />
        <span className="m-mono">{selected.submissionId}</span>
      </div>
    </div>
  );
}
