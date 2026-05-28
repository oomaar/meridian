import { useState } from "react";
import { CardSection } from "../../components/card-section";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { SettingsProfileTabQuickFacts } from "./settings-profile-tab-quick-facts";
import { SettingsProfileTabAvatar } from "./settings-profile-tab-avatar";
import { SettingsProfileTabAffiliations } from "./settings-profile-tab-affiliations";

type SaveState = "idle" | "saving" | "saved";

type Form = {
  displayName: string;
  preferredName: string;
  phone: string;
  office: string;
  pronouns: string;
  saveState: SaveState;
};

const initialForm: Form = {
  displayName: "Ines Halvorsen",
  preferredName: "Ines",
  phone: "+1 (415) 555-0143",
  office: "Tucker Hall · 218",
  pronouns: "she/her",
  saveState: "idle",
};

export function SettingsProfileTab() {
  const [form, setForm] = useState<Form>(initialForm);

  function handleSave() {
    if (form.saveState !== "idle") return;
    setForm((prev) => ({ ...prev, saveState: "saving" }));
    setTimeout(() => {
      setForm((prev) => ({ ...prev, saveState: "saved" }));
      setTimeout(
        () => setForm((prev) => ({ ...prev, saveState: "idle" })),
        2000,
      );
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
                  setForm((prev) => ({ ...prev, displayName: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Preferred name</span>
              <input
                className="m-field__input"
                value={form.preferredName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    preferredName: e.target.value,
                  }))
                }
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
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Office</span>
              <input
                className="m-field__input"
                value={form.office}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, office: e.target.value }))
                }
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Pronouns</span>
              <input
                className="m-field__input"
                value={form.pronouns}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, pronouns: e.target.value }))
                }
              />
            </label>
          </div>
        </CardSection>
        <SettingsProfileTabAffiliations />
      </div>

      <div className="m-stack">
        <SettingsProfileTabAvatar />
        <SettingsProfileTabQuickFacts />
      </div>
    </div>
  );
}
