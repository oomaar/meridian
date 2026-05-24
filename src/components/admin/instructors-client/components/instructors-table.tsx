"use client";

import { useState } from "react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { RatingPip } from "./rating-pip";
import { InstructorStatusBadge } from "./instructor-status-badge";
import { RowMenu } from "./row-menu";
import { InstructorsTableFooter } from "./instructors-table-footer";
import { Avatar } from "./avatar";
import { InstructorsTableBanner } from "./instructors-table-banner";

export const PAGE_SIZE = 50;

type InstructorsTableProps = { rows: AdminInstructorRow[]; total: number };

export function InstructorsTable({ rows, total }: InstructorsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [titleFilter, setTitleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
  };

  const filtered = rows.filter((r) => {
    if (deletedIds.has(r.id)) return false;
    if (
      searchQuery &&
      !(r.fullName + " " + r.email + " " + r.deptCode)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;
    if (dept !== "all" && r.deptCode !== dept) return false;
    if (titleFilter !== "all" && r.title !== titleFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total - deletedIds.size;
  const footerTotal = isFiltered ? filtered.length : total - deletedIds.size;

  return (
    <div className="m-card">
      <InstructorsTableBanner
        reset={reset}
        rows={rows}
        dept={dept}
        setDept={setDept}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        titleFilter={titleFilter}
        setTitleFilter={setTitleFilter}
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
        <tbody>
          {displayed.map((inst) => (
            <tr key={inst.id} className="m-table__row-link">
              <td>
                <div className="m-student-cell">
                  <Avatar name={inst.fullName} />
                  <div className="m-student-cell__info">
                    <span className="m-student-cell__name">
                      {inst.fullName}
                    </span>
                    <span className="m-student-cell__email">{inst.email}</span>
                  </div>
                </div>
              </td>
              <td className="m-td-dim">{inst.title}</td>
              <td>
                <div className="m-dept-pill">
                  <span
                    className="m-dept-swatch"
                    style={{ background: inst.deptColor }}
                  />
                  <span style={{ fontSize: "12.5px" }}>{inst.deptCode}</span>
                </div>
              </td>
              <td className="m-num">
                <RatingPip rating={inst.rating} />
              </td>
              <td className="m-num m-mono">{inst.courseCount}</td>
              <td className="m-num m-mono">{inst.activeCourseCount}</td>
              <td>
                <InstructorStatusBadge status={inst.status} />
              </td>
              <td className="m-mono m-td-id">{inst.hireDate}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <RowMenu
                  onDelete={() =>
                    setDeletedIds((prev) => new Set([...prev, inst.id]))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <InstructorsTableFooter
        displayed={displayed}
        filtered={filtered}
        visible={visible}
        setVisible={setVisible}
        hasMore={hasMore}
        isFiltered={isFiltered}
        footerTotal={footerTotal}
      />
    </div>
  );
}
