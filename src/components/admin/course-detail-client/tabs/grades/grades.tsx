type GradesProps = {
  grades: {
    gradeDistribution: number[];
    gradedCount: number;
    mean: number;
    median: number;
    stdev: number;
    failRate: number;
  };
};

export function Grades({ grades }: GradesProps) {
  const { gradeDistribution, gradedCount, mean, median, stdev, failRate } =
    grades;
  const maxDist = Math.max(...gradeDistribution, 1);

  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Grade distribution</span>
        <span className="m-card__sub">{gradedCount} students graded</span>
      </div>
      <div className="m-card__body">
        <div
          className="m-grade-hist"
          style={{
            gridTemplateColumns: `repeat(${gradeDistribution.length}, 1fr)`,
          }}
        >
          {gradeDistribution.map((v, i) => {
            const bucketStart = 50 + i * 5;
            const barColor =
              bucketStart >= 80
                ? "var(--m-accent)"
                : bucketStart >= 60
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
                <span className="m-grade-hist__label">{bucketStart}</span>
              </div>
            );
          })}
        </div>
        <hr className="m-rule m-rule--spaced" />
        <div className="m-grid m-grid-4">
          <div>
            <div className="m-kpi-label">MEAN</div>
            <b className="m-kpi-value">{mean.toFixed(1)}</b>
          </div>
          <div>
            <div className="m-kpi-label">MEDIAN</div>
            <b className="m-kpi-value">{median}</b>
          </div>
          <div>
            <div className="m-kpi-label">STDEV</div>
            <b className="m-kpi-value">{stdev.toFixed(1)}</b>
          </div>
          <div>
            <div className="m-kpi-label">FAIL RATE</div>
            <b className="m-kpi-value m-kpi-value--danger">
              {failRate.toFixed(1)}%
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
