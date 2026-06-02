import { gradeLetter } from "../helpers/gradeLetter";
import type { RubricCriterion } from "../types/RubricCriterion";

type GradingClientViewModalFooterProps = {
  rubric: RubricCriterion[];
  inlineComment: string;
};

export function GradingClientViewModalFooter({
  rubric,
  inlineComment,
}: GradingClientViewModalFooterProps) {
  const totalScore = rubric.reduce((s, r) => s + r.score, 0);
  const totalMax = rubric.reduce((s, r) => s + r.max, 0);
  const grade = gradeLetter(totalScore, totalMax);

  return (
    <div className="m-grading-view-modal__foot">
      <span className="m-grading-view-modal__inline-label">Inline note</span>
      <span className="m-grading-view-modal__inline-body">{inlineComment}</span>
      <span className="m-spacer" />
      <span className="m-grading-view-modal__score m-mono">
        {totalScore}
        <span className="m-grading-view-modal__score-max">/{totalMax}</span>
      </span>
      <span className={`m-badge m-badge--${grade.tone || "default"}`}>
        {grade.label}
      </span>
    </div>
  );
}
