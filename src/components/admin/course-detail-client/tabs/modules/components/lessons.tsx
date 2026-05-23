import { AdminCourseLesson, AdminCourseModule } from "@/fake-db/dashboards";
import { LessonBadge } from "../../../components/lesson-badge";
import { LessonStateIcon } from "../../../components/lesson-state-icon";

type LessonsProps = {
  modules: AdminCourseModule[];
  firstLessons: AdminCourseLesson[];
};

export function Lessons({ modules, firstLessons }: LessonsProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">{modules[0]?.title ?? "Module 1"}</span>
        <span className="m-card__sub">{firstLessons.length} lessons</span>
      </div>
      {firstLessons.map((l) => (
        <div key={l.id} className="m-list-row m-list-row--sm">
          <LessonStateIcon kind={l.kind} state={l.state} />
          <div className="m-list-row__body">
            <div className="m-list-row__title--sm">{l.title}</div>
            <div className="m-list-row__meta">
              {l.id} · {l.kind} · {l.duration}
            </div>
          </div>
          <LessonBadge state={l.state} />
        </div>
      ))}
    </div>
  );
}
