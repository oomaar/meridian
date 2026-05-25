import { ShieldCheckIcon } from "lucide-react";
import { CardSection } from "../../components/card-section";
import { InfoRow } from "../../components/info-row";

export function SettingsSecurityTab2FA() {
  return (
    <CardSection
      title="Two-factor authentication"
      action={
        <span className="m-badge m-badge--success">
          <ShieldCheckIcon size={11} /> Enabled
        </span>
      }
    >
      <InfoRow label="Primary method" value="Authenticator app (Aegis)" />
      <InfoRow label="Backup method" value="SMS · ••••0143" mono />
      <InfoRow label="Recovery codes" value="8 of 10 unused" />
    </CardSection>
  );
}
