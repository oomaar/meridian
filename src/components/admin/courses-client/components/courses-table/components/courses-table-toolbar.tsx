"use client";

import { GridIcon, ListIcon, SearchIcon } from "lucide-react";
import { FilterMenu } from "./filter-menu";
import { LEVEL_OPTIONS } from "../data/LEVEL_OPTIONS";
import { MODALITY_OPTIONS } from "../data/MODALITY_OPTIONS";
import { AdminCourseRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";

type CoursesTableToolbarProps = {
  PAGE_SIZE: number;
  rows: AdminCourseRow[];
  setVisible: Dispatch<SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  department: string;
  setDepartment: Dispatch<SetStateAction<string>>;
  level: string;
  setLevel: Dispatch<SetStateAction<string>>;
  modality: string;
  setModality: Dispatch<SetStateAction<string>>;
  view: "table" | "grid";
  setView: Dispatch<SetStateAction<"table" | "grid">>;
};

export function CoursesTableToolbar({
  PAGE_SIZE,
  rows,
  setVisible,
  searchQuery,
  setSearchQuery,
  department,
  setDepartment,
  level,
  setLevel,
  modality,
  setModality,
  view,
  setView,
}: CoursesTableToolbarProps) {
  // derive unique dept options from the data
  const deptOptions = Array.from(new Set(rows.map((r) => r.deptCode)))
    .sort()
    .map((code) => ({ value: code, label: code }));

  // wrap each filter setter so changing any filter resets pagination
  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="m-card__toolbar">
      <div className="m-search" style={{ maxWidth: 320 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={searchQuery}
          onChange={(e) => reset(setSearchQuery)(e.target.value)}
          placeholder="Search code, title, instructor…"
        />
      </div>
      <FilterMenu
        label="Department"
        value={department}
        options={deptOptions}
        onChange={reset(setDepartment)}
      />
      <FilterMenu
        label="Level"
        value={level}
        options={LEVEL_OPTIONS}
        onChange={reset(setLevel)}
      />
      <FilterMenu
        label="Modality"
        value={modality}
        options={MODALITY_OPTIONS}
        onChange={reset(setModality)}
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
