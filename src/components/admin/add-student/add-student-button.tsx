"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import type { StudentStatus } from "@/fake-db/types";
import { BLANK } from "./data/BLANK";
import { deriveEmail } from "./utils/deriveEmail";
import { PROGRAMS } from "@/fake-db/lookups";

type AddStudentButtonProps = { onAdd?: (row: AdminStudentRow) => void };

export function AddStudentButton({ onAdd }: AddStudentButtonProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [emailTouched, setEmailTouched] = useState(false);
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");

  function set(key: string, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if ((key === "firstName" || key === "lastName") && !emailTouched) {
        next.email = deriveEmail(
          key === "firstName" ? val : f.firstName,
          key === "lastName" ? val : f.lastName,
        );
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle") return;
    setSave("saving");
    setTimeout(() => {
      setSave("saved");
      const prog = PROGRAMS.find((p) => p.code === form.program);
      onAdd?.({
        id: `new-${Date.now()}`,
        studentNumber: `STU-${String(Date.now()).slice(-6)}`,
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        programName: prog?.name ?? form.program,
        programCode: form.program,
        standing: form.standing,
        gpa: 0.0,
        credits: 0,
        status: form.status as StudentStatus,
        advisorName: "Unassigned",
        lastActive: "just now",
        isAdvisee: false,
      });
      setTimeout(() => {
        setSave("idle");
        setOpen(false);
        setForm({ ...BLANK });
        setEmailTouched(false);
      }, 900);
    }, 1400);
  }

  function handleClose() {
    if (save === "saving") return;
    setOpen(false);
    setForm({ ...BLANK });
    setEmailTouched(false);
    setSave("idle");
  }

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> Add student
      </button>
      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Add student"
          >
            <div className="m-sheet__head">
              <span className="m-sheet__title">Add student</span>
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
                  <span className="m-field__label">First name</span>
                  <input
                    className="m-field__input"
                    placeholder="e.g. Mei Lin"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">Last name</span>
                  <input
                    className="m-field__input"
                    placeholder="e.g. Chen"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="m-field">
                <span className="m-field__label">University email</span>
                <input
                  className="m-field__input m-mono"
                  placeholder="firstname.lastname@aldridge.edu"
                  value={form.email}
                  onChange={(e) => {
                    setEmailTouched(true);
                    set("email", e.target.value);
                  }}
                  required
                />
              </label>

              <label className="m-field">
                <span className="m-field__label">Program</span>
                <select
                  className="m-field__input m-field__select"
                  value={form.program}
                  onChange={(e) => set("program", e.target.value)}
                >
                  {PROGRAMS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Standing</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.standing}
                    onChange={(e) => set("standing", e.target.value)}
                  >
                    {[
                      "Freshman",
                      "Sophomore",
                      "Junior",
                      "Senior",
                      "Graduate",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
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
                    <option value="leave">On leave</option>
                    <option value="probation">Probation</option>
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
                    <PlusIcon size={13} /> Add student
                  </>
                )}
                {save === "saving" && (
                  <>
                    <Loader2Icon size={13} className="m-spin" /> Adding…
                  </>
                )}
                {save === "saved" && (
                  <>
                    <CheckIcon size={13} /> Added!
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
