import { ProgressBar } from "@/components/progress-bar";
import type {
  StudentCourseDetailLesson,
  StudentCourseDetailModule,
} from "@/fake-db/dashboards";
import { ModuleRow } from "./module-row";

type CourseDetailClientOutlineCardProps = {
  modulesTotal: number;
  modules: StudentCourseDetailModule[];
  completedLessonIds: Set<string>;
  activeLessonId: string;
  goToLesson(l: StudentCourseDetailLesson): void;
  dynamicProgress: number;
  onModuleClick: (mod: StudentCourseDetailModule) => void;
  isModuleOpen: (modId: number) => boolean;
};

export function CourseDetailClientOutlineCard({
  modulesTotal,
  modules,
  completedLessonIds,
  activeLessonId,
  goToLesson,
  dynamicProgress,
  onModuleClick,
  isModuleOpen,
}: CourseDetailClientOutlineCardProps) {
  const dynamicModulesComplete = modules.filter((m) =>
    m.lessons.every((l) => completedLessonIds.has(l.id)),
  ).length;

  return (
    <div className="m-card m-outline-card">
      <div className="m-card__head">
        <span className="m-card__title m-card__title--sm">Course outline</span>
        <span className="m-card__sub">
          {dynamicModulesComplete}/{modulesTotal} modules
        </span>
      </div>
      <div className="m-outline-scroll">
        {modules.map((mod) => (
          <ModuleRow
            key={mod.id}
            mod={mod}
            isOpen={isModuleOpen(mod.idx)}
            activeLessonId={activeLessonId}
            onModuleClick={() => onModuleClick(mod)}
            onLessonClick={goToLesson}
          />
        ))}
      </div>
      <div className="m-card__foot">
        <ProgressBar value={dynamicProgress} />
        <span className="m-mono m-outline-progress-pct">
          {Math.round(dynamicProgress * 100)}%
        </span>
      </div>
    </div>
  );
}
