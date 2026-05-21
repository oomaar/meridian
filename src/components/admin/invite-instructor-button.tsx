"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import type { InstructorTitle } from "@/fake-db/types";

const DEPARTMENTS = [
  { code: "CS",   name: "Computer Science" },
  { code: "MATH", name: "Mathematics" },
  { code: "PHYS", name: "Physics" },
  { code: "BIO",  name: "Biology" },
  { code: "CHEM", name: "Chemistry" },
  { code: "ENG",  name: "English" },
  { code: "LIT",  name: "Comparative Literature" },
  { code: "HIST", name: "History" },
  { code: "PHIL", name: "Philosophy" },
  { code: "ECON", name: "Economics" },
  { code: "SOC",  name: "Sociology" },
  { code: "POLI", name: "Political Science" },
  { code: "ART",  name: "Art History" },
  { code: "MUS",  name: "Music" },
  { code: "LING", name: "Linguistics" },
];

const TITLES = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Adjunct",
];

const DEPT_COLORS: Record<string, string> = {
  CS: "var(--m-info)", MATH: "#9a7fc4", PHYS: "var(--m-accent)",
  BIO: "var(--m-success)", CHEM: "var(--m-success)", ENG: "var(--m-accent)",
  LIT: "var(--m-accent)", HIST: "var(--m-warning)", PHIL: "var(--m-info)",
  ECON: "var(--m-danger)", SOC: "var(--m-warning)", POLI: "var(--m-danger)",
  ART: "var(--m-warning)", MUS: "#9a7fc4", LING: "var(--m-info)",
};

const BLANK = {
  firstName: "",
  lastName: "",
  email: "",
  dept: "CS",
  title: "Assistant Professor",
};

type SaveState = "idle" | "sending" | "sent";

function deriveEmail(first: string, last: string): string {
  const f = first.toLowerCase().replace(/[^a-z]/g, "");
  const l = last.toLowerCase().replace(/[^a-z]/g, "");
  if (!f && !l) return "";
  return `${[f, l].filter(Boolean).join(".")}@aldridge.edu`;
}

export function InviteInstructorButton({ onAdd }: { onAdd?: (row: AdminInstructorRow) => void } = {}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [emailTouched, setEmailTouched] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");

  function set(key: string, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if ((key === "firstName" || key === "lastName") && !emailTouched) {
        next.email = deriveEmail(
          key === "firstName" ? val : f.firstName,
          key === "lastName" ? val : f.lastName
        );
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle") return;
    setSave("sending");
    setTimeout(() => {
      setSave("sent");
      const dept = DEPARTMENTS.find((d) => d.code === form.dept);
      onAdd?.({
        id:               `new-${Date.now()}`,
        fullName:         `${form.firstName.trim()} ${form.lastName.trim()}`,
        email:            form.email.trim(),
        title:            form.title as InstructorTitle,
        deptCode:         form.dept,
        deptName:         dept?.name ?? form.dept,
        deptColor:        DEPT_COLORS[form.dept] ?? "var(--m-accent)",
        status:           "active",
        rating:           0,
        courseCount:      0,
        activeCourseCount: 0,
        hireDate:         String(new Date().getFullYear()),
      });
      setTimeout(() => {
        setSave("idle");
        setOpen(false);
        setForm({ ...BLANK });
        setEmailTouched(false);
      }, 1000);
    }, 1400);
  }

  function handleClose() {
    if (save === "sending") return;
    setOpen(false);
    setForm({ ...BLANK });
    setEmailTouched(false);
    setSave("idle");
  }

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <SendIcon size={13} /> Invite instructor
      </button>

      {open && (
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
                    setEmailTouched(true);
                    set("email", e.target.value);
                  }}
                  required
                />
              </label>

              <div className="m-fields-2">
                <label className="m-field">
                  <span className="m-field__label">Department</span>
                  <select
                    className="m-field__input m-field__select"
                    value={form.dept}
                    onChange={(e) => set("dept", e.target.value)}
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
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="m-invite-note">
                An invitation email will be sent to the address above. The
                instructor can set their password and complete their profile
                before their first semester.
              </p>
            </form>

            <div className="m-sheet__foot">
              <button
                className="m-btn m-btn--ghost"
                onClick={handleClose}
                disabled={save === "sending"}
              >
                Cancel
              </button>
              <button
                className="m-btn m-btn--primary"
                disabled={save !== "idle"}
                onClick={handleSubmit}
              >
                {save === "idle" && <><SendIcon size={13} /> Send invite</>}
                {save === "sending" && <><Loader2Icon size={13} className="m-spin" /> Sending…</>}
                {save === "sent" && <><CheckIcon size={13} /> Sent!</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
