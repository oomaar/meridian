import { ProgressBar } from "@/components/progress-bar";
import type {
  StudentCourseDetailData,
  StudentCourseDetailLesson,
  StudentCourseDetailModule,
} from "@/fake-db/dashboards";
import { ModuleRow } from "./module-row";
import { Dispatch, SetStateAction } from "react";

type CourseDetailClientOutlineCardProps = {
  activeLessonId: string;
  completedLessonIds: Set<string>;
  goToLesson(l: StudentCourseDetailLesson): void;
  dynamicProgress: number;
  openModuleIdx: number;
  setOpenModuleIdx: Dispatch<SetStateAction<number>>;
  data: StudentCourseDetailData;
};

export function CourseDetailClientOutlineCard({
  activeLessonId,
  completedLessonIds,
  goToLesson,
  dynamicProgress,
  openModuleIdx,
  setOpenModuleIdx,
  data,
}: CourseDetailClientOutlineCardProps) {
  const { modules, modulesTotal } = data;

  const isModuleOpen = (modId: number) => modId === openModuleIdx;

  const onModuleClick = (mod: StudentCourseDetailModule) => {
    setOpenModuleIdx(mod.idx === openModuleIdx ? -1 : mod.idx);
  };

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
