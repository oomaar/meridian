import { ShieldCheckIcon } from "lucide-react";

export function SecurityTab2FA() {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">Two-factor authentication</div>
        <span className="m-badge m-badge--success">
          <ShieldCheckIcon size={11} /> Enabled
        </span>
      </div>
      <div className="m-card__body">
        <div className="m-info-row">
          <span className="m-info-row__label">Primary method</span>
          <span className="m-info-row__value">Authenticator app (Aegis)</span>
        </div>
        <div className="m-info-row">
          <span className="m-info-row__label">Backup method</span>
          <span className="m-info-row__value m-mono">SMS · ••••0143</span>
        </div>
        <div className="m-info-row">
          <span className="m-info-row__label">Recovery codes</span>
          <span className="m-info-row__value">8 of 10 unused</span>
        </div>
      </div>
    </div>
  );
}
