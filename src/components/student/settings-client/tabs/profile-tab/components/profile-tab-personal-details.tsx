export function ProfileTabPersonalDetails() {
  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Personal details</h3>
      </div>
      <div className="m-settings-form-grid">
        <div className="m-form-field">
          <label>Display name</label>
          <input type="text" defaultValue="Ines Halvorsen" />
        </div>
        <div className="m-form-field">
          <label>Preferred name</label>
          <input type="text" defaultValue="Ines" />
        </div>
        <div className="m-form-field">
          <label>Email</label>
          <input
            type="email"
            defaultValue="i.halvorsen@aldridge.edu"
            disabled
          />
        </div>
        <div className="m-form-field">
          <label>Phone</label>
          <input type="tel" defaultValue="+1 (415) 555-0143" />
        </div>
        <div className="m-form-field">
          <label>Pronouns</label>
          <input type="text" defaultValue="she/her" />
        </div>
      </div>
    </div>
  );
}
