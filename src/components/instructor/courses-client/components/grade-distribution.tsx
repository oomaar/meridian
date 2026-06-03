import type { InstructorGradeBar } from "@/fake-db/dashboards";

type GradeDistributionProps = { bars: InstructorGradeBar[] };

export function GradeDistribution({ bars }: GradeDistributionProps) {
  return (
    <div className="m-grade-dist">
      <div className="m-grade-dist__bar">
        {bars.map((bar) => (
          <div
            key={bar.letter}
            className={`m-grade-dist__segment m-grade-dist__segment--${bar.tone}`}
            style={{ width: `${bar.pct}%` }}
          />
        ))}
      </div>
      <div className="m-grade-dist__legend">
        {bars.map((bar) => (
          <span key={bar.letter} className="m-grade-dist__item">
            <span
              className={`m-grade-dist__dot m-grade-dist__dot--${bar.tone}`}
            />
            <span className="m-mono">
              {bar.letter} {bar.pct}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
