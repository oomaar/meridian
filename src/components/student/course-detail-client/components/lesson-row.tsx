import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { LESSON_ICONS } from "../data/LESSON_ICONS";

type LessonRowProps = {
  lesson: StudentCourseDetailLesson;
  isActive: boolean;
  onClick: () => void;
};

export function LessonRow({ lesson, isActive, onClick }: LessonRowProps) {
  return (
    <div
      className={`m-outline-lesson${isActive ? " m-outline-lesson--active" : lesson.state === "complete" ? " m-outline-lesson--complete" : ""}`}
      onClick={onClick}
    >
      {LESSON_ICONS[lesson.kind]}
      <span className="m-outline-lesson__title">{lesson.title}</span>
      <span className="m-outline-lesson__dur">{lesson.duration}</span>
    </div>
  );
}
