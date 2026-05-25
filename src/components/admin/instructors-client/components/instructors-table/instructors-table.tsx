"use client";

import { useState } from "react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { InstructorsTableHeader } from "./instructors-table-header/instructors-table-header";
import type { InstructorsTableFilters } from "./types/InstructorsTableFilters";
import { InstructorsTableFooter } from "./instructors-table-footer";
import { InstructorsTableRows } from "./instructors-table-rows/instructors-table-rows";

export const INSTRUCTORS_TABLE_PAGE_SIZE = 50;

type InstructorsTableProps = { rows: AdminInstructorRow[]; total: number };

const initialFilters: InstructorsTableFilters = {
  search: "",
  department: "all",
  title: "all",
  status: "all",
};

export function InstructorsTable({ rows, total }: InstructorsTableProps) {
  const [filters, setFilters] =
    useState<InstructorsTableFilters>(initialFilters);

  const [visible, setVisible] = useState(INSTRUCTORS_TABLE_PAGE_SIZE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const filtered = rows.filter((r) => {
    if (deletedIds.has(r.id)) return false;
    if (
      filters.search &&
      !(r.fullName + " " + r.email + " " + r.deptCode)
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.department !== "all" && r.deptCode !== filters.department)
      return false;
    if (filters.title !== "all" && r.title !== filters.title) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total - deletedIds.size;
  const footerTotal = isFiltered ? filtered.length : total - deletedIds.size;
  const loadMoreCount = Math.min(
    INSTRUCTORS_TABLE_PAGE_SIZE,
    filtered.length - visible,
  );

  return (
    <div className="m-card">
      <InstructorsTableHeader
        rows={rows}
        filters={filters}
        setFilters={setFilters}
        setVisible={setVisible}
      />
      <table className="m-table">
        <thead>
          <tr>
            <th>Instructor</th>
            <th>Rank</th>
            <th>Department</th>
            <th className="m-num">Rating</th>
            <th className="m-num">Courses</th>
            <th className="m-num">Active</th>
            <th>Status</th>
            <th>Since</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <InstructorsTableRows
          displayed={displayed}
          setDeletedIds={setDeletedIds}
        />
      </table>
      <InstructorsTableFooter
        displayed={displayed}
        setVisible={setVisible}
        hasMore={hasMore}
        isFiltered={isFiltered}
        footerTotal={footerTotal}
        loadMoreCount={loadMoreCount}
      />
    </div>
  );
}
