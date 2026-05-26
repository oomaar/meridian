import type { SettingsFormState } from "../settings";

type SettingsCourseNotificationsProps = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
};

export function SettingsCourseNotifications({
  settingsForm,
  setSF,
}: SettingsCourseNotificationsProps) {
  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">Notifications</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Email on new content</span>
          <button
            className="m-toggle"
            aria-pressed={settingsForm.emailNew}
            onClick={() => setSF("emailNew", !settingsForm.emailNew)}
          >
            <span className="m-toggle__track">
              <span className="m-toggle__thumb" />
            </span>
            {settingsForm.emailNew ? "On" : "Off"}
          </button>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Email on grades posted</span>
          <button
            className="m-toggle"
            aria-pressed={settingsForm.emailGrades}
            onClick={() => setSF("emailGrades", !settingsForm.emailGrades)}
          >
            <span className="m-toggle__track">
              <span className="m-toggle__thumb" />
            </span>
            {settingsForm.emailGrades ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
}
