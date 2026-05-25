"use client";

import type { AdminUserRow } from "@/fake-db/dashboards";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { deriveEmail } from "./helpers/deriveEmail";
import { INVITE_USER_ROLES } from "./data/INVITE_USER_ROLES";
import type { InviteUserRoleOption } from "./types/InviteUserRoleOption";

type InviteUserSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (row: AdminUserRow) => void;
};

type SaveState = "idle" | "saving" | "saved";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  role: Omit<InviteUserRoleOption, "label" | "color">["id"];
  emailTouched: boolean;
  save: SaveState;
};

const initialFormState: Form = {
  firstName: "",
  lastName: "",
  email: "",
  role: "registrar",
  emailTouched: false,
  save: "idle",
};

export function InviteUserSheetDrawer({
  setOpen,
  onAdd,
}: InviteUserSheetDrawerProps) {
  const [form, setForm] = useState<Form>(initialFormState);

  function reset() {
    setForm(initialFormState);
  }

  function handleClose() {
    if (form.save === "saving") return;
    setOpen(false);
    reset();
  }

  function handleFirstChange(value: string) {
    setForm((prev) => ({ ...prev, firstName: value }));
    if (!form.emailTouched)
      setForm((prev) => ({
        ...prev,
        email: deriveEmail(value, form.lastName),
      }));
  }

  function handleLastChange(value: string) {
    setForm((prev) => ({ ...prev, lastName: value }));
    if (!form.emailTouched)
      setForm((prev) => ({
        ...prev,
        email: deriveEmail(form.firstName, value),
      }));
  }

  function handleEmailChange(value: string) {
    setForm((prev) => ({ ...prev, email: value, emailTouched: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      form.save !== "idle" ||
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.role
    )
      return;

    setForm((prev) => ({ ...prev, save: "saving" }));
    setTimeout(() => {
      setForm((prev) => ({ ...prev, save: "saved" }));

      const meta =
        INVITE_USER_ROLES.find((r) => r.id === form.role) ??
        INVITE_USER_ROLES[0];

      const row: AdminUserRow = {
        id: `user-${Date.now()}`,
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        roleId: form.role,
        roleLabel: meta.label,
        roleColor: meta.color,
        mfa: false,
        lastLogin: "Never",
        status: "invited",
      };

      setTimeout(() => {
        onAdd(row);
        setForm((prev) => ({ ...prev, save: "idle" }));
        setOpen(false);
        reset();
      }, 800);
    }, 1300);
  }

  const canSubmit =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.role &&
    form.save === "idle";

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Invite user"
      >
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
                value={form.firstName}
                onChange={(e) => handleFirstChange(e.target.value)}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Last name</span>
              <input
                className="m-field__input"
                placeholder="e.g. Halvorsen"
                value={form.lastName}
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
              value={form.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
            />
          </label>

          <label className="m-field">
            <span className="m-field__label">Role</span>
            <select
              className="m-field__input"
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, role: e.target.value }))
              }
              required
            >
              {INVITE_USER_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
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
            disabled={form.save === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {form.save === "idle" && (
              <>
                <PlusIcon size={13} /> Send invite
              </>
            )}
            {form.save === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Sending…
              </>
            )}
            {form.save === "saved" && (
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
