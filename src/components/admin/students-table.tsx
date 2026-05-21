"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  DownloadIcon,
  EllipsisIcon,
  InboxIcon,
  Loader2Icon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import type { StudentStatus } from "@/fake-db/types";
import { truncateString } from "@/lib/utils";

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const STANDING_OPTIONS = [
  { value: "Freshman",  label: "Freshman"  },
  { value: "Sophomore", label: "Sophomore" },
  { value: "Junior",    label: "Junior"    },
  { value: "Senior",    label: "Senior"    },
  { value: "Graduate",  label: "Graduate"  },
];

// ─── avatar ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#7895b5","#9a7fc4","#7ea668","#c46a5a","#d09757","#c19a6b"];
function strHash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return h;
}
function Avatar({ name }: { name: string }) {
  const ini   = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[strHash(name) % AVATAR_COLORS.length];
  return <div className="m-avatar" style={{ background: color }}>{ini}</div>;
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StudentStatus }) {
  const map: Record<StudentStatus, { label: string; tone: string }> = {
    active:    { label: "Active",    tone: "success" },
    leave:     { label: "On leave",  tone: "warning" },
    probation: { label: "Probation", tone: "danger"  },
    graduated: { label: "Graduated", tone: ""        },
    withdrawn: { label: "Withdrawn", tone: ""        },
  };
  const { label, tone } = map[status];
  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}

// ─── filter menu ─────────────────────────────────────────────────────────────

