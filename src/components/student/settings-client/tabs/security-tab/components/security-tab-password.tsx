"use client";

import { CheckIcon, KeyRoundIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

type PasswordState = "idle" | "saving" | "saved";

type Form = {
  isChangingPassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordState: PasswordState;
};

const initialForm: Form = {
  isChangingPassword: false,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  passwordState: "idle",
};

export function SecurityTabPassword() {
  const [form, setForm] = useState<Form>(initialForm);

  function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (
      form.passwordState !== "idle" ||
      !form.currentPassword ||
      !form.newPassword ||
      form.newPassword !== form.confirmPassword
    )
      return;
    setForm((prev) => ({ ...prev, passwordState: "saving" }));
    setTimeout(() => {
      setForm((prev) => ({ ...prev, passwordState: "saved" }));
      setTimeout(() => setForm(initialForm), 1800);
    }, 1200);
  }

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">Password</div>
        {!form.isChangingPassword && (
          <button
            className="m-btn m-btn--sm"
            onClick={() =>
              setForm((prev) => ({ ...prev, isChangingPassword: true }))
            }
          >
            <KeyRoundIcon size={13} /> Change
          </button>
        )}
      </div>
      <div className="m-card__body">
        {!form.isChangingPassword ? (
          <>
            <div className="m-info-row">
              <span className="m-info-row__label">Last changed</span>
              <span className="m-info-row__value m-mono">42 days ago</span>
            </div>
            <div className="m-info-row">
              <span className="m-info-row__label">Strength</span>
              <span className="m-info-row__value">Strong</span>
            </div>
          </>
        ) : (
          <form onSubmit={handleChangePw} className="m-stack gap-3">
            <label className="m-field">
              <span className="m-field__label">Current password</span>
              <input
                type="password"
                className="m-field__input"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">New password</span>
              <input
                type="password"
                className="m-field__input"
                value={form.newPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Confirm new password</span>
              <input
                type="password"
                className="m-field__input"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
            </label>
            {form.newPassword &&
              form.confirmPassword &&
              form.newPassword !== form.confirmPassword && (
                <p className="m-field-error">Passwords do not match.</p>
              )}
            <div className="m-security-form-actions">
              <button
                type="button"
                className="m-btn m-btn--ghost m-btn--sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isChangingPassword: false,
                  }))
                }
                disabled={form.passwordState === "saving"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="m-btn m-btn--primary m-btn--sm"
                disabled={
                  !form.currentPassword ||
                  !form.newPassword ||
                  form.newPassword !== form.confirmPassword ||
                  form.passwordState !== "idle"
                }
              >
                {form.passwordState === "idle" && "Update password"}
                {form.passwordState === "saving" && (
                  <>
                    <Loader2Icon size={12} className="m-spin" /> Updating…
                  </>
                )}
                {form.passwordState === "saved" && (
                  <>
                    <CheckIcon size={12} /> Updated!
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
