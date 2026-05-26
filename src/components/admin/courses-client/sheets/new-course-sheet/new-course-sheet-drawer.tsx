"use client";

import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { DEPARTMENT_COLORS } from "./data/DEPARTMENT_COLORS";
import { DEPARTMENTS } from "@/fake-db/lookups";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  code: string;
  title: string;
  department: string;
  credits: string;
  cap: string;
  modality: string;
  status: string;
  save: SaveState;
};

const initialForm: Form = {
  code: "",
  title: "",
  department: "CS",
  credits: "3",
  cap: "30",
  modality: "In-person",
  status: "active",
  save: "idle",
};

type NewCourseSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminCourseRow) => void;
};

export function NewCourseSheetDrawer({
  setOpen,
  onAdd,
}: NewCourseSheetDrawerProps) {
  const [form, setForm] = useState(initialForm);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent,
  ) {
    e.preventDefault();
    if (form.save !== "idle" || !form.code.trim() || !form.title.trim()) return;
    setForm((f) => ({ ...f, save: "saving" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "saved" }));
      onAdd?.({
        id: `new-${form.code}-${Date.now()}`,
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        instructorName: "—",
        deptCode: form.department,
        deptColor: DEPARTMENT_COLORS[form.department] ?? "var(--m-accent)",
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
        setForm({ ...initialForm });
      }, 900);
    }, 1000);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    setForm({ ...initialForm });
  }

  return (
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
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
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
            disabled={form.save === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={
              form.save !== "idle" || !form.code.trim() || !form.title.trim()
            }
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Create course
              </>
            )}
            {form.save === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Creating…
              </>
            )}
            {form.save === "saved" && (
              <>
                <CheckIcon size={13} /> Created!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
