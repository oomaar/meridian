import { SearchIcon } from "lucide-react";
import { InstructorsTableFilterMenu } from "./instructors-table-filter-menu";
import { Dispatch, SetStateAction } from "react";
import { TITLE_OPTIONS } from "../data/TITLE_OPTIONS";
import { STATUS_OPTIONS } from "../data/STATUS_OPTIONS";
import { INSTRUCTORS_TABLE_PAGE_SIZE } from "../instructors-table";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import type { InstructorsTableFilters } from "../types/InstructorsTableFilters";

type InstructorsTableHeaderProps = {
  rows: AdminInstructorRow[];
  setVisible: Dispatch<SetStateAction<number>>;
  filters: InstructorsTableFilters;
  setFilters: Dispatch<SetStateAction<InstructorsTableFilters>>;
};

export function InstructorsTableHeader({
  rows,
  setVisible,
  filters,
  setFilters,
}: InstructorsTableHeaderProps) {
  const deptOptions = Array.from(
    new Map(rows.map((r) => [r.deptCode, r.deptName])),
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: `${code} — ${name}` }));

  function resetPage() {
    setVisible(INSTRUCTORS_TABLE_PAGE_SIZE);
  }

  function handleSearchChange(search: string) {
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  }

  function handleDepartmentChange(department: string) {
    setFilters((prev) => ({
      ...prev,
      department,
    }));
    resetPage();
  }

  function handleTitleChange(title: string) {
    setFilters((prev) => ({
      ...prev,
      title,
    }));
    resetPage();
  }

  function handleStatusChange(status: string) {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
    resetPage();
  }

  return (
    <div className="m-card__toolbar">
      <div className="m-search" style={{ maxWidth: 300 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search name, email, department…"
        />
      </div>
      <InstructorsTableFilterMenu
        label="Department"
        value={filters.department}
        options={deptOptions}
        onChange={handleDepartmentChange}
      />
      <InstructorsTableFilterMenu
        label="Rank"
        value={filters.title}
        options={TITLE_OPTIONS}
        onChange={handleTitleChange}
      />
      <InstructorsTableFilterMenu
        label="Status"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={handleStatusChange}
      />
    </div>
  );
}
