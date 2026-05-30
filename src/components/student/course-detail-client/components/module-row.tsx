import type {
  StudentCourseDetailLesson,
  StudentCourseDetailModule,
} from "@/fake-db/dashboards";
import { LessonRow } from "./lesson-row";

type ModuleRowProps = {
  mod: StudentCourseDetailModule;
  isOpen: boolean;
  activeLessonId: string;
  onModuleClick: () => void;
  onLessonClick: (lesson: StudentCourseDetailLesson) => void;
};

export function ModuleRow({
  mod,
  isOpen,
  activeLessonId,
  onModuleClick,
  onLessonClick,
}: ModuleRowProps) {
  return (
    <>
      <div
        className={`m-outline-mod${isOpen ? " m-outline-mod--active" : ""}`}
        onClick={onModuleClick}
      >
        <span
          className={`m-outline-mod__num${
            mod.state === "complete"
              ? " m-outline-mod__num--complete"
              : mod.state === "in-progress"
                ? " m-outline-mod__num--active"
                : ""
          }`}
        >
          {mod.idx + 1}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="m-outline-mod__title">{mod.title}</div>
          <div className="m-outline-mod__meta">
            {mod.completedCount}/{mod.lessonCount} · {mod.totalMin} min
          </div>
        </div>
      </div>
      {isOpen &&
        mod.lessons.map((l) => (
          <LessonRow
            key={l.id}
            lesson={l}
            isActive={l.id === activeLessonId}
            onClick={() => onLessonClick(l)}
          />
        ))}
    </>
  );
}
