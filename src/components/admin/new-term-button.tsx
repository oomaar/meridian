"use client";

import { useState } from "react";
import { CalendarIcon, CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";

const BLANK = {
  name: "",
  code: "",
  startDate: "",
  endDate: "",
};

type SaveState = "idle" | "saving" | "saved";

export function NewTermButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [save, setSave] = useState<SaveState>("idle");

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle") return;
    setSave("saving");
    setTimeout(() => {
      setSave("saved");
      setTimeout(() => {
        setSave("idle");
        setOpen(false);
        setForm({ ...BLANK });
      }, 900);
    }, 1400);
  }

  function handleClose() {
    if (save === "saving") return;
    setOpen(false);
    setForm({ ...BLANK });
    setSave("idle");
  }

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> New term
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="New term"
          >
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
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">Short code</span>
                  <input
                    className="m-field__input m-mono"
                    placeholder="e.g. FA27"
                    maxLength={6}
                    value={form.code}
                    onChange={(e) => set("code", e.target.value.toUpperCase())}
                    required
                  />
                </label>
              </div>

              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Start date</span>
                  <input
                    className="m-field__input"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">End date</span>
                  <input
                    className="m-field__input"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set("endDate", e.target.value)}
                    required
                  />
                </label>
              </div>

              <p className="m-invite-note">
                The new term will start in <b>Planning</b> status. You can roll
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
                disabled={save !== "idle"}
                onClick={handleSubmit}
              >
                {save === "idle" && <><PlusIcon size={13} /> Create term</>}
                {save === "saving" && <><Loader2Icon size={13} className="m-spin" /> Creating…</>}
                {save === "saved" && <><CheckIcon size={13} /> Created!</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function AcademicCalendarButton() {
  return (
    <button className="m-btn">
      <CalendarIcon size={14} /> Academic calendar
    </button>
  );
}
