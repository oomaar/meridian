import { SearchIcon } from "lucide-react";
import { FilterMenu } from "./filter-menu";
import { Dispatch, SetStateAction } from "react";
import { TITLE_OPTIONS } from "../data/TITLE_OPTIONS";
import { STATUS_OPTIONS } from "../data/STATUS_OPTIONS";
import type { AdminInstructorRow } from "@/fake-db/dashboards";

type InstructorsTableBannerProps = {
  reset: (setter: (v: string) => void) => (v: string) => void;
  rows: AdminInstructorRow[];
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  dept: string;
  setDept: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  titleFilter: string;
  setTitleFilter: Dispatch<SetStateAction<string>>;
};

export function InstructorsTableBanner({
  reset,
  rows,
  searchQuery,
  setSearchQuery,
  dept,
  setDept,
  statusFilter,
  setStatusFilter,
  titleFilter,
  setTitleFilter,
}: InstructorsTableBannerProps) {
  const deptOptions = Array.from(
    new Map(rows.map((r) => [r.deptCode, r.deptName])),
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: `${code} — ${name}` }));

  return (
    <div className="m-card__toolbar">
      <div className="m-search" style={{ maxWidth: 300 }}>
        <SearchIcon className="m-search__icon" size={14} />
        <input
          value={searchQuery}
          onChange={(e) => reset(setSearchQuery)(e.target.value)}
          placeholder="Search name, email, department…"
        />
      </div>
      <FilterMenu
        label="Department"
        value={dept}
        options={deptOptions}
        onChange={reset(setDept)}
      />
      <FilterMenu
        label="Rank"
        value={titleFilter}
        options={TITLE_OPTIONS}
        onChange={reset(setTitleFilter)}
      />
      <FilterMenu
        label="Status"
        value={statusFilter}
        options={STATUS_OPTIONS}
        onChange={reset(setStatusFilter)}
      />
    </div>
  );
}
