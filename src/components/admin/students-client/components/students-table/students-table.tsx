"use client";

import { useState } from "react";
import { EllipsisIcon } from "lucide-react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { truncateString } from "@/lib/utils";
import { StudentsTableFooter } from "./components/students-table-footer";
import { BulkMessageSheet } from "./sheets/bulk-message-sheet";
import { StatusBadge } from "./components/status-badge";
import { Avatar } from "./components/avatar";
import { StudentsTableToolbar } from "./components/students-table-toolbar";

const PAGE_SIZE = 50;

type StudentsTableProps = { rows: AdminStudentRow[]; total: number };

export function StudentsTable({ rows, total }: StudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [program, setProgram] = useState("all");
  const [standing, setStanding] = useState("all");
  const [activeTab, setActiveTab] = useState<"roster" | "advisees" | "holds">(
    "roster",
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);

  // bulk action states
  const [msgOpen, setMsgOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">(
    "idle",
  );
  const [confirmRemove, setConfirmRemove] = useState(false);

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
    setSelected(new Set());
    setConfirmRemove(false);
  };

  const filtered = rows.filter((r) => {
    if (removedIds.has(r.id)) return false;
    if (
      searchQuery &&
      !(r.fullName + " " + r.studentNumber + " " + r.email)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;
    if (program !== "all" && r.programCode !== program) return false;
    if (standing !== "all" && r.standing !== standing) return false;
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
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total - removedIds.size;
  const footerTotal = isFiltered ? filtered.length : total - removedIds.size;

  const allChecked =
    displayed.length > 0 && displayed.every((r) => selected.has(r.id));
  const someChecked = selected.size > 0;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(displayed.map((r) => r.id)));
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  function handleExport() {
    if (exportState !== "idle") return;
    setExportState("exporting");
    setTimeout(() => {
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2000);
    }, 1300);
  }

  function handleRemoveConfirmed() {
    setRemovedIds((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
    setConfirmRemove(false);
  }

  return (
    <>
      <div className="m-card">
        <StudentsTableToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          someChecked={someChecked}
          handleExport={handleExport}
          handleRemoveConfirmed={handleRemoveConfirmed}
          reset={reset}
          confirmRemove={confirmRemove}
          setConfirmRemove={setConfirmRemove}
          standing={standing}
          setStanding={setStanding}
          program={program}
          setProgram={setProgram}
          selected={selected}
          rows={rows}
          setMsgOpen={setMsgOpen}
          exportState={exportState}
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
          <tbody>
            {displayed.map((s) => (
              <tr
                key={s.id}
                className={`m-table__row-link${selected.has(s.id) ? " m-table__row--selected" : ""}`}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="m-checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleOne(s.id)}
                  />
                </td>
                <td>
                  <div className="m-student-cell">
                    <Avatar name={s.fullName} />
                    <div className="m-student-cell__info">
                      <span className="m-student-cell__name">{s.fullName}</span>
                      <span className="m-student-cell__email">{s.email}</span>
                    </div>
                  </div>
                </td>
                <td className="m-mono m-td-id">{s.studentNumber}</td>
                <td className="m-td-dim">
                  {truncateString(s.programName, 26)}
                </td>
                <td className="m-td-dim">{s.standing}</td>
                <td
                  className="m-num m-mono"
                  style={{
                    color: s.gpa < 2.5 ? "var(--m-danger)" : "var(--m-text)",
                  }}
                >
                  {s.gpa.toFixed(2)}
                </td>
                <td className="m-num m-mono">{s.credits}</td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
                <td className="m-td-dim">
                  {truncateString(s.advisorName, 20)}
                </td>
                <td className="m-mono m-td-id">{s.lastActive}</td>
                <td>
                  <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm">
                    <EllipsisIcon size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <StudentsTableFooter
          displayed={displayed}
          footerTotal={footerTotal}
          isFiltered={isFiltered}
          hasMore={hasMore}
          PAGE_SIZE={PAGE_SIZE}
          visible={visible}
          setVisible={setVisible}
          total={filtered.length}
        />
      </div>
      {msgOpen && (
        <BulkMessageSheet
          count={selected.size}
          onClose={() => setMsgOpen(false)}
        />
      )}
    </>
  );
}
