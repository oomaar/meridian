"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";

const PROGRAMS = [
  { code: "CS-BS",    name: "B.S. Computer Science" },
  { code: "CS-MS",    name: "M.S. Computer Science" },
  { code: "CS-PHD",   name: "Ph.D. Computer Science" },
  { code: "MATH-BS",  name: "B.S. Mathematics" },
  { code: "MATH-PHD", name: "Ph.D. Mathematics" },
  { code: "PHYS-BS",  name: "B.S. Physics" },
  { code: "BIO-BS",   name: "B.S. Molecular Biology" },
  { code: "BIO-PHD",  name: "Ph.D. Biology" },
  { code: "CHEM-BS",  name: "B.S. Chemistry" },
  { code: "ENG-BA",   name: "B.A. English" },
  { code: "LIT-BA",   name: "B.A. Comparative Literature" },
  { code: "LIT-MA",   name: "M.A. Comparative Literature" },
  { code: "HIST-BA",  name: "B.A. History" },
  { code: "PHIL-BA",  name: "B.A. Philosophy" },
  { code: "ECON-BS",  name: "B.S. Economics" },
  { code: "ECON-PHD", name: "Ph.D. Economics" },
  { code: "SOC-BA",   name: "B.A. Sociology" },
  { code: "POLI-BA",  name: "B.A. Political Science" },
  { code: "ART-BA",   name: "B.A. Art History" },
  { code: "MUS-BM",   name: "B.M. Music Performance" },
  { code: "LING-BA",  name: "B.A. Linguistics" },
];

const BLANK = {
  firstName: "",
  lastName: "",
  email: "",
  program: "CS-BS",
  standing: "Freshman",
  status: "active",
};

type SaveState = "idle" | "saving" | "saved";

function deriveEmail(first: string, last: string): string {
  if (!first && !last) return "";
  const f = first.toLowerCase().replace(/[^a-z]/g, "");
  const l = last.toLowerCase().replace(/[^a-z]/g, "");
  if (!f && !l) return "";
  const prefix = [f, l].filter(Boolean).join(".");
  return `${prefix}@aldridge.edu`;
}

export function AddStudentButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [emailTouched, setEmailTouched] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");

  function set(key: string, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      // auto-derive email unless user has manually edited it
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
    setSave("saving");
    setTimeout(() => {
      setSave("saved");
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
              {/* Name */}
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

              {/* Email */}
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

              {/* Program */}
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

              {/* Standing + Status */}
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
                {save === "idle" && <><PlusIcon size={13} /> Add student</>}
                {save === "saving" && <><Loader2Icon size={13} className="m-spin" /> Adding…</>}
                {save === "saved" && <><CheckIcon size={13} /> Added!</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
