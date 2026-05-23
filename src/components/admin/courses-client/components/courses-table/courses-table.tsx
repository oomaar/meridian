"use client";

import { useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { CoursesTableToolbar } from "./components/courses-table-toolbar";
import { CoursesTableView } from "./components/courses-table-view";
import { CoursesGridView } from "./components/courses-grid-view";
import { CoursesTableFooter } from "./components/courses-table-footer";

const PAGE_SIZE = 50;

type CoursesTableProps = { rows: AdminCourseRow[]; total: number };

export function CoursesTable({ rows, total }: CoursesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [level, setLevel] = useState("all");
  const [modality, setModality] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  function deleteRow(id: string) {
    setDeletedIds((prev) => new Set([...prev, id]));
  }

  // apply all filters
  const filtered = rows.filter((r) => {
    if (deletedIds.has(r.id)) return false;
    if (
      searchQuery &&
      !(r.code + " " + r.title + " " + r.instructorName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;
    if (department !== "all" && r.deptCode !== department) return false;
    if (level !== "all" && String(r.level) !== level) return false;
    if (modality !== "all" && r.modality !== modality) return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total - deletedIds.size;
  const footerTotal = isFiltered ? filtered.length : total - deletedIds.size;
  const footerSuffix = isFiltered ? " matching" : "";

  return (
    <div className="m-card">
      <CoursesTableToolbar
        PAGE_SIZE={PAGE_SIZE}
        rows={rows}
        setVisible={setVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        department={department}
        setDepartment={setDepartment}
        level={level}
        setLevel={setLevel}
        modality={modality}
        setModality={setModality}
        view={view}
        setView={setView}
      />
      {view === "table" && (
        <CoursesTableView displayed={displayed} deleteRow={deleteRow} />
      )}
      {view === "grid" && (
        <CoursesGridView displayed={displayed} deleteRow={deleteRow} />
      )}
      <CoursesTableFooter
        PAGE_SIZE={PAGE_SIZE}
        displayed={displayed}
        footerTotal={footerTotal}
        footerSuffix={footerSuffix}
        hasMore={hasMore}
        visible={visible}
        setVisible={setVisible}
        total={filtered.length}
      />
    </div>
  );
}
