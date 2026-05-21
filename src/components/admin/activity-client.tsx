"use client";

import { useState, useRef, useEffect } from "react";
import {
  CheckIcon, DownloadIcon, FilterIcon, Loader2Icon,
  PlusIcon, XIcon, ZapIcon,
} from "lucide-react";
import type { Activity, ActivityType } from "@/fake-db/types/activity";
import { NOW } from "@/fake-db/seed";

// ─── Static config ────────────────────────────────────────────────────────────

type FilterId = "all" | "submission" | "grade" | "enrollment" | "announce" | "system";

const TYPE_FILTERS: { id: FilterId; label: string; count: number; types: ActivityType[] | null }[] = [
  { id: "all",        label: "All events",    count: 412, types: null },
  { id: "submission", label: "Submissions",   count: 168, types: ["assignment_submitted"] },
  { id: "grade",      label: "Grades",        count: 88,  types: ["assignment_graded", "grade_posted"] },
  { id: "enrollment", label: "Enrollment",    count: 42,  types: ["course_enrolled", "course_dropped", "roster_imported"] },
  { id: "announce",   label: "Announcements", count: 24,  types: ["instructor_announcement", "policy_published", "deadline_approaching"] },
  { id: "system",     label: "System",        count: 90,  types: ["semester_published", "user_invited", "comment_added"] },
];

type TimeRangeId = "1h" | "6h" | "24h" | "7d" | "30d";
const TIME_RANGES: { id: TimeRangeId; label: string; mins: number }[] = [
  { id: "1h",  label: "Last hour",     mins: 60        },
  { id: "6h",  label: "Last 6 hours",  mins: 360       },
  { id: "24h", label: "Last 24 hours", mins: 1_440     },
  { id: "7d",  label: "Last 7 days",   mins: 10_080    },
  { id: "30d", label: "Last 30 days",  mins: 43_200    },
];

const TRIGGERS = [
  "Late grading SLA breach",
  "Enrollment drop > 10% in 24h",
  "Drop request filed",
  "Ungraded backlog > threshold",
  "Probation review triggered",
  "Roster import completed",
  "Semester phase change",
  "New instructor announcement",
];
const NOTIFY_TARGETS = ["Dean's office", "Advisor", "Instructor", "Registrar", "All staff", "IT department"];
const CHANNELS = ["Email", "In-app notification", "Both (email + in-app)"];