function FilterMenu({
  label, value, options, onChange,
}: {
  label: string; value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== "all";
  const displayLabel = isActive ? (options.find((o) => o.value === value)?.label ?? value) : "all";

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="m-filter-wrap">
      <button className={`m-filter${isActive ? " m-filter--active" : ""}`} onClick={() => setOpen((o) => !o)}>
        {label}: <b>{displayLabel}</b>
      </button>
      {open && (
        <div className="m-filter-panel">
          <button
            className={`m-filter-panel__opt${value === "all" ? " m-filter-panel__opt--active" : ""}`}
            onClick={() => { onChange("all"); setOpen(false); }}
          >All</button>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`m-filter-panel__opt${value === opt.value ? " m-filter-panel__opt--active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── bulk message sheet ───────────────────────────────────────────────────────

function BulkMessageSheet({
  count,
  onClose,
}: {
  count: number;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [state, setState]     = useState<"idle" | "sending" | "sent">("idle");

  function send() {
    if (state !== "idle" || !body.trim()) return;
    setState("sending");
    setTimeout(() => {
      setState("sent");
      setTimeout(() => { onClose(); }, 1100);
    }, 1100);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={state === "sending" ? undefined : onClose} />
      <div className="m-sheet" role="dialog" aria-modal="true" aria-label="Message students">
        <div className="m-sheet__head">
          <span className="m-sheet__title">Message students</span>
          <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={onClose} disabled={state === "sending"}>
            <XIcon size={15} />
          </button>
        </div>
        <div className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">To</span>
            <input className="m-field__input m-text-2" readOnly
              value={`${count} selected student${count !== 1 ? "s" : ""}`} />
          </label>
          <label className="m-field">
            <span className="m-field__label">Subject</span>
            <input className="m-field__input" placeholder="e.g. Reminder: office hours this week"
              value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="m-field">
            <span className="m-field__label">Message</span>
            <textarea className="m-field__input m-textarea" rows={6} placeholder="Write your message here…"
              value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
        </div>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose} disabled={state === "sending"}>Cancel</button>
          <button className="m-btn m-btn--primary" onClick={send} disabled={state !== "idle" || !body.trim()}>
            {state === "idle"    && <><SendIcon size={13} /> Send message</>}
            {state === "sending" && <><Loader2Icon size={13} className="m-spin" /> Sending…</>}
            {state === "sent"    && <><CheckIcon size={13} /> Sent!</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

type Props = { rows: AdminStudentRow[]; total: number };

export function StudentsTable({ rows, total }: Props) {
  const [q, setQ]               = useState("");
  const [program, setProgram]   = useState("all");
  const [standing, setStanding] = useState("all");
  const [activeTab, setActiveTab] = useState<"roster" | "advisees" | "holds">("roster");
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [visible, setVisible]     = useState(PAGE_SIZE);

  // bulk action states
  const [msgOpen, setMsgOpen]           = useState(false);
  const [exportState, setExportState]   = useState<"idle" | "exporting" | "done">("idle");
  const [confirmRemove, setConfirmRemove] = useState(false);

  const programOptions = Array.from(new Map(rows.map((r) => [r.programCode, r.programName])))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => ({ value: code, label: name }));

  const reset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisible(PAGE_SIZE);
    setSelected(new Set());
    setConfirmRemove(false);
  };

  const filtered = rows.filter((r) => {
    if (removedIds.has(r.id)) return false;
    if (q && !(r.fullName + " " + r.studentNumber + " " + r.email).toLowerCase().includes(q.toLowerCase())) return false;
    if (program  !== "all" && r.programCode !== program)  return false;
    if (standing !== "all" && r.standing    !== standing) return false;
    if (activeTab === "advisees" && !r.isAdvisee)         return false;
    if (activeTab === "holds" && r.status !== "probation" && r.status !== "leave") return false;
    return true;
  });

  const displayed  = filtered.slice(0, visible);
  const hasMore    = visible < filtered.length;
  const isFiltered = filtered.length < (total - removedIds.size);
  const footerTotal = isFiltered ? filtered.length : (total - removedIds.size);

  const allChecked  = displayed.length > 0 && displayed.every((r) => selected.has(r.id));
  const someChecked = selected.size > 0;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(displayed.map((r) => r.id)));
  }
  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
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
        {/* Toolbar */}
        <div className="m-card__toolbar">
          <div className="m-search" style={{ maxWidth: 320 }}>
            <SearchIcon className="m-search__icon" size={14} />
            <input value={q} onChange={(e) => reset(setQ)(e.target.value)} placeholder="Search name, ID, email…" />
          </div>
          <FilterMenu label="Program"  value={program}  options={programOptions}  onChange={reset(setProgram)}  />
          <FilterMenu label="Standing" value={standing} options={STANDING_OPTIONS} onChange={reset(setStanding)} />
          <div className="m-spacer" />

          {someChecked ? (
            confirmRemove ? (
              /* ── confirm remove bar ── */
              <div className="m-bulk-bar">
                <span className="m-bulk-bar__count m-text-danger">
                  Remove {selected.size} student{selected.size !== 1 ? "s" : ""}?
                </span>
                <button className="m-btn m-btn--ghost m-btn--sm" onClick={() => setConfirmRemove(false)}>
                  Cancel
                </button>
                <button className="m-btn m-btn--sm m-btn--danger" onClick={handleRemoveConfirmed}>
                  <Trash2Icon size={12} /> Confirm remove
                </button>
              </div>
            ) : (
              /* ── bulk action bar ── */
              <div className="m-bulk-bar">
                <span className="m-bulk-bar__count">{selected.size} selected</span>
                <button className="m-btn m-btn--sm" onClick={() => setMsgOpen(true)}>
                  <InboxIcon size={12} /> Message
                </button>
                <button className="m-btn m-btn--sm" disabled={exportState !== "idle"} onClick={handleExport}>
                  {exportState === "idle"      && <><DownloadIcon size={12} /> Export</>}
                  {exportState === "exporting" && <><Loader2Icon size={12} className="m-spin" /> Exporting…</>}
                  {exportState === "done"      && <><CheckIcon size={12} /> Downloaded!</>}
                </button>
                <button className="m-btn m-btn--sm m-btn--danger" onClick={() => setConfirmRemove(true)}>
                  <Trash2Icon size={12} /> Remove
                </button>
              </div>
            )
          ) : (
            <div className="m-seg">
              <button aria-pressed={activeTab === "roster"}   onClick={() => setActiveTab("roster")}>Roster</button>
              <button aria-pressed={activeTab === "advisees"} onClick={() => setActiveTab("advisees")}>Advisees</button>
              <button aria-pressed={activeTab === "holds"}    onClick={() => setActiveTab("holds")}>Holds</button>
            </div>
          )}
        </div>

        {/* Table */}
        <table className="m-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" className="m-checkbox" checked={allChecked} onChange={toggleAll} />
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
              <tr key={s.id} className={`m-table__row-link${selected.has(s.id) ? " m-table__row--selected" : ""}`}>
                <td onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="m-checkbox"
                    checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} />
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
                <td className="m-td-dim">{truncateString(s.programName, 26)}</td>
                <td className="m-td-dim">{s.standing}</td>
                <td className="m-num m-mono" style={{ color: s.gpa < 2.5 ? "var(--m-danger)" : "var(--m-text)" }}>
                  {s.gpa.toFixed(2)}
                </td>
                <td className="m-num m-mono">{s.credits}</td>
                <td><StatusBadge status={s.status} /></td>
                <td className="m-td-dim">{truncateString(s.advisorName, 20)}</td>
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

        {/* Footer */}
        <div className="m-card__foot">
          <span>
            Showing <b>{displayed.length}</b>{" "}
            of <b>{footerTotal.toLocaleString()}</b>
            {isFiltered ? " matching" : ""}
          </span>
          <div className="m-spacer" />
          <button className="m-btn m-btn--ghost m-btn--sm" disabled={!hasMore}
            onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            {hasMore ? `Load ${Math.min(PAGE_SIZE, filtered.length - visible)} more` : "All loaded"}
          </button>
        </div>
      </div>

      {/* Bulk message sheet */}
      {msgOpen && (
        <BulkMessageSheet count={selected.size} onClose={() => setMsgOpen(false)} />
      )}
    </>
  );
}
