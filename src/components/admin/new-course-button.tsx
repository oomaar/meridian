"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";

const DEPTS = [
  { code: "CS", name: "Computer Science" },
  { code: "MATH", name: "Mathematics" },
  { code: "PHYS", name: "Physics" },
  { code: "BIO", name: "Biology" },
  { code: "CHEM", name: "Chemistry" },
  { code: "ENG", name: "English" },
  { code: "LIT", name: "Comparative Literature" },
  { code: "HIST", name: "History" },
  { code: "PHIL", name: "Philosophy" },
  { code: "ECON", name: "Economics" },
  { code: "SOC", name: "Sociology" },
  { code: "POLI", name: "Political Science" },
  { code: "ART", name: "Art History" },
  { code: "MUS", name: "Music" },
  { code: "LING", name: "Linguistics" },
];

const BLANK = {
  code: "",
  title: "",
  dept: "CS",
  credits: "3",
  cap: "30",
  modality: "In-person",
  status: "active",
};

type SaveState = "idle" | "saving" | "saved";

export function NewCourseButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [save, setSave] = useState<SaveState>("idle");

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        <PlusIcon size={14} /> New course
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="New course"
          >
            <div className="m-sheet__head">
              <span className="m-sheet__title">New course</span>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={handleClose}
              >
                <XIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="m-sheet__body">
              {/* Code + Department */}
              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Course code</span>
                  <input
                    className="m-field__input m-mono"
                    placeholder="e.g. CS-401"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">Department</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.dept}
                    onChange={(e) => set("dept", e.target.value)}
                  >
                    {DEPTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} — {d.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Title */}
              <label className="m-field">
                <span className="m-field__label">Course title</span>
                <input
                  className="m-field__input"
                  placeholder="e.g. Advanced Distributed Systems"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </label>

              {/* Credits + Cap */}
              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Credits</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.credits}
                    onChange={(e) => set("credits", e.target.value)}
                  >
                    {["1", "2", "3", "4"].map((v) => (
                      <option key={v} value={v}>
                        {v} credit{v !== "1" ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="m-field">
                  <span className="m-field__label">Enrollment cap</span>
                  <input
                    className="m-field__input m-mono"
                    type="number"
                    min={1}
                    max={500}
                    value={form.cap}
                    onChange={(e) => set("cap", e.target.value)}
                    required
                  />
                </label>
              </div>

              {/* Modality + Status */}
              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Modality</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.modality}
                    onChange={(e) => set("modality", e.target.value)}
                  >
                    {["In-person", "Hybrid", "Online"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="m-field">
                  <span className="m-field__label">Status</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="planning">Planning</option>
                  </select>
                </label>
              </div>
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
                {save === "idle" && (
                  <>
                    <PlusIcon size={13} /> Create course
                  </>
                )}
                {save === "saving" && (
                  <>
                    <Loader2Icon size={13} className="m-spin" /> Creating…
                  </>
                )}
                {save === "saved" && (
                  <>
                    <CheckIcon size={13} /> Created!
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
