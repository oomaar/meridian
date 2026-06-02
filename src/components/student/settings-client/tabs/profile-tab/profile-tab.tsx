import { ProfileTabAvatar } from "./components/profile-tab-avatar";
import { ProfileTabPersonalDetails } from "./components/profile-tab-personal-details";
import { ProfileTabProgramInformation } from "./components/profile-tab-program-information";
import { ProfileTabQuickFacts } from "./components/profile-tab-quick-facts";

export function ProfileTab() {
  return (
    <div className="m-settings-grid m-settings-grid--2-1">
      <div className="m-settings-stack">
        <ProfileTabPersonalDetails />
        <ProfileTabProgramInformation />
      </div>
      <div className="m-settings-stack">
        <ProfileTabAvatar />
        <ProfileTabQuickFacts />
      </div>
    </div>
  );
}
