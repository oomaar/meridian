export function ProfileTabAvatar() {
  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Avatar</h3>
      </div>
      <div className="m-settings-avatar">
        <div className="m-avatar m-avatar--lg">IH</div>
        <button className="m-btn">Upload image</button>
        <p className="m-settings-avatar__hint">PNG or JPG, max 2 MB</p>
      </div>
    </div>
  );
}
