"use client";

import { useState } from "react";
import { CalendarIcon, XIcon } from "lucide-react";
import type { AdminSemesterCard } from "@/fake-db/dashboards";

// ─── Academic events per term ─────────────────────────────────────────────────

type EventKind = "start" | "deadline" | "break" | "end" | "exam" | "milestone";

interface AcademicEvent {
  date: string;
  label: string;
  kind: EventKind;
}

const EVENTS_BY_CODE: Record<string, AcademicEvent[]> = {
  SP25: [
    { date: "Jan 13", label: "Spring 2025 begins",      kind: "start" },
    { date: "Jan 24", label: "Last day to add/drop",    kind: "deadline" },
    { date: "Mar 10", label: "Spring break",            kind: "break" },
    { date: "Mar 31", label: "Withdrawal deadline",     kind: "deadline" },
    { date: "Apr 28", label: "Reading week",            kind: "break" },
    { date: "May 5",  label: "Final examinations",      kind: "exam" },
    { date: "May 22", label: "Commencement",            kind: "end" },
  ],
  FA25: [
    { date: "Aug 25", label: "Fall 2025 begins",        kind: "start" },
    { date: "Sep 5",  label: "Last day to add/drop",    kind: "deadline" },
    { date: "Oct 13", label: "Fall break",              kind: "break" },
    { date: "Nov 3",  label: "Withdrawal deadline",     kind: "deadline" },
    { date: "Nov 27", label: "Thanksgiving recess",     kind: "break" },
    { date: "Dec 8",  label: "Final examinations",      kind: "exam" },
    { date: "Dec 19", label: "Semester ends",           kind: "end" },
  ],
  SP26: [
    { date: "Jan 12", label: "Spring 2026 begins",      kind: "start" },
    { date: "Jan 23", label: "Last day to add/drop",    kind: "deadline" },
    { date: "Mar 9",  label: "Spring break",            kind: "break" },
    { date: "Mar 30", label: "Withdrawal deadline",     kind: "deadline" },
    { date: "Apr 27", label: "Reading week",            kind: "break" },
    { date: "May 4",  label: "Final examinations",      kind: "exam" },
    { date: "May 22", label: "Commencement",            kind: "end" },
  ],
  FA26: [
    { date: "Aug 24", label: "Fall 2026 begins",        kind: "start" },
    { date: "Sep 4",  label: "Last day to add/drop",    kind: "deadline" },
    { date: "Oct 12", label: "Fall break",              kind: "break" },
    { date: "Nov 2",  label: "Withdrawal deadline",     kind: "deadline" },
    { date: "Nov 26", label: "Thanksgiving recess",     kind: "break" },
    { date: "Dec 7",  label: "Final examinations",      kind: "exam" },
    { date: "Dec 18", label: "Semester ends",           kind: "end" },
  ],
  SP27: [
    { date: "Jan 11", label: "Spring 2027 begins",      kind: "start" },
    { date: "Jan 22", label: "Last day to add/drop",    kind: "deadline" },
    { date: "Mar 15", label: "Spring break (tentative)", kind: "break" },
    { date: "May 21", label: "Semester ends (tentative)", kind: "end" },
  ],
};

const KIND_COLOR: Record<EventKind, string> = {
  start:     "var(--m-success)",
  end:       "var(--m-text-3)",
  deadline:  "var(--m-danger)",
  break:     "var(--m-info)",
  exam:      "var(--m-warning)",
  milestone: "var(--m-accent)",
};

const KIND_LABEL: Record<EventKind, string> = {
  start:     "Start",
  end:       "End",
  deadline:  "Deadline",
  break:     "Break",
  exam:      "Exams",
  milestone: "Milestone",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AcademicCalendarSheet({
  semesters,
}: {
  semesters: AdminSemesterCard[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const activeSem = semesters.find((s) => s.status === "active") ?? semesters[0];
  const selectedCode = active ?? activeSem?.code ?? semesters[0]?.code;
  const events = EVENTS_BY_CODE[selectedCode] ?? [];

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <CalendarIcon size={14} /> Academic calendar
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={() => setOpen(false)} />
          <div
            className="m-sheet m-sheet--wide"
            role="dialog"
            aria-modal="true"
            aria-label="Academic calendar"
          >
            <div className="m-sheet__head">
              <span className="m-sheet__title">Academic calendar</span>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={() => setOpen(false)}
              >
                <XIcon size={15} />
              </button>
            </div>

            {/* Semester tabs */}
            <div className="m-cal-tabs">
              {semesters.map((sem) => (
                <button
                  key={sem.code}
                  className={`m-cal-tab${selectedCode === sem.code ? " m-cal-tab--active" : ""}${sem.status === "active" ? " m-cal-tab--current" : ""}`}
                  onClick={() => setActive(sem.code)}
                >
                  {sem.status === "active" && <span className="m-pulse-dot" />}
                  {sem.name}
                </button>
              ))}
            </div>

            <div className="m-sheet__body">
              {/* Date range header */}
              {semesters.find((s) => s.code === selectedCode) && (
                <div className="m-cal-range">
                  <span className="m-mono">
                    {semesters.find((s) => s.code === selectedCode)!.dateRange}
                  </span>
                  <div
                    className="m-progress"
                    style={{ flex: 1, maxWidth: 160 }}
                  >
                    <div
                      className="m-progress__bar"
                      style={{
                        ["--m-bar" as string]: `${Math.round(
                          (semesters.find((s) => s.code === selectedCode)
                            ?.progress ?? 0) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span
                    className="m-mono"
                    style={{ fontSize: 11, color: "var(--m-text-3)" }}
                  >
                    {Math.round(
                      (semesters.find((s) => s.code === selectedCode)
                        ?.progress ?? 0) * 100
                    )}
                    % complete
                  </span>
                </div>
              )}

              {/* Events timeline */}
              {events.length > 0 ? (
                <div className="m-cal-events">
                  {events.map((ev, i) => (
                    <div key={i} className="m-cal-event">
                      <div
                        className="m-cal-event__dot"
                        style={{ background: KIND_COLOR[ev.kind] }}
                      />
                      <div className="m-cal-event__date m-mono">{ev.date}</div>
                      <div className="m-cal-event__body">
                        <span className="m-cal-event__label">{ev.label}</span>
                        <span
                          className="m-cal-event__kind"
                          style={{ color: KIND_COLOR[ev.kind] }}
                        >
                          {KIND_LABEL[ev.kind]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--m-text-3)",
                    textAlign: "center",
                    padding: "32px 0",
                  }}
                >
                  No events scheduled yet for this term.
                </p>
              )}
            </div>

            <div className="m-sheet__foot">
              <button className="m-btn m-btn--ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
