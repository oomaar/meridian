"use client";

import type { AdminStudentRow } from "@/fake-db/dashboards";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { StudentStatus } from "@/fake-db";
import { PROGRAMS } from "@/fake-db/lookups";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  standing: string;
  status: string;
  emailTouched: boolean;
  save: SaveState;
};

const initialForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  program: "CS-BS",
  standing: "Freshman",
  status: "active",
  emailTouched: false,
  save: "idle",
};

type AddStudentSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminStudentRow) => void;
};

export function AddStudentSheetDrawer({
  setOpen,
  onAdd,
}: AddStudentSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.save !== "idle") return;
    setForm((f) => ({ ...f, save: "saving" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "saved" }));
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
        setForm(initialForm);
      }, 900);
    }, 1400);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    setForm(initialForm);
  }

  return (
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Last name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Chen"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
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
                setForm((f) => ({
                  ...f,
                  email: e.target.value,
                  emailTouched: true,
                }));
              }}
              required
            />
          </label>

          <label className="m-field">
            <span className="m-field__label">Program</span>
            <select
              className="m-field__input m-field__select"
              value={form.program}
              onChange={(e) =>
                setForm((f) => ({ ...f, program: e.target.value }))
              }
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, standing: e.target.value }))
                }
              >
                {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="m-field">
              <span className="m-field__label">Status</span>
              <select
                className="m-field__input m-field__select"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
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
            disabled={form.save === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={form.save !== "idle"}
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Add student
              </>
            )}
            {form.save === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Adding…
              </>
            )}
            {form.save === "saved" && (
              <>
                <CheckIcon size={13} /> Added!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
