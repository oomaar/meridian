"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { computeBar } from "./semesters-client";
import type { AdminSemesterCard } from "@/fake-db/dashboards";
import type { SemesterStatus } from "@/fake-db/types";

interface NewTermButtonProps {
  onAdd: (card: AdminSemesterCard) => void;
}

type SaveState = "idle" | "saving" | "saved";

function fmtRange(start: Date, end: Date): string {
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function NewTermButton({ onAdd }: NewTermButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [save, setSave] = useState<SaveState>("idle");

  function reset() {
    setName(""); setCode("");
    setStartDate(undefined); setEndDate(undefined);
    setSave("idle");
  }

  function handleClose() {
    if (save === "saving") return;
    setOpen(false);
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle" || !startDate || !endDate) return;

    setSave("saving");
    setTimeout(() => {
      setSave("saved");

      const startIso = format(startDate, "yyyy-MM-dd");
      const endIso   = format(endDate, "yyyy-MM-dd");
      const { tlLeft, tlWidth } = computeBar(startIso, endIso);

      const card: AdminSemesterCard = {
        id:        `sem-${code.toLowerCase()}-new-${Date.now()}`,
        code,
        name,
        dateRange: fmtRange(startDate, endDate),
        status:    "planning" as SemesterStatus,
        progress:  0,
        stats:     { students: 0, courses: 0, instructors: 0 },
        tlLeft,
        tlWidth,
      };

      setTimeout(() => {
        onAdd(card);
        setSave("idle");
        setOpen(false);
        reset();
      }, 800);
    }, 1300);
  }

  const canSubmit = name && code && startDate && endDate && save === "idle";

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> New term
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div className="m-sheet" role="dialog" aria-modal="true" aria-label="New term">
            <div className="m-sheet__head">
              <span className="m-sheet__title">New term</span>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={handleClose}
              >
                <XIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="m-sheet__body">
              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Term name</span>
                  <input
                    className="m-field__input"
                    placeholder="e.g. Fall 2027"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">Short code</span>
                  <input
                    className="m-field__input m-mono"
                    placeholder="e.g. FA27"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </label>
              </div>

              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Start date</span>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Pick start date"
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">End date</span>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Pick end date"
                  />
                </label>
              </div>

              <p className="m-invite-note">
                The new term starts in <b>Planning</b> status. You can roll
                forward the course catalog once the term is created.
              </p>
            </form>

            <div className="m-sheet__foot">
              <button
                className="m-btn m-btn--ghost"
                onClick={handleClose}
                disabled={save === "saving"}
              >
                Cancel
              </button>
              <button
                className="m-btn m-btn--primary"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {save === "idle"   && <><PlusIcon size={13} /> Create term</>}
                {save === "saving" && <><Loader2Icon size={13} className="m-spin" /> Creating…</>}
                {save === "saved"  && <><CheckIcon size={13} /> Created!</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
