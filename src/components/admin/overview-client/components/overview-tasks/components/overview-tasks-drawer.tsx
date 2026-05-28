import { XIcon } from "lucide-react";
import { ALL_TASKS } from "../../../data/ALL_TASKS";
import { Dispatch, SetStateAction } from "react";

type OverviewTasksDrawerProps = {
  done: Set<string>;
  toggle: (id: string) => void;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export function OverviewTasksDrawer({
  done,
  toggle,
  setDrawerOpen,
}: OverviewTasksDrawerProps) {
  const open = ALL_TASKS.filter((t) => !done.has(t.id));

  return (
    <>
      <div className="m-sheet-overlay" onClick={() => setDrawerOpen(false)} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="All tasks"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Tasks for you</span>
          <span className="m-card__sub" style={{ marginRight: "auto" }}>
            {open.length} open
          </span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={() => setDrawerOpen(false)}
          >
            <XIcon size={15} />
          </button>
        </div>

        <div className="m-sheet__body" style={{ padding: 0 }}>
          {ALL_TASKS.map((t) => (
            <div
              key={t.id}
              className={`m-task-drawer-item${done.has(t.id) ? " m-task-drawer-item--done" : ""}`}
            >
              <input
                type="checkbox"
                className="m-checkbox"
                checked={done.has(t.id)}
                onChange={() => toggle(t.id)}
              />
              <div className="m-task-drawer-item__body">
                <div className="m-task-drawer-item__title">{t.title}</div>
                <div className="m-task-drawer-item__meta">
                  <span className="m-mono" style={{ color: "var(--m-text-3)" }}>
                    {t.id}
                  </span>
                  <span className="m-task-drawer-item__dot" />
                  {t.dept}
                </div>
              </div>
              <div className="m-task-drawer-item__right">
                <div
                  className={`m-task-drawer-item__due${t.due === "Today" ? " m-task-drawer-item__due--today" : ""}`}
                >
                  {t.due}
                </div>
                {t.priority === "high" && !done.has(t.id) && (
                  <span
                    className="m-badge m-badge--warning"
                    style={{ fontSize: 10 }}
                  >
                    High
                  </span>
                )}
                {t.priority === "low" && (
                  <span className="m-badge" style={{ fontSize: 10 }}>
                    Low
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
