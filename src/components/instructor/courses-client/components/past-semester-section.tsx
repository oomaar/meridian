import type { InstructorPastSemester } from "@/fake-db/dashboards";

type PastSemesterSectionProps = { semester: InstructorPastSemester };

export function PastSemesterSection({ semester }: PastSemesterSectionProps) {
  return (
    <div className="m-past-semester">
      <div className="m-past-semester__heading">{semester.name}</div>
      {semester.courses.map((c, i) => (
        <div
          key={c.code}
          className={`m-past-course-row${i < semester.courses.length - 1 ? " m-past-course-row--bordered" : ""}`}
        >
          <div className="m-inst-dept-badge m-inst-dept-badge--muted">
            {c.deptAbbr}
          </div>
          <div className="m-inst-course-row__info">
            <div className="m-past-course-row__title">{c.title}</div>
            <div className="m-inst-course-row__meta m-mono">
              {c.code} · {c.enrolled} students
            </div>
          </div>
          <div className="m-inst-course-row__stat">
            <span className="m-inst-course-row__stat-label">AVG</span>
            <b className="m-mono">{c.avgGrade}</b>
          </div>
          <div className="m-inst-course-row__stat">
            <span className="m-inst-course-row__stat-label">PASS</span>
            <b className="m-mono">{c.passRate}%</b>
          </div>
        </div>
      ))}
    </div>
  );
}
