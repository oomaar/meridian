"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import type { AdminUserRow } from "@/fake-db/dashboards";

interface InviteUserButtonProps {
  onAdd: (row: AdminUserRow) => void;
}

type SaveState = "idle" | "saving" | "saved";

type RoleOption = {
  id: string;
  label: string;
  color: string;
};

const ROLES: RoleOption[] = [
  { id: "admin",      label: "Administrator", color: "var(--m-danger)"  },
  { id: "registrar",  label: "Registrar",     color: "var(--m-accent)"  },
  { id: "admissions", label: "Admissions",    color: "var(--m-warning)" },
  { id: "it",         label: "IT Staff",      color: "var(--m-info)"    },
  { id: "dean",       label: "Dean & Chair",  color: "var(--m-warning)" },
];

function deriveEmail(first: string, last: string): string {
  if (!first && !last) return "";
  const f = first.toLowerCase().replace(/\s+/g, "");
  const l = last.toLowerCase().replace(/\s+/g, "");
  if (!l) return f ? `${f}@aldridge.edu` : "";
  return `${f}.${l}@aldridge.edu`;
}

export function InviteUserButton({ onAdd }: InviteUserButtonProps) {
  const [open,         setOpen]         = useState(false);
  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [role,         setRole]         = useState("registrar");
  const [save,         setSave]         = useState<SaveState>("idle");

  function reset() {
    setFirstName(""); setLastName("");
    setEmail(""); setEmailTouched(false);
    setRole("registrar"); setSave("idle");
  }

  function handleClose() {
    if (save === "saving") return;
    setOpen(false);
    reset();
  }

  function handleFirstChange(v: string) {
    setFirstName(v);
    if (!emailTouched) setEmail(deriveEmail(v, lastName));
  }

  function handleLastChange(v: string) {
    setLastName(v);
    if (!emailTouched) setEmail(deriveEmail(firstName, v));
  }

  function handleEmailChange(v: string) {
    setEmail(v);
    setEmailTouched(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (save !== "idle" || !firstName || !lastName || !email || !role) return;

    setSave("saving");
    setTimeout(() => {
      setSave("saved");

      const meta = ROLES.find((r) => r.id === role) ?? ROLES[0];
      const row: AdminUserRow = {
        id:        `user-${Date.now()}`,
        fullName:  `${firstName} ${lastName}`,
        email,
        roleId:    role,
        roleLabel: meta.label,
        roleColor: meta.color,
        mfa:       false,
        lastLogin: "Never",
        status:    "invited",
      };

      setTimeout(() => {
        onAdd(row);
        setSave("idle");
        setOpen(false);
        reset();
      }, 800);
    }, 1300);
  }

  const canSubmit = firstName && lastName && email && role && save === "idle";

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> Invite user
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div className="m-sheet" role="dialog" aria-modal="true" aria-label="Invite user">
            <div className="m-sheet__head">
              <span className="m-sheet__title">Invite user</span>
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
                    placeholder="e.g. Ines"
                    value={firstName}
                    onChange={(e) => handleFirstChange(e.target.value)}
                    required
                  />
                </label>
                <label className="m-field">
                  <span className="m-field__label">Last name</span>
                  <input
                    className="m-field__input"
                    placeholder="e.g. Halvorsen"
                    value={lastName}
                    onChange={(e) => handleLastChange(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="m-field">
                <span className="m-field__label">Email address</span>
                <input
                  className="m-field__input m-mono"
                  type="email"
                  placeholder="name@aldridge.edu"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                />
              </label>

              <label className="m-field">
                <span className="m-field__label">Role</span>
                <select
                  className="m-field__input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </label>

              <p className="m-invite-note">
                An invitation email will be sent to the address above. The user
                starts with <b>Invited</b> status and can activate their account
                within 7 days.
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
                {save === "idle"   && <><PlusIcon size={13} /> Send invite</>}
                {save === "saving" && <><Loader2Icon size={13} className="m-spin" /> Sending…</>}
                {save === "saved"  && <><CheckIcon size={13} /> Sent!</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
