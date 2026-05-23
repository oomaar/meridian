import { AdminCourseDTO } from "@/fake-db/dashboards";
import { SettingsFormState } from "../settings";

type SettingsGeneralProps = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
  course: AdminCourseDTO;
};

export function SettingsGeneral({
  settingsForm,
  setSF,
  course,
}: SettingsGeneralProps) {
  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">General</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Course title</span>
          <input
            className="m-field__input m-field--xl"
            value={settingsForm.title}
            onChange={(e) => setSF("title", e.target.value)}
          />
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Credits</span>
          <select
            className="m-field__input m-field__select m-field--md"
            value={settingsForm.credits}
            onChange={(e) => setSF("credits", e.target.value)}
          >
            {["1", "2", "3", "4"].map((v) => (
              <option key={v} value={v}>
                {v} credit{v !== "1" ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Modality</span>
          <select
            className="m-field__input m-field__select m-field--md"
            value={settingsForm.modality}
            onChange={(e) => setSF("modality", e.target.value)}
          >
            {["In-person", "Hybrid", "Online"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Location</span>
          <span className="m-settings-row__value m-mono">
            {course.location.building} {course.location.room}
          </span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Schedule</span>
          <span className="m-settings-row__value m-mono">
            {course.meetingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
