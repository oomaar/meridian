import type {
  AdminCourseLesson,
  AdminCourseModule,
  AdminResourceDTO,
} from "@/fake-db/dashboards";
import { Resources } from "./components/resources";
import { Lessons } from "./components/lessons";

type ModulesProps = {
  modules: AdminCourseModule[];
  firstLessons: AdminCourseLesson[];
  resources: AdminResourceDTO[];
};

export function Modules({ modules, firstLessons, resources }: ModulesProps) {
  return (
    <div className="m-grid m-grid-2-1">
      <Lessons modules={modules} firstLessons={firstLessons} />
      <Resources resources={resources} />
    </div>
  );
}
