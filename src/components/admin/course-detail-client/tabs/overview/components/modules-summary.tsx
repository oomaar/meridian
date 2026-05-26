import { ProgressBar } from "@/components/progress-bar";
import type { AdminCourseModule } from "@/fake-db/dashboards";

type ModulesSummaryProps = {
  modules: AdminCourseModule[];
};

export function ModulesSummary({ modules }: ModulesSummaryProps) {
  const totalLessons = modules.reduce((s, m) => s + m.lessonCount, 0);

  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Modules</span>
        <span className="m-card__sub">
          {modules.length} modules · {totalLessons} lessons
        </span>
      </div>

      {modules.map((m) => {
        const ratio = m.lessonCount > 0 ? m.released / m.lessonCount : 0;
        const tone =
          m.state === "complete"
            ? "success"
            : m.state === "active"
              ? "accent"
              : "";

        const stateLabel =
          m.state === "complete"
            ? "Released"
            : m.state === "active"
              ? "In progress"
              : "Scheduled";

        return (
          <div key={m.id} className="m-list-row">
            <span className="m-list-row__id m-mono">{m.id}</span>
            <div className="m-list-row__body">
              <div className="m-list-row__title">{m.title}</div>
              <div className="m-list-row__meta">
                <span>{m.lessonCount} lessons</span>
                <span>{m.totalMin} min</span>
                <span>
                  {m.released}/{m.lessonCount} released
                </span>
              </div>
            </div>
            <div className="m-progress-wrap--lg">
              <ProgressBar value={ratio} />
            </div>
            <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
              {stateLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
