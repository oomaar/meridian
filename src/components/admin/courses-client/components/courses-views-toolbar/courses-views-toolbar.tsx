"use client";

import { GridIcon, ListIcon, SearchIcon } from "lucide-react";
import { CoursesViewsFilterMenu } from "./courses-views-filter-menu";
import { LEVEL_OPTIONS } from "./data/LEVEL_OPTIONS";
import { MODALITY_OPTIONS } from "./data/MODALITY_OPTIONS";
import { AdminCourseRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import type { CoursesViewsFilters } from "../../types/CoursesViewsFilters";
import { COURSES_PAGE_SIZE } from "../courses-views";

type CoursesViewsToolbarProps = {
  filters: CoursesViewsFilters;
  setFilters: Dispatch<SetStateAction<CoursesViewsFilters>>;
  rows: AdminCourseRow[];
  setVisible: Dispatch<SetStateAction<number>>;
  view: "table" | "grid";
  setView: Dispatch<SetStateAction<"table" | "grid">>;
};

export function CoursesViewsToolbar({
  filters,
  setFilters,
  rows,
  setVisible,
  view,
  setView,
}: CoursesViewsToolbarProps) {
  // derive unique dept options from the data
  const deptOptions = Array.from(new Set(rows.map((r) => r.deptCode)))
    .sort()
    .map((code) => ({ value: code, label: code }));

  // wrap each filter setter so changing any filter resets pagination
  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(COURSES_PAGE_SIZE);
  };

  return (
    <div className="m-card__toolbar">
      <div className="m-search" style={{ maxWidth: 320 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={filters.search}
          onChange={(e) =>
            reset((v) => setFilters((prev) => ({ ...prev, search: v })))(
              e.target.value,
            )
          }
          placeholder="Search code, title, instructor…"
        />
      </div>
      <CoursesViewsFilterMenu
        label="Department"
        value={filters.department}
        options={deptOptions}
        onChange={reset((v) =>
          setFilters((prev) => ({ ...prev, department: v })),
        )}
      />
      <CoursesViewsFilterMenu
        label="Level"
        value={filters.level}
        options={LEVEL_OPTIONS}
        onChange={reset((v) => setFilters((prev) => ({ ...prev, level: v })))}
      />
      <CoursesViewsFilterMenu
        label="Modality"
        value={filters.modality}
        options={MODALITY_OPTIONS}
        onChange={reset((v) =>
          setFilters((prev) => ({ ...prev, modality: v })),
        )}
      />
      <div className="m-spacer" />
      <div className="m-seg">
        <button
          aria-pressed={view === "table"}
          onClick={() => setView("table")}
        >
          <ListIcon size={12} />
        </button>
        <button aria-pressed={view === "grid"} onClick={() => setView("grid")}>
          <GridIcon size={12} />
        </button>
      </div>
    </div>
  );
}
