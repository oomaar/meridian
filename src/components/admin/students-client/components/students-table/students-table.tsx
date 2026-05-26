"use client";

import { useState } from "react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { StudentsTableFooter } from "./components/students-table-footer";
import { StudentsTableToolbar } from "./components/students-table-toolbar/students-table-toolbar";
import type { StudentsTableFilters } from "./types/StudentsTableFilters";
import { StudentsTableRows } from "./components/students-table-rows/students-table-rows";

export const STUDENTS_TABLE_PAGE_SIZE = 50;

type StudentsTableProps = { rows: AdminStudentRow[]; total: number };

export function StudentsTable({ rows, total }: StudentsTableProps) {
  const [filters, setFilters] = useState<StudentsTableFilters>({
    search: "",
    program: "all",
    standing: "all",
  });

  const [activeTab, setActiveTab] = useState<"roster" | "advisees" | "holds">(
    "roster",
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(STUDENTS_TABLE_PAGE_SIZE);

  // bulk action states

  const filtered = rows.filter((r) => {
    if (removedIds.has(r.id)) return false;
    if (
      filters.search &&
      !(r.fullName + " " + r.studentNumber + " " + r.email)
        .toLowerCase()
        .startsWith(filters.search.toLowerCase())
    )
      return false;
    if (filters.program !== "all" && r.programCode !== filters.program)
      return false;
    if (filters.standing !== "all" && r.standing !== filters.standing)
      return false;
    if (activeTab === "advisees" && !r.isAdvisee) return false;
    if (
      activeTab === "holds" &&
      r.status !== "probation" &&
      r.status !== "leave"
    )
      return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const isFiltered = filtered.length < total - removedIds.size;

  const allChecked =
    displayed.length > 0 && displayed.every((r) => selected.has(r.id));

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(displayed.map((r) => r.id)));
  }

  function handleRemoveConfirmed() {
    setRemovedIds((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
  }

  return (
    <div className="m-card">
      <StudentsTableToolbar
        filters={filters}
        setFilters={setFilters}
        rows={rows}
        handleRemoveConfirmed={handleRemoveConfirmed}
        selected={selected}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <table className="m-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <input
                type="checkbox"
                className="m-checkbox"
                checked={allChecked}
                onChange={toggleAll}
              />
            </th>
            <th>Student</th>
            <th>ID</th>
            <th>Program</th>
            <th>Standing</th>
            <th className="m-num">GPA</th>
            <th className="m-num">Cr.</th>
            <th>Status</th>
            <th>Advisor</th>
            <th>Active</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <StudentsTableRows
          selected={selected}
          setSelected={setSelected}
          displayed={displayed}
        />
      </table>
      <StudentsTableFooter
        displayed={displayed}
        footerTotal={isFiltered ? filtered.length : total - removedIds.size}
        isFiltered={isFiltered}
        hasMore={visible < filtered.length}
        loadMoreCount={Math.min(
          STUDENTS_TABLE_PAGE_SIZE,
          filtered.length - visible,
        )}
        setVisible={setVisible}
      />
    </div>
  );
}
