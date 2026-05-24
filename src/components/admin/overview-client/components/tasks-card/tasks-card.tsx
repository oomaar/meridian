import { useState } from "react";
import { ALL_TASKS } from "../../data/ALL_TASKS";
import { TasksCardHeader } from "./components/tasks-card-header";
import { TasksCardDrawer } from "./components/tasks-card-drawer";

export function TasksCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <>
      <div className="m-card">
        <TasksCardHeader done={done} setDrawerOpen={setDrawerOpen} />
        <div className="m-card__body m-card__body--flush">
          {ALL_TASKS.slice(0, 5).map((t) => (
            <div key={t.id} className="m-task-item">
              <input
                type="checkbox"
                className="m-checkbox"
                checked={done.has(t.id)}
                onChange={() => toggle(t.id)}
              />
              <div
                className="m-task-item__body"
                style={{ opacity: done.has(t.id) ? 0.45 : 1 }}
              >
                <div className="m-task-item__title">{t.title}</div>
                <div className="m-task-item__meta">
                  <span className="m-mono">{t.id}</span> · {t.owner} · due{" "}
                  {t.due}
                </div>
              </div>
              {t.count > 0 && <span className="m-badge">{t.count}</span>}
              {t.priority === "high" && !done.has(t.id) && (
                <span className="m-badge m-badge--warning">High</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {drawerOpen && (
        <TasksCardDrawer
          done={done}
          toggle={toggle}
          setDrawerOpen={setDrawerOpen}
        />
      )}
    </>
  );
}
