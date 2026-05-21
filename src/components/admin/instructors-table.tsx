"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisIcon, SearchIcon, StarIcon, Trash2Icon } from "lucide-react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import type { InstructorStatus, InstructorTitle } from "@/fake-db/types";

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const TITLE_OPTIONS: { value: InstructorTitle; label: string }[] = [
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Assoc. Professor" },
  { value: "Assistant Professor", label: "Asst. Professor" },
  { value: "Lecturer", label: "Lecturer" },
  { value: "Adjunct", label: "Adjunct" },
];

const STATUS_OPTIONS: { value: InstructorStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "leave", label: "On leave" },
  { value: "retired", label: "Retired" },
];

// ─── sub-components ──────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#7895b5", "#9a7fc4", "#7ea668", "#c46a5a", "#d09757", "#c19a6b",
];

function strHash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return h;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .replace(/^(Prof\.|Dr\.|Mr\.) /, "")
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

function InstructorStatusBadge({ status }: { status: InstructorStatus }) {
  const map: Record<InstructorStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    leave: { label: "On leave", tone: "warning" },
    retired: { label: "Retired", tone: "" },
  };
  const { label, tone } = map[status];
  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}

function RatingPip({ rating }: { rating: number }) {
  const color =
    rating >= 4.5
      ? "var(--m-success)"
      : rating >= 3.8
        ? "var(--m-text-2)"
        : "var(--m-warning)";
  return (
    <span className="m-rating" style={{ color }}>
      <StarIcon size={10} fill="currentColor" />
      {rating.toFixed(1)}
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
            onClick={() => { onChange("all"); setOpen(false); }}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`m-filter-panel__opt${value === opt.value ? " m-filter-panel__opt--active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── row menu ────────────────────────────────────────────────────────────────

function RowMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen]           = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); setConfirming(false); }}
      >
        <EllipsisIcon size={14} />
      </button>

      {open && (
        <div className="m-card-menu" onMouseDown={(e) => e.stopPropagation()}>
          {confirming ? (
            <div className="m-card-menu__confirm">
              <span className="m-card-menu__confirm-label">Remove this instructor?</span>
              <div className="m-card-menu__confirm-actions">
                <button className="m-btn m-btn--ghost m-btn--sm"
                  onClick={(e) => { e.stopPropagation(); setConfirming(false); }}>
                  Cancel
                </button>
                <button className="m-btn m-btn--ghost m-btn--sm m-btn--danger"
                  onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); setConfirming(false); }}>
                  <Trash2Icon size={12} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <button className="m-card-menu__item m-card-menu__item--danger"
              onClick={(e) => { e.stopPropagation(); setConfirming(true); }}>
              <Trash2Icon size={13} className="m-card-menu__icon" /> Delete instructor
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

type Props = { rows: AdminInstructorRow[]; total: number };

export function InstructorsTable({ rows, total }: Props) {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [titleFilter, setTitleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const deptOptions = Array.from(
    new Map(rows.map((r) => [r.deptCode, r.deptName]))
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: `${code} — ${name}` }));

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
  };

  const filtered = rows.filter((r) => {
    if (deletedIds.has(r.id)) return false;
    if (
      q &&
      !(r.fullName + " " + r.email + " " + r.deptCode)
        .toLowerCase()
        .includes(q.toLowerCase())
    )
      return false;
    if (dept !== "all" && r.deptCode !== dept) return false;
    if (titleFilter !== "all" && r.title !== titleFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < (total - deletedIds.size);
  const footerTotal = isFiltered ? filtered.length : (total - deletedIds.size);

  return (
    <div className="m-card">
      {/* Toolbar */}
      <div className="m-card__toolbar">
        <div className="m-search" style={{ maxWidth: 300 }}>
          <SearchIcon className="m-search__icon" size={14} />
          <input
            value={q}
            onChange={(e) => reset(setQ)(e.target.value)}
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

      {/* Table */}
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
                    <span className="m-student-cell__name">{inst.fullName}</span>
                    <span className="m-student-cell__email">{inst.email}</span>
                  </div>
                </div>
              </td>
              <td style={{ fontSize: "12.5px", color: "var(--m-text-2)" }}>
                {inst.title}
              </td>
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
              <td
                className="m-mono"
                style={{ fontSize: "11.5px", color: "var(--m-text-3)" }}
              >
                {inst.hireDate}
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <RowMenu onDelete={() => setDeletedIds((prev) => new Set([...prev, inst.id]))} />
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
