import { ProgressBar } from "@/components/progress-bar";
import { StudentCourseCard } from "@/fake-db/dashboards";

type MyCoursesProps = {
  courses: StudentCourseCard[];
  semesterLabel: string;
};

export function MyCourses({ courses, semesterLabel }: MyCoursesProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">My courses</span>
        <span className="m-card__sub">
          {courses.length} active · {semesterLabel}
        </span>
        <button className="m-btn m-btn--ghost m-btn--sm">View all</button>
      </div>
      {courses.map((c) => (
        <div key={c.code} className="m-course-row">
          <div className="m-course-row__chip" style={{ color: c.deptColor }}>
            {c.deptCode}
          </div>
          <div>
            <div className="m-course-row__title">{c.title}</div>
            <div className="m-course-row__meta m-mono">
              {c.code} · {c.instructor}
            </div>
            <div className="m-course-row__progress">
              <div style={{ width: 180 }}>
                <ProgressBar value={c.progress} />
              </div>
              <span className="m-course-row__pct m-mono">
                {Math.round(c.progress * 100)}%
              </span>
            </div>
          </div>
          <div className="m-course-row__next">
            <div className="m-course-row__next-label">NEXT</div>
            <div className="m-course-row__next-due">{c.nextDue}</div>
          </div>
          <div>
            <div className="m-course-row__grade">{c.grade}</div>
            <div className="m-course-row__grade-label">current</div>
          </div>
        </div>
      ))}
    </div>
  );
}
