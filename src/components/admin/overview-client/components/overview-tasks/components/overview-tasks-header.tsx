import { Dispatch, SetStateAction } from "react";
import { ALL_TASKS } from "../../../data/ALL_TASKS";

type OverviewTasksHeaderProps = {
  done: Set<string>;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export function OverviewTasksHeader({
  done,
  setDrawerOpen,
}: OverviewTasksHeaderProps) {
  const open = ALL_TASKS.filter((t) => !done.has(t.id));

  return (
    <div className="m-card__head">
      <h3 className="m-card__title">Tasks for you</h3>
      <span className="m-card__sub">{open.length} open</span>
      <button
        className="m-btn m-btn--ghost m-btn--sm"
        onClick={() => setDrawerOpen(true)}
      >
        View all
      </button>
    </div>
  );
}
