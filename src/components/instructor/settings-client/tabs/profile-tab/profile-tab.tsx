"use client";

import { CardSection } from "@/components/admin/settings-client/components/card-section";
import { InfoRow } from "@/components/admin/settings-client/components/info-row";
import { CheckIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  displayName: string;
  preferredName: string;
  phone: string;
  office: string;
  pronouns: string;
  saveState: SaveState;
};

const INITIAL: Form = {
  displayName: "Dr. Leila Okonkwo",
  preferredName: "Leila",
  phone: "+1 (617) 555-0284",
  office: "Carver Building · 314",
  pronouns: "she/her",
  saveState: "idle",
};

export function ProfileTab() {
  const [form, setForm] = useState<Form>(INITIAL);

  function handleSave() {
    if (form.saveState !== "idle") return;
    setForm((p) => ({ ...p, saveState: "saving" }));
    setTimeout(() => {
      setForm((p) => ({ ...p, saveState: "saved" }));
      setTimeout(() => setForm((p) => ({ ...p, saveState: "idle" })), 2000);
    }, 1100);
  }

  return (
    <div className="m-settings-grid m-settings-grid--2-1">
      <div className="m-settings-stack">
        <CardSection
          title="Personal details"
          action={
            <button
              className="m-btn m-btn--primary m-btn--sm"
              onClick={handleSave}
              disabled={form.saveState === "saving"}
            >
              {form.saveState === "idle" && "Save changes"}
              {form.saveState === "saving" && (
                <>
                  <Loader2Icon size={12} className="m-spin" /> Saving…
                </>
              )}
              {form.saveState === "saved" && (
                <>
                  <CheckIcon size={12} /> Saved
                </>
              )}
            </button>
          }
        >
          <div className="m-grid m-grid-2 gap-3.5">
            <label className="m-field">
              <span className="m-field__label">Display name</span>
              <input
                className="m-field__input"
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Preferred name</span>
              <input
                className="m-field__input"
                value={form.preferredName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, preferredName: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Email</span>
              <input
                className="m-field__input m-mono"
                value="l.okonkwo@aldridge.edu"
                disabled
                style={{ fontSize: 12, color: "var(--m-text-3)" }}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Phone</span>
              <input
                className="m-field__input"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Office</span>
              <input
                className="m-field__input"
                value={form.office}
                onChange={(e) =>
                  setForm((p) => ({ ...p, office: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Pronouns</span>
              <input
                className="m-field__input"
                value={form.pronouns}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pronouns: e.target.value }))
                }
              />
            </label>
          </div>
        </CardSection>

        <CardSection title="Faculty affiliations">
          <InfoRow label="Institution" value="Aldridge University" />
          <InfoRow label="Department" value="Computer Science" />
          <InfoRow label="Title" value="Associate Professor" />
          <InfoRow label="Tenure status" value="Tenured" />
          <InfoRow label="Joined" value="September 1, 2017" mono />
          <InfoRow label="Employee ID" value="AU-FAC-30271" mono />
        </CardSection>
      </div>

      <div className="m-settings-stack">
        <CardSection title="Avatar">
          <div className="flex flex-col items-center gap-4 py-0 px-1.5">
            <div className="m-settings-avatar">
              <span
                className="m-avatar"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: 28,
                  fontFamily: "var(--m-font-serif)",
                  background: "var(--m-accent-bg)",
                  color: "var(--m-accent)",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                }}
              >
                LO
              </span>
            </div>
            <button className="m-btn">
              <UploadIcon size={13} /> Upload image
            </button>
            <span className="text-[11.5px] text-m-text-3 text-center">
              PNG or JPG, max 2 MB. Square recommended.
            </span>
          </div>
        </CardSection>

        <CardSection title="Quick facts">
          <InfoRow label="Last login" value="34 minutes ago" mono />
          <InfoRow label="Sessions" value="2 active devices" mono />
          <InfoRow label="MFA" value="Enabled · Authenticator" mono />
          <InfoRow label="Courses this term" value="3 active" />
          <InfoRow label="Total students" value="87 enrolled" />
        </CardSection>
      </div>
    </div>
  );
}
