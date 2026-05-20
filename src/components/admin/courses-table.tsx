"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisIcon, GridIcon, ListIcon, SearchIcon } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import type { CourseStatus } from "@/fake-db/types";
import { truncateString } from "@/lib/utils";

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: "100", label: "100-level" },
  { value: "200", label: "200-level" },
  { value: "300", label: "300-level" },
  { value: "400", label: "400-level" },
  { value: "500", label: "500+" },
];

const MODALITY_OPTIONS: { value: string; label: string }[] = [
  { value: "In-person", label: "In-person" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Online", label: "Online" },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CourseStatus }) {
  const map: Record<CourseStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    draft: { label: "Draft", tone: "" },
    archived: { label: "Archived", tone: "" },
    planning: { label: "Planning", tone: "" },
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

type Props = { rows: AdminCourseRow[]; total: number };

export function CoursesTable({ rows, total }: Props) {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [level, setLevel] = useState("all");
  const [modality, setModality] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // derive unique dept options from the data
  const deptOptions = Array.from(new Set(rows.map((r) => r.deptCode)))
    .sort()
    .map((code) => ({ value: code, label: code }));

  // wrap each filter setter so changing any filter resets pagination
  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
  };

  // apply all filters
  const filtered = rows.filter((r) => {
    if (
      q &&
      !(r.code + " " + r.title + " " + r.instructorName)
        .toLowerCase()
        .includes(q.toLowerCase())
    )
      return false;
    if (dept !== "all" && r.deptCode !== dept) return false;
    if (level !== "all" && String(r.level) !== level) return false;
    if (modality !== "all" && r.modality !== modality) return false;
    return true;
  });

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const isFiltered = filtered.length < total;
  const footerTotal = isFiltered ? filtered.length : total;
  const footerSuffix = isFiltered ? " matching" : "";

  return (
    <div className="m-card">
      {/* Toolbar */}
      <div className="m-card__toolbar">
        <div className="m-search" style={{ maxWidth: 320 }}>
          <SearchIcon className="m-search__icon" size={14} />
          <input
            value={q}
            onChange={(e) => reset(setQ)(e.target.value)}
            placeholder="Search code, title, instructor…"
          />
        </div>
        <FilterMenu
          label="Department"
          value={dept}
          options={deptOptions}
          onChange={reset(setDept)}
        />
        <FilterMenu
          label="Level"
          value={level}
          options={LEVEL_OPTIONS}
          onChange={reset(setLevel)}
        />
        <FilterMenu
          label="Modality"
          value={modality}
          options={MODALITY_OPTIONS}
          onChange={reset(setModality)}
        />
        <div className="m-spacer" />
        <div className="m-seg">
          <button
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            <ListIcon size={12} />
          </button>
          <button
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <GridIcon size={12} />
          </button>
        </div>
      </div>

      {/* ── Table view ── */}
      {view === "table" && (
        <table className="m-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Modality</th>
              <th className="m-num">Enrolled</th>
              <th>Capacity</th>
              <th className="m-num">Avg.</th>
              <th className="m-num">Ungraded</th>
              <th>Status</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {displayed.map((c) => (
              <tr key={c.id} className="m-table__row-link">
                <td className="m-mono">{c.code}</td>
                <td>
                  <div className="m-course-title-cell" title={c.title}>
                    <span
                      className="m-dept-swatch"
                      style={{ background: c.deptColor }}
                    />
                    {truncateString(c.title, 32)}
                  </div>
                </td>
                <td style={{ fontSize: "12.5px", color: "var(--m-text-2)" }}>
                  Prof. {c.instructorName}
                </td>
                <td>
                  <span className="m-badge">{c.modality}</span>
                </td>
                <td className="m-num m-mono">{c.enrolled}</td>
                <td>
                  <div className="m-cap-cell">
                    <ProgressBar value={c.enrolled / c.cap} />
                    <span className="m-cap-cell__label">
                      {c.enrolled}/{c.cap}
                    </span>
                  </div>
                </td>
                <td className="m-num m-mono">
                  {c.avgGrade != null ? c.avgGrade.toFixed(1) : "—"}
                </td>
                <td
                  className="m-num m-mono"
                  style={{
                    color:
                      c.ungraded > 10 ? "var(--m-warning)" : "var(--m-text-2)",
                  }}
                >
                  {c.ungraded || "—"}
                </td>
                <td>
                  <StatusBadge status={c.status} />
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
      )}

      {/* ── Grid view ── */}
      {view === "grid" && (
        <div className="m-course-grid">
          {displayed.map((c) => (
            <div key={c.id} className="m-card" style={{ cursor: "pointer" }}>
              <div
                className="m-course-banner"
                style={{
                  background: `linear-gradient(135deg, ${c.deptColor}30, ${c.deptColor}08)`,
                }}
              >
                <span
                  className="m-course-banner__code"
                  style={{ color: c.deptColor }}
                >
                  {c.code}
                </span>
                <span className="m-spacer" />
                <StatusBadge status={c.status} />
              </div>
              <div className="m-course-banner__body">
                <div
                  style={{
                    fontFamily: "var(--m-font-serif)",
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--m-text-3)",
                    marginBottom: 12,
                  }}
                >
                  Prof. {c.instructorName} · {c.credits} cr.
                </div>
                <div className="m-cap-cell" style={{ marginBottom: 8 }}>
                  <ProgressBar value={c.enrolled / c.cap} />
                  <span className="m-cap-cell__label">
                    {c.enrolled}/{c.cap}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="m-badge">{c.modality}</span>
                  {c.ungraded > 10 && (
                    <span className="m-badge m-badge--warning">
                      {c.ungraded} ungraded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="m-card__foot">
        <span>
          Showing <b style={{ color: "var(--m-text)" }}>{displayed.length}</b>{" "}
          of{" "}
          <b style={{ color: "var(--m-text)" }}>
            {footerTotal.toLocaleString()}
          </b>
          {footerSuffix}
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