const INIT_RULES = [
  "Late grading SLA breach — Email Dean's office",
  "Probation review trigger — Notify advisor",
  "Drop request — Notify instructor and advisor",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relTime(isoTs: string): string {
  const mins = Math.floor((NOW.getTime() - new Date(isoTs).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function filterEvents(
  events: Activity[],
  typeFilter: FilterId,
  timeRange: TimeRangeId,
): Activity[] {
  const tf = TYPE_FILTERS.find((f) => f.id === typeFilter)!;
  const tr = TIME_RANGES.find((r) => r.id === timeRange)!;
  const cutoff = new Date(NOW.getTime() - tr.mins * 60_000);

  return events.filter((ev) => {
    const inTime = new Date(ev.timestamp) >= cutoff;
    const inType = tf.types === null || tf.types.includes(ev.type);
    return inTime && inType;
  });
}

// ─── Export button ────────────────────────────────────────────────────────────

function ExportButton() {
  const [state, setState] = useState<"idle" | "prep" | "ready">("idle");

  function handleExport() {
    if (state !== "idle") return;
    setState("prep");
    setTimeout(() => {
      window.print();
      setState("ready");
      setTimeout(() => setState("idle"), 2000);
    }, 800);
  }

  return (
    <button className="m-btn" onClick={handleExport} disabled={state === "prep"}>
      {state === "idle"  && <><DownloadIcon size={14} /> Export audit log</>}
      {state === "prep"  && <><Loader2Icon size={14} className="m-spin" /> Preparing…</>}
      {state === "ready" && <><CheckIcon size={14} /> Ready</>}
    </button>
  );
}

// ─── New rule drawer ──────────────────────────────────────────────────────────

function NewRuleDrawer({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (label: string) => void;
}) {
  const [name,    setName]    = useState("");
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [notify,  setNotify]  = useState(NOTIFY_TARGETS[0]);
  const [channel, setChannel] = useState(CHANNELS[2]);
  const [save,    setSave]    = useState<"idle" | "saving" | "saved">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle" || !name.trim()) return;
    setSave("saving");
    setTimeout(() => {
      setSave("saved");
      setTimeout(() => {
        onSave(`${trigger} — ${channel.split(" ")[0]} ${notify}`);
        onClose();
      }, 700);
    }, 1000);
  }

  const canSave = name.trim() && save === "idle";

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet" role="dialog" aria-modal="true" aria-label="New notification rule">
        <div className="m-sheet__head">
          <span className="m-sheet__title">New notification rule</span>
          <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={onClose}>
            <XIcon size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">Rule name</span>
            <input
              className="m-field__input"
              placeholder="e.g. Alert Dean on SLA breach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="m-field">
            <span className="m-field__label">Trigger event</span>
            <select
              className="m-field__input m-field__select"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            >
              {TRIGGERS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label className="m-field">
            <span className="m-field__label">Notify</span>
            <select
              className="m-field__input m-field__select"
              value={notify}
              onChange={(e) => setNotify(e.target.value)}
            >
              {NOTIFY_TARGETS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label className="m-field">
            <span className="m-field__label">Channel</span>
            <select
              className="m-field__input m-field__select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {CHANNELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>

          <p className="m-invite-note">
            This rule will fire whenever <b>{trigger.toLowerCase()}</b> is detected
            and will notify <b>{notify}</b> via <b>{channel.toLowerCase()}</b>.
            Rules can be paused or deleted at any time.
          </p>
        </form>

        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose} disabled={save === "saving"}>
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!canSave}
            onClick={handleSubmit}
          >
            {save === "idle"   && <><ZapIcon size={13} /> Save rule</>}
            {save === "saving" && <><Loader2Icon size={13} className="m-spin" /> Saving…</>}
            {save === "saved"  && <><CheckIcon size={13} /> Saved!</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Filters panel ────────────────────────────────────────────────────────────

function FiltersPanel({
  typeFilter,
  timeRange,
  onType,
  onTime,
  onClose,
}: {
  typeFilter: FilterId;
  timeRange: TimeRangeId;
  onType: (v: FilterId) => void;
  onTime: (v: TimeRangeId) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return (
    <div ref={ref} className="m-activity-filters">
      <div className="m-activity-filters__section">
        <div className="m-activity-filters__label">Event type</div>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`m-activity-filters__opt${typeFilter === f.id ? " m-activity-filters__opt--active" : ""}`}
            onClick={() => { onType(f.id); }}
          >
            <span className="m-activity-filters__opt-label">{f.label}</span>
            <span className="m-activity-filters__opt-count">{f.count}</span>
          </button>
        ))}
      </div>
      <div className="m-activity-filters__divider" />
      <div className="m-activity-filters__section">
        <div className="m-activity-filters__label">Time range</div>
        {TIME_RANGES.map((r) => (
          <button
            key={r.id}
            className={`m-activity-filters__opt${timeRange === r.id ? " m-activity-filters__opt--active" : ""}`}
            onClick={() => { onTime(r.id); }}
          >
            <span className="m-activity-filters__opt-label">{r.label}</span>
          </button>
        ))}
      </div>
      <div className="m-activity-filters__footer">
        <button className="m-btn m-btn--ghost m-btn--sm" onClick={() => { onType("all"); onTime("24h"); }}>
          Reset
        </button>
        <button className="m-btn m-btn--primary m-btn--sm" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

export function ActivityClient({ events }: { events: Activity[] }) {
  const [typeFilter,  setTypeFilter]  = useState<FilterId>("all");
  const [timeRange,   setTimeRange]   = useState<TimeRangeId>("24h");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ruleDrawer,  setRuleDrawer]  = useState(false);
  const [rules,       setRules]       = useState(INIT_RULES);

  const filtered = filterEvents(events, typeFilter, timeRange);
  const hasFilters = typeFilter !== "all" || timeRange !== "24h";

  function addRule(label: string) {
    setRules((prev) => [...prev, label]);
  }

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Operations</span>
          <h1 className="m-page__h">Activity</h1>
          <p className="m-page__sub">
            Real-time stream of operational events across the platform. Last 24 hours.
          </p>
        </div>
        <div className="m-page__actions">
          <ExportButton />
          <div style={{ position: "relative" }}>
            <button
              className={`m-btn${hasFilters ? " m-btn--primary" : ""}`}
              onClick={() => setFiltersOpen((p) => !p)}
            >
              <FilterIcon size={14} />
              Filters
              {hasFilters && (
                <span className="m-activity-filter-badge">
                  {(typeFilter !== "all" ? 1 : 0) + (timeRange !== "24h" ? 1 : 0)}
                </span>
              )}
            </button>
            {filtersOpen && (
              <FiltersPanel
                typeFilter={typeFilter}
                timeRange={timeRange}
                onType={setTypeFilter}
                onTime={setTimeRange}
                onClose={() => setFiltersOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">

          {/* Event stream */}
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">Event stream</div>
                <div className="m-card__sub">
                  {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                  {hasFilters ? " · filtered" : " · streaming · 1.2k events/day"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {!hasFilters && <span className="m-pulse-dot" />}
                <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
                  {hasFilters ? "filtered" : "live"}
                </span>
              </div>
            </div>
            <div className="m-card__body m-card__body--flush m-card__body--feed">
              {filtered.length === 0 ? (
                <div className="m-activity-empty">
                  <FilterIcon size={22} />
                  <span>No events match the current filters</span>
                </div>
              ) : (
                filtered.map((ev, i) => (
                  <div key={ev.id} className="m-feed-item">
                    <span className={`m-feed-item__dot m-feed-item__dot--${ev.dot}`} />
                    <div>
                      <div
                        className="m-feed-item__body"
                        dangerouslySetInnerHTML={{ __html: ev.body }}
                      />
                      <div className="m-event-meta">
                        <span className="m-mono">evt_{(0x13d92 + i).toString(16)}</span>
                        {" · "}
                        {ev.type.replace(/_/g, " ")}
                      </div>
                    </div>
                    <span className="m-feed-item__time">{relTime(ev.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="m-stack">
            {/* By type — clicking filters the stream */}
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">By type</div>
                {typeFilter !== "all" && (
                  <button
                    className="m-btn m-btn--ghost m-btn--sm"
                    onClick={() => setTypeFilter("all")}
                  >
                    <XIcon size={12} /> Clear
                  </button>
                )}
              </div>
              <div className="m-card__body m-card__body--flush">
                {TYPE_FILTERS.map((t) => (
                  <div
                    key={t.id}
                    className={`m-type-row${typeFilter === t.id ? " m-type-row--active" : ""}`}
                    onClick={() => setTypeFilter(t.id)}
                  >
                    <span className="m-type-row__label">{t.label}</span>
                    <span className="m-type-row__count">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification rules */}
            <div className="m-card">
              <div className="m-card__head">
                <div>
                  <div className="m-card__title">Notification rules</div>
                  <div className="m-card__sub">{rules.length} active</div>
                </div>
              </div>
              <div className="m-card__body">
                <div className="m-stack" style={{ gap: 10 }}>
                  {rules.map((rule, i) => (
                    <div key={i} className="m-rule-item">
                      <ZapIcon size={14} className="m-rule-item__icon" />
                      <span className="m-rule-item__label">{rule}</span>
                      <span className="m-badge m-badge--success">On</span>
                    </div>
                  ))}
                  <button className="m-btn" onClick={() => setRuleDrawer(true)}>
                    <PlusIcon size={14} /> New rule
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {ruleDrawer && (
        <NewRuleDrawer
          onClose={() => setRuleDrawer(false)}
          onSave={addRule}
        />
      )}
    </>
  );
}
