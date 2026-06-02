export function ProfileTabQuickFacts() {
  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Quick facts</h3>
      </div>
      <div className="m-settings-rows">
        <div className="m-settings-row">
          <span className="m-settings-row__label">GPA</span>
          <span className="m-settings-row__value m-mono">3.72</span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Credits earned</span>
          <span className="m-settings-row__value m-mono">87</span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Last login</span>
          <span className="m-settings-row__value m-mono">12 minutes ago</span>
        </div>
      </div>
    </div>
  );
}
