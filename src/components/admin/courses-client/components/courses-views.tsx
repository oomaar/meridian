"use client";

import { useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { CoursesViewsFooter } from "./courses-views-footer";
import type { CoursesViewsFilters } from "../types/CoursesViewsFilters";
import { CoursesViewsToolbar } from "./courses-views-toolbar/courses-views-toolbar";
import { CoursesGridView } from "./courses-grid-view";
import { CoursesTableView } from "./courses-table-view";

export const COURSES_PAGE_SIZE = 50;

const initialFilters: CoursesViewsFilters = {
  search: "",
  department: "all",
  level: "all",
  modality: "all",
};

type CoursesViewsProps = { rows: AdminCourseRow[]; total: number };

export function CoursesViews({ rows, total }: CoursesViewsProps) {
  const [filters, setFilters] = useState<CoursesViewsFilters>(initialFilters);
  const [view, setView] = useState<"table" | "grid">("table");
  const [visible, setVisible] = useState(COURSES_PAGE_SIZE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  function deleteRow(id: string) {
    setDeletedIds((prev) => new Set([...prev, id]));
  }

  // apply all filters
  const filtered = rows.filter((r) => {
    if (deletedIds.has(r.id)) return false;
    if (
      filters.search &&
      !(r.code + " " + r.title + " " + r.instructorName)
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.department !== "all" && r.deptCode !== filters.department)
      return false;
    if (filters.level !== "all" && String(r.level) !== filters.level)
      return false;
    if (filters.modality !== "all" && r.modality !== filters.modality)
      return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total - deletedIds.size;
  const footerSuffix = isFiltered ? " matching" : "";

  return (
    <div className="m-card">
      <CoursesViewsToolbar
        filters={filters}
        setFilters={setFilters}
        rows={rows}
        setVisible={setVisible}
        view={view}
        setView={setView}
      />
      {view === "table" && (
        <CoursesTableView displayed={displayed} deleteRow={deleteRow} />
      )}
      {view === "grid" && (
        <CoursesGridView displayed={displayed} deleteRow={deleteRow} />
      )}
      <CoursesViewsFooter
        displayed={displayed}
        footerTotal={isFiltered ? filtered.length : total - deletedIds.size}
        footerSuffix={footerSuffix}
        hasMore={hasMore}
        setVisible={setVisible}
        loadMoreCount={Math.min(COURSES_PAGE_SIZE, filtered.length - visible)}
      />
    </div>
  );
}
