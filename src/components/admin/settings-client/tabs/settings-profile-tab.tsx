import { useState } from "react";
import { CardSection } from "../components/card-section";
import { CheckIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { InfoRow } from "../components/info-row";

export function SettingsProfileTab() {
  const [displayName, setDisplayName] = useState("Ines Halvorsen");
  const [preferredName, setPreferredName] = useState("Ines");
  const [phone, setPhone] = useState("+1 (415) 555-0143");
  const [office, setOffice] = useState("Tucker Hall · 218");
  const [pronouns, setPronouns] = useState("she/her");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 1100);
  }

  return (
    <div className="m-grid m-grid-2-1">
      <div className="m-stack">
        <CardSection
          title="Personal details"
          action={
            <button
              className="m-btn m-btn--primary m-btn--sm"
              onClick={handleSave}
              disabled={saveState === "saving"}
            >
              {saveState === "idle" && "Save changes"}
              {saveState === "saving" && (
                <>
                  <Loader2Icon size={12} className="m-spin" /> Saving…
                </>
              )}
              {saveState === "saved" && (
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
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Preferred name</span>
              <input
                className="m-field__input"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Email</span>
              <input
                className="m-field__input m-mono"
                value="i.halvorsen@aldridge.edu"
                disabled
                style={{ fontSize: 12, color: "var(--m-text-3)" }}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Phone</span>
              <input
                className="m-field__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Office</span>
              <input
                className="m-field__input"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Pronouns</span>
              <input
                className="m-field__input"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
              />
            </label>
          </div>
        </CardSection>

        <CardSection title="Affiliations">
          <InfoRow label="Institution" value="Aldridge University" />
          <InfoRow label="Department" value="Office of the Registrar" />
          <InfoRow label="Title" value="Registrar" />
          <InfoRow label="Manager" value="Prof. Hyun-woo Kim · Provost" />
          <InfoRow label="Joined" value="February 14, 2019" mono />
          <InfoRow label="Employee ID" value="AU-EMP-21038" mono />
        </CardSection>
      </div>

      <div className="m-stack">
        <CardSection title="Avatar">
          <div className="flex flex-col items-center gap-4 py-0 px-1.5">
            <div className="m-settings-avatar">IH</div>
            <button className="m-btn">
              <UploadIcon size={13} /> Upload image
            </button>
            <span className="text-[11.5px] text-m-text-3 text-center">
              PNG or JPG, max 2 MB. Square recommended.
            </span>
          </div>
        </CardSection>

        <CardSection title="Quick facts">
          <InfoRow label="Last login" value="12 minutes ago" mono />
          <InfoRow label="Sessions" value="3 active devices" mono />
          <InfoRow label="MFA" value="Enabled · Authenticator" mono />
        </CardSection>
      </div>
    </div>
  );
}
