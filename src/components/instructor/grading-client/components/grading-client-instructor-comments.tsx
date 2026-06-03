"use client";

import { CheckCheckIcon, CheckIcon, SaveIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { InstructorCommentsState } from "../grading-client";

type GradingClientInstructorCommentsProps = {
  instructorCommentsState: InstructorCommentsState;
  setInstructorCommentsState: Dispatch<SetStateAction<InstructorCommentsState>>;
  isReleased: boolean;
  handleReleaseGrade(): void;
};

export function GradingClientInstructorComments({
  instructorCommentsState,
  setInstructorCommentsState,
  isReleased,
  handleReleaseGrade,
}: GradingClientInstructorCommentsProps) {
  const [comment, setComment] = useState("");

  function handleSaveDraft() {
    setInstructorCommentsState((prev) => ({ ...prev, draft: "saving" }));
    setTimeout(() => {
      setInstructorCommentsState((prev) => ({ ...prev, draft: "saved" }));
      setTimeout(
        () =>
          setInstructorCommentsState((prev) => ({ ...prev, draft: "idle" })),
        2000,
      );
    }, 900);
  }

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">Instructor comments</div>
      </div>
      <div className="m-card__body">
        <textarea
          className="m-grading-textarea"
          placeholder="Leave feedback for the student…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isReleased}
        />
        <div className="m-grading-comment-actions">
          {isReleased ? (
            <span className="m-badge m-badge--success">
              <CheckCheckIcon size={10} /> Grade released
            </span>
          ) : (
            <span className="m-badge">visible to student</span>
          )}
          <span className="m-spacer" />
          <button
            className="m-btn m-btn--ghost m-btn--sm"
            onClick={handleSaveDraft}
            disabled={instructorCommentsState.draft !== "idle" || isReleased}
          >
            {instructorCommentsState.draft === "saving" ? (
              <>
                <SaveIcon size={12} /> Saving…
              </>
            ) : instructorCommentsState.draft === "saved" ? (
              <>
                <CheckIcon size={12} /> Saved
              </>
            ) : (
              "Save draft"
            )}
          </button>
          <button
            className="m-btn m-btn--primary m-btn--sm"
            onClick={handleReleaseGrade}
            disabled={isReleased || instructorCommentsState.release !== "idle"}
          >
            {instructorCommentsState.release === "releasing" ? (
              "Releasing…"
            ) : instructorCommentsState.release === "released" ? (
              <>
                <CheckCheckIcon size={12} /> Released
              </>
            ) : (
              "Release grade"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
