"use client";

import { CheckIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { DEPARTMENTS } from "./data/DEPARTMENTS";
import { TITLES } from "./data/TITLES";
import { Dispatch, SetStateAction, useState } from "react";
import { deriveEmail } from "./helpers/deriveEmail";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import type { InstructorTitle } from "@/fake-db";
import { DEPTARTMENT_COLORS } from "./data/DEPTARTMENT_COLORS";

type InviteInstructorSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd?: (row: AdminInstructorRow) => void;
};

type SaveState = "idle" | "sending" | "sent";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  emailTouched: boolean;
  save: SaveState;
};

const initialForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  department: "CS",
  title: "Assistant Professor",
  emailTouched: false,
  save: "idle",
};

export function InviteInstructorSheetDrawer({
  setOpen,
  onAdd,
}: InviteInstructorSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);

  function set(key: string, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if ((key === "firstName" || key === "lastName") && !form.emailTouched) {
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
    if (form.save !== "idle") return;

    setForm((f) => ({ ...f, save: "sending" }));
    setTimeout(() => {
      setForm((f) => ({ ...f, save: "sent" }));
      const dept = DEPARTMENTS.find((d) => d.code === form.department);
      onAdd?.({
        id: `new-${Date.now()}`,
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        title: form.title as InstructorTitle,
        deptCode: form.department,
        deptName: dept?.name ?? form.department,
        deptColor: DEPTARTMENT_COLORS[form.department] ?? "var(--m-accent)",
        status: "active",
        rating: 0,
        courseCount: 0,
        activeCourseCount: 0,
        hireDate: String(new Date().getFullYear()),
      });
      setTimeout(() => {
        setForm(initialForm);
      }, 1000);
    }, 1400);
  }

  function handleClose() {
    if (form.save === "sending") return;
    setForm(initialForm);
    setOpen(false);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Invite instructor"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Invite instructor</span>
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
                placeholder="e.g. Linnea"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Last name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Ahmadi"
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
                const emailVal = e.target.value;
                setForm((f) => ({ ...f, emailTouched: true, email: emailVal }));
              }}
              required
            />
          </label>

          <div className="m-fields-2">
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
            <label className="m-field">
              <span className="m-field__label">Rank</span>
              <select
                className="m-field__input m-field__select"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              >
                {TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="m-invite-note">
            An invitation email will be sent to the address above. The
            instructor can set their password and complete their profile before
            their first semester.
          </p>
        </form>

        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={form.save === "sending"}
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
                <SendIcon size={13} /> Send invite
              </>
            )}
            {form.save === "sending" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Sending…
              </>
            )}
            {form.save === "sent" && (
              <>
                <CheckIcon size={13} /> Sent!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
