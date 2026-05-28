import { SettingsFormState } from "../settings";

type Props = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
};

export function SettingsEnrollment({ settingsForm, setSF }: Props) {
  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">Enrollment</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Enrollment cap</span>
          <input
            className="m-field__input m-mono m-field--sm"
            type="number"
            min={1}
            max={500}
            value={settingsForm.cap}
            onChange={(e) => setSF("cap", e.target.value)}
          />
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Enable waitlist</span>
          <button
            className="m-toggle"
            aria-pressed={settingsForm.waitlist}
            onClick={() => setSF("waitlist", !settingsForm.waitlist)}
          >
            <span className="m-toggle__track">
              <span className="m-toggle__thumb" />
            </span>
            {settingsForm.waitlist ? "On" : "Off"}
          </button>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Auto-close when full</span>
          <button
            className="m-toggle"
            aria-pressed={settingsForm.autoClose}
            onClick={() => setSF("autoClose", !settingsForm.autoClose)}
          >
            <span className="m-toggle__track">
              <span className="m-toggle__thumb" />
            </span>
            {settingsForm.autoClose ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
}
