import type { Dispatch, SetStateAction } from "react";
import type { StudentsTableFilters } from "../../../types/StudentsTableFilters";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { SearchIcon } from "lucide-react";
import { StudentsTableToolbarFilterMenu } from "./students-table-toolbar-filter-menu";
import { STANDING_OPTIONS } from "../data/STANDING_OPTIONS";

type StudentTableToolbarFiltersProps = {
  filters: StudentsTableFilters;
  setFilters: Dispatch<SetStateAction<StudentsTableFilters>>;
  rows: AdminStudentRow[];
};

export function StudentTableToolbarFilters({
  filters,
  setFilters,
  rows,
}: StudentTableToolbarFiltersProps) {
  const programOptions = Array.from(
    new Map(rows.map((r) => [r.programCode, r.programName])),
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: name }));

  return (
    <>
      <div className="m-search" style={{ maxWidth: 320 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search name, ID, email…"
        />
      </div>
      <StudentsTableToolbarFilterMenu
        label="Program"
        value={filters.program}
        options={programOptions}
        onChange={(value) => setFilters({ ...filters, program: value })}
      />
      <StudentsTableToolbarFilterMenu
        label="Standing"
        value={filters.standing}
        options={STANDING_OPTIONS}
        onChange={(value) => setFilters({ ...filters, standing: value })}
      />
    </>
  );
}
