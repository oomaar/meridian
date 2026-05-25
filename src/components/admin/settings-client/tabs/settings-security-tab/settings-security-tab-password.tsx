"use client";

import { CheckIcon, KeyRoundIcon, Loader2Icon } from "lucide-react";
import { CardSection } from "../../components/card-section";
import { InfoRow } from "../../components/info-row";
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

export function SettingsSecurityTabPassword() {
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
      setTimeout(() => {
        setForm(initialForm);
      }, 1800);
    }, 1200);
  }
  return (
    <CardSection
      title="Password"
      action={
        !form.isChangingPassword && (
          <button
            className="m-btn m-btn--sm"
            onClick={() =>
              setForm((prev) => ({ ...prev, isChangingPassword: true }))
            }
          >
            <KeyRoundIcon size={13} /> Change
          </button>
        )
      }
    >
      {!form.isChangingPassword ? (
        <>
          <InfoRow label="Last changed" value="42 days ago" mono />
          <InfoRow label="Strength" value="Strong" />
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
                setForm((prev) => ({ ...prev, newPassword: e.target.value }))
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
              <p className="text-[12px] text-m-danger">
                Passwords do not match.
              </p>
            )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="m-btn m-btn--ghost m-btn--sm"
              onClick={() =>
                setForm((prev) => ({ ...prev, isChangingPassword: false }))
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
    </CardSection>
  );
}
