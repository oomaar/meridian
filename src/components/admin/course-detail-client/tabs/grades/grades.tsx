type GradesProps = {
  grades: {
    gradeData: number[];
    computedDist: number[];
    maxDist: number;
    gradeMean: number;
    gradeMedian: number;
    gradeStdev: number;
    gradeFailRate: number;
  };
};

export function Grades({ grades }: GradesProps) {
  const {
    gradeData,
    computedDist,
    maxDist,
    gradeMean,
    gradeMedian,
    gradeStdev,
    gradeFailRate,
  } = grades;

  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Grade distribution</span>
        <span className="m-card__sub">{gradeData.length} students graded</span>
      </div>
      <div className="m-card__body">
        <div
          className="m-grade-hist"
          style={{
            gridTemplateColumns: `repeat(${computedDist.length}, 1fr)`,
          }}
        >
          {computedDist.map((v, i) => {
            const barColor =
              i >= 6
                ? "var(--m-accent)"
                : i >= 3
                  ? "var(--m-warning)"
                  : "var(--m-danger)";
            return (
              <div key={i} className="m-grade-hist__col">
                <span className="m-grade-hist__count">{v || ""}</span>
                <div
                  className="m-grade-hist__bar"
                  style={{
                    height: Math.max(
                      v > 0 ? 3 : 0,
                      Math.round((v / maxDist) * 140),
                    ),
                    background: barColor,
                  }}
                />
                <span className="m-grade-hist__label">{50 + i * 5}</span>
              </div>
            );
          })}
        </div>
        <hr className="m-rule m-rule--spaced" />
        <div className="m-grid m-grid-4">
          <div>
            <div className="m-kpi-label">MEAN</div>
            <b className="m-kpi-value">{gradeMean.toFixed(1)}</b>
          </div>
          <div>
            <div className="m-kpi-label">MEDIAN</div>
            <b className="m-kpi-value">{gradeMedian}</b>
          </div>
          <div>
            <div className="m-kpi-label">STDEV</div>
            <b className="m-kpi-value">{gradeStdev.toFixed(1)}</b>
          </div>
          <div>
            <div className="m-kpi-label">FAIL RATE</div>
            <b className="m-kpi-value m-kpi-value--danger">
              {gradeFailRate.toFixed(1)}%
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
