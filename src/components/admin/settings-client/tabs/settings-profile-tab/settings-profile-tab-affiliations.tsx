import { CardSection } from "../../components/card-section";
import { InfoRow } from "../../components/info-row";

export function SettingsProfileTabAffiliations() {
  return (
    <CardSection title="Affiliations">
      <InfoRow label="Institution" value="Aldridge University" />
      <InfoRow label="Department" value="Office of the Registrar" />
      <InfoRow label="Title" value="Registrar" />
      <InfoRow label="Manager" value="Prof. Hyun-woo Kim · Provost" />
      <InfoRow label="Joined" value="February 14, 2019" mono />
      <InfoRow label="Employee ID" value="AU-EMP-21038" mono />
    </CardSection>
  );
}
