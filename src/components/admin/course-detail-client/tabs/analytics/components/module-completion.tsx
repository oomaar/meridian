import { ProgressBar } from "@/components/progress-bar";
import type { AdminCourseModule } from "@/fake-db/dashboards";

type ModuleCompletionProps = { modules: AdminCourseModule[] };

export function ModuleCompletion({ modules }: ModuleCompletionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Module completion</span>
        <span className="m-card__sub">lessons released</span>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-14">
          {modules.map((m) => {
            const pct = m.lessonCount > 0 ? m.released / m.lessonCount : 0;
            return (
              <div key={m.id}>
                <div className="m-mod-comp__head">
                  <span className="m-mod-comp__title">{m.title}</span>
                  <span className="m-mod-comp__count m-mono">
                    {m.released}/{m.lessonCount}
                  </span>
                </div>
                <ProgressBar value={pct} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
