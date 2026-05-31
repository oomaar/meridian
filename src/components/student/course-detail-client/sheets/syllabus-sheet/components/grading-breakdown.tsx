import type { StudentCourseDetailData } from "@/fake-db/dashboards";

type GradingBreakdownProps = {
  syllabus: StudentCourseDetailData["syllabus"];
};

export function GradingBreakdown({ syllabus }: GradingBreakdownProps) {
  return (
    <div>
      <div className="m-syllabus-section__label">Grading breakdown</div>
      <div className="m-syllabus-grading">
        {syllabus.grading.map((g) => (
          <div key={g.label} className="m-modal-breakdown-row">
            <div className="m-modal-breakdown-row__label">{g.label}</div>
            <div className="m-modal-breakdown-row__track">
              <div
                className="m-modal-breakdown-row__fill"
                style={{ width: `${g.pct}%`, background: g.color }}
              />
            </div>
            <div className="m-modal-breakdown-row__pct">{g.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
