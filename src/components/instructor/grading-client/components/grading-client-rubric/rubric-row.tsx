import type { RubricCriterion } from "../../types/RubricCriterion";

type RubricRowProps = { criterion: RubricCriterion };

export function RubricRow({ criterion }: RubricRowProps) {
  const pct = criterion.score / criterion.max;

  return (
    <div className="m-rubric-row">
      <div className="m-rubric-row__head">
        <span className="m-rubric-row__title">{criterion.title}</span>
        <span className="m-rubric-row__score m-mono">
          <b>{criterion.score}</b>
          <span>/{criterion.max}</span>
        </span>
      </div>
      <div className="m-rubric-progress">
        <div
          className="m-rubric-progress__fill"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
