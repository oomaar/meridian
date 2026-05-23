import { SettingsFormState } from "../settings";

type SettingsGradingPolicyProps = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
};

export function SettingsGradingPolicy({
  settingsForm,
  setSF,
}: SettingsGradingPolicyProps) {
  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">Grading policy</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Grade scale</span>
          <select
            className="m-field__input m-field__select m-field--lg"
            value={settingsForm.gradeScale}
            onChange={(e) => setSF("gradeScale", e.target.value)}
          >
            <option value="letter">Letter grades (A–F)</option>
            <option value="percent">Percentage (0–100)</option>
            <option value="passfail">Pass / Fail</option>
          </select>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Late submission penalty</span>
          <select
            className="m-field__input m-field__select m-field--lg"
            value={settingsForm.latePenalty}
            onChange={(e) => setSF("latePenalty", e.target.value)}
          >
            <option value="none">No penalty</option>
            <option value="10pct">10% per day</option>
            <option value="20pct">20% per day</option>
            <option value="zero">Zero credit</option>
          </select>
        </div>
      </div>
    </div>
  );
}
