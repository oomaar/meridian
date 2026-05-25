"use client";

import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { AdminSemesterCard } from "@/fake-db/dashboards";
import { KIND_COLOR } from "./data/KIND_COLOR";
import { KIND_LABEL } from "./data/KIND_LABEL";
import { EVENTS_BY_CODE } from "./data/EVENTS_BY_CODE";

type AcademicCalendarDrawerProps = {
  semesters: AdminSemesterCard[];
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function AcademicCalendarDrawer({
  semesters,
  setOpen,
}: AcademicCalendarDrawerProps) {
  const [active, setActive] = useState<string | null>(null);

  const activeSem =
    semesters.find((s) => s.status === "active") ?? semesters[0];
  const selectedCode = active ?? activeSem?.code ?? semesters[0]?.code;
  const events = EVENTS_BY_CODE[selectedCode] ?? [];

  return (
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
              <div className="m-progress" style={{ flex: 1, maxWidth: 160 }}>
                <div
                  className="m-progress__bar"
                  style={{
                    ["--m-bar" as string]: `${Math.round(
                      (semesters.find((s) => s.code === selectedCode)
                        ?.progress ?? 0) * 100,
                    )}%`,
                  }}
                />
              </div>
              <span
                className="m-mono"
                style={{ fontSize: 11, color: "var(--m-text-3)" }}
              >
                {Math.round(
                  (semesters.find((s) => s.code === selectedCode)?.progress ??
                    0) * 100,
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
  );
}
