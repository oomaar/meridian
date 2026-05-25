import { SettingsSecurityTabPassword } from "./settings-security-tab-password";
import { SettingsSecurityTab2FA } from "./settings-security-tab-2fa";
import { SettingsSecurityTabActiveSessions } from "./settings-security-tab-active-sessions";

export function SettingsSecurityTab() {
  return (
    <div className="m-stack">
      <SettingsSecurityTabPassword />
      <SettingsSecurityTab2FA />
      <SettingsSecurityTabActiveSessions />
    </div>
  );
}
