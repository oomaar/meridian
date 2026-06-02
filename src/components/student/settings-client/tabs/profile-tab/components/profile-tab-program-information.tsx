export function ProfileTabProgramInformation() {
  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Program information</h3>
      </div>
      <div className="m-settings-rows">
        <div className="m-settings-row">
          <span className="m-settings-row__label">Program</span>
          <span className="m-settings-row__value">
            Bachelor of Science · Computer Science
          </span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Year</span>
          <span className="m-settings-row__value">Junior (Year 3)</span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Status</span>
          <span className="m-settings-row__value">Active</span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Student ID</span>
          <span className="m-settings-row__value m-mono">STU-AU-084392</span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Enrollment date</span>
          <span className="m-settings-row__value m-mono">
            September 1, 2022
          </span>
        </div>
      </div>
    </div>
  );
}
