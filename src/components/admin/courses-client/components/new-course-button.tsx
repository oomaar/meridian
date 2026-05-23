"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import type { AdminCourseRow } from "@/fake-db/dashboards";

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

const DEPT_COLORS: Record<string, string> = {
  CS: "var(--m-info)",
  MATH: "#9a7fc4",
  PHYS: "var(--m-accent)",
  BIO: "var(--m-success)",
  CHEM: "var(--m-success)",
  ENG: "var(--m-accent)",
  LIT: "var(--m-accent)",
  HIST: "var(--m-warning)",
  PHIL: "var(--m-info)",
  ECON: "var(--m-danger)",
  SOC: "var(--m-warning)",
  POLI: "var(--m-danger)",
  ART: "var(--m-warning)",
  MUS: "#9a7fc4",
  LING: "var(--m-info)",
};

const BLANK = {
  code: "",
  title: "",
  dept: "CS",
  credits: "3",
  cap: "30",
  modality: "In-person",
  status: "active",
};

export function NewCourseButton({
  onAdd,
}: { onAdd?: (row: AdminCourseRow) => void } = {}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent,
  ) {
    e.preventDefault();
    if (save !== "idle" || !form.code.trim() || !form.title.trim()) return;
    setSave("saving");
    setTimeout(() => {
      setSave("saved");
      onAdd?.({
        id: `new-${form.code}-${Date.now()}`,
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        instructorName: "—",
        deptCode: form.dept,
        deptColor: DEPT_COLORS[form.dept] ?? "var(--m-accent)",
        modality: form.modality as AdminCourseRow["modality"],
        level: (() => {
          const n = parseInt(form.code.match(/\d+/)?.[0] ?? "100");
          return (Math.floor(Math.min(n, 500) / 100) *
            100) as AdminCourseRow["level"];
        })(),
        enrolled: 0,
        cap: parseInt(form.cap) || 30,
        credits: parseInt(form.credits) || 3,
        avgGrade: null,
        ungraded: 0,
        status: form.status as AdminCourseRow["status"],
      });
      setTimeout(() => {
        setOpen(false);
        setForm({ ...BLANK });
        setSave("idle");
      }, 900);
    }, 1000);
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

              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Modality</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.modality}
                    onChange={(e) => set("modality", e.target.value)}
                  >
                    {["In-person", "Hybrid", "Online"].map((m) => (
                      <option key={m}>{m}</option>
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
                disabled={
                  save !== "idle" || !form.code.trim() || !form.title.trim()
                }
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
