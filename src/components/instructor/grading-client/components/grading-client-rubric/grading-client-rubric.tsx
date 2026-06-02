import { gradeLetter } from "../../helpers/gradeLetter";
import { RubricCriterion } from "../../types/RubricCriterion";
import { RubricRow } from "./rubric-row";

type GradingClientRubricProps = {
  rubric: RubricCriterion[];
};

export function GradingClientRubric({ rubric }: GradingClientRubricProps) {
  const totalScore = rubric.reduce((s, r) => s + r.score, 0);
  const totalMax = rubric.reduce((s, r) => s + r.max, 0);
  const grade = gradeLetter(totalScore, totalMax);

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">Rubric</div>
        <span className="m-card__sub">{totalMax} pts</span>
      </div>
      <div className="m-card__body">
        <div className="m-rubric-list">
          {rubric.map((r) => (
            <RubricRow key={r.id} criterion={r} />
          ))}
        </div>
        <div className="m-rubric-divider" />
        <div className="m-rubric-total">
          <span className="m-rubric-total__score">
            {totalScore}
            <span className="m-rubric-total__max">/{totalMax}</span>
          </span>
          <span className={`m-badge m-badge--${grade.tone || "default"}`}>
            {grade.label}
          </span>
        </div>
      </div>
    </div>
  );
}
