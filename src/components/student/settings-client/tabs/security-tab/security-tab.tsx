import { SecurityTabPassword } from "./components/security-tab-password";
import { SecurityTab2FA } from "./components/security-tab-2fa";
import { SecurityTabSessions } from "./components/security-tab-sessions";

export function SecurityTab() {
  return (
    <div className="m-stack">
      <SecurityTabPassword />
      <SecurityTab2FA />
      <SecurityTabSessions />
    </div>
  );
}
