"use client";

import { useEffect, useRef, useState } from "react";
import {
  DownloadIcon,
  EllipsisIcon,
  InboxIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import type { StudentStatus } from "@/fake-db/types";
import { truncateString } from "@/lib/utils";

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const STANDING_OPTIONS = [
  { value: "Freshman", label: "Freshman" },
  { value: "Sophomore", label: "Sophomore" },
  { value: "Junior", label: "Junior" },
  { value: "Senior", label: "Senior" },
  { value: "Graduate", label: "Graduate" },
];

// ─── sub-components ──────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#7895b5",
  "#9a7fc4",
  "#7ea668",
  "#c46a5a",
  "#d09757",
  "#c19a6b",
];

function strHash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return h;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[strHash(name) % AVATAR_COLORS.length];
  return (
    <div className="m-avatar" style={{ background: color }}>
      {initials}
    </div>
  );
}

function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const map: Record<StudentStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    leave: { label: "On leave", tone: "warning" },
    probation: { label: "Probation", tone: "danger" },
    graduated: { label: "Graduated", tone: "" },
    withdrawn: { label: "Withdrawn", tone: "" },
  };
  const { label, tone } = map[status];
  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== "all";
  const displayLabel = isActive
    ? (options.find((o) => o.value === value)?.label ?? value)
    : "all";

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="m-filter-wrap">
      <button
        className={`m-filter${isActive ? " m-filter--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}: <b>{displayLabel}</b>
      </button>
      {open && (
        <div className="m-filter-panel">
          <button
            className={`m-filter-panel__opt${value === "all" ? " m-filter-panel__opt--active" : ""}`}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`m-filter-panel__opt${value === opt.value ? " m-filter-panel__opt--active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

type Props = { rows: AdminStudentRow[]; total: number };

export function StudentsTable({ rows, total }: Props) {
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("all");
  const [standing, setStanding] = useState("all");
  const [activeTab, setActiveTab] = useState<"roster" | "advisees" | "holds">(
    "roster"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);

  const programOptions = Array.from(
    new Map(rows.map((r) => [r.programCode, r.programName]))
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: name }));

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
    setSelected(new Set());
  };

  const filtered = rows.filter((r) => {
    if (
      q &&
      !(r.fullName + " " + r.studentNumber + " " + r.email)
        .toLowerCase()
        .includes(q.toLowerCase())
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
  const isFiltered = filtered.length < total;
  const footerTotal = isFiltered ? filtered.length : total;

  const allChecked =
    displayed.length > 0 && displayed.every((r) => selected.has(r.id));
  const someChecked = selected.size > 0;

  function toggleAll() {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayed.map((r) => r.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  return (
    <div className="m-card">
      {/* Toolbar */}
      <div className="m-card__toolbar">
        <div className="m-search" style={{ maxWidth: 320 }}>
          <SearchIcon className="m-search__icon" size={14} />
          <input
            value={q}
            onChange={(e) => reset(setQ)(e.target.value)}
            placeholder="Search name, ID, email…"
          />
        </div>
        <FilterMenu
          label="Program"
          value={program}
          options={programOptions}
          onChange={reset(setProgram)}
        />
        <FilterMenu
          label="Standing"
          value={standing}
          options={STANDING_OPTIONS}
          onChange={reset(setStanding)}
        />
        <div className="m-spacer" />
        {someChecked ? (
          <div className="m-bulk-bar">
            <span className="m-bulk-bar__count">{selected.size} selected</span>
            <button className="m-btn m-btn--sm">
              <InboxIcon size={12} /> Message
            </button>
            <button className="m-btn m-btn--sm">
              <DownloadIcon size={12} /> Export
            </button>
            <button className="m-btn m-btn--sm m-btn--danger">
              <Trash2Icon size={12} /> Bulk action
            </button>
          </div>
        ) : (
          <div className="m-seg">
            <button
              aria-pressed={activeTab === "roster"}
              onClick={() => setActiveTab("roster")}
            >
              Roster
            </button>
            <button
              aria-pressed={activeTab === "advisees"}
              onClick={() => setActiveTab("advisees")}
            >
              Advisees
            </button>
            <button
              aria-pressed={activeTab === "holds"}
              onClick={() => setActiveTab("holds")}
            >
              Holds
            </button>
          </div>
        )}
      </div>

      {/* Table */}
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
            <tr key={s.id} className="m-table__row-link">
              <td>
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
              <td className="m-mono" style={{ fontSize: "11.5px" }}>
                {s.studentNumber}
              </td>
              <td style={{ fontSize: "12.5px", color: "var(--m-text-2)" }}>
                {truncateString(s.programName, 26)}
              </td>
              <td style={{ fontSize: "12.5px" }}>{s.standing}</td>
              <td
                className="m-num m-mono"
                style={{
                  color:
                    s.gpa < 2.5 ? "var(--m-danger)" : "var(--m-text)",
                }}
              >
                {s.gpa.toFixed(2)}
              </td>
              <td className="m-num m-mono">{s.credits}</td>
              <td>
                <StudentStatusBadge status={s.status} />
              </td>
              <td style={{ fontSize: "12.5px", color: "var(--m-text-2)" }}>
                {truncateString(s.advisorName, 20)}
              </td>
              <td
                className="m-mono"
                style={{ fontSize: "11.5px", color: "var(--m-text-3)" }}
              >
                {s.lastActive}
              </td>
              <td>
                <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm">
                  <EllipsisIcon size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="m-card__foot">
        <span>
          Showing <b style={{ color: "var(--m-text)" }}>{displayed.length}</b>{" "}
          of{" "}
          <b style={{ color: "var(--m-text)" }}>
            {footerTotal.toLocaleString()}
          </b>
          {isFiltered ? " matching" : ""}
        </span>
        <div className="m-spacer" />
        <button
          className="m-btn m-btn--ghost m-btn--sm"
          disabled={!hasMore}
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
        >
          {hasMore
            ? `Load ${Math.min(PAGE_SIZE, filtered.length - visible)} more`
            : "All loaded"}
        </button>
      </div>
    </div>
  );
}
