import { CardSection } from "../../components/card-section";
import { InfoRow } from "../../components/info-row";

export function SettingsProfileTabQuickFacts() {
  return (
    <CardSection title="Quick facts">
      <InfoRow label="Last login" value="12 minutes ago" mono />
      <InfoRow label="Sessions" value="3 active devices" mono />
      <InfoRow label="MFA" value="Enabled · Authenticator" mono />
    </CardSection>
  );
}
