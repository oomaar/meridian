import type {
  AdminCourseLesson,
  AdminCourseModule,
} from "@/fake-db/dashboards";
import { LessonBadge } from "./lesson-badge";
import { LessonStateIcon } from "../../../components/lesson-state-icon";

type LessonsProps = {
  modules: AdminCourseModule[];
  moduleLessons: Record<string, AdminCourseLesson[]>;
};

export function Lessons({ modules, moduleLessons }: LessonsProps) {
  return (
    <div className="flex flex-col gap-4">
      {modules.map((mod) => {
        const lessons = moduleLessons[mod.id] ?? [];
        const tone =
          mod.state === "complete"
            ? "success"
            : mod.state === "active"
              ? "accent"
              : "";
        const stateLabel =
          mod.state === "complete"
            ? "Released"
            : mod.state === "active"
              ? "In progress"
              : "Scheduled";

        return (
          <div key={mod.id} className="m-card">
            <div className="m-card__head">
              <span className="m-card__title">{mod.title}</span>
              <span className="m-card__sub">
                {mod.id} · {lessons.length} lessons · {mod.totalMin} min
              </span>
              <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
                {stateLabel}
              </span>
            </div>
            {lessons.map((l) => (
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
      })}
    </div>
  );
}
