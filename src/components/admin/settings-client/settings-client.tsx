"use client";

import { useState } from "react";
import type { TabId } from "./tabs/settings-client-tabs/types/TabId";
import { SettingsClientHeader } from "./components/settings-client-header";
import { SettingsClientTabs } from "./tabs/settings-client-tabs/settings-client-tabs";
import { SettingsProfileTab } from "./tabs/settings-profile-tab/settings-profile-tab";
import { SettingsAppearanceTab } from "./tabs/settings-appearance-tab/settings-appearance-tab";
import { SettingsSecurityTab } from "./tabs/settings-security-tab/settings-security-tab";
import { SettingsNotificationsTab } from "./tabs/settings-notifications-tab/settings-notifications-tab";
import { SettingsIntegrationsTab } from "./tabs/settings-integrations-tab/settings-integrations-tab";

export const ONE_YEAR = 60 * 60 * 24 * 365;

export function SettingsClient() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <>
      <SettingsClientHeader />
      <SettingsClientTabs tab={tab} setTab={setTab} />
      <div className="m-page__body">
        {tab === "profile" && <SettingsProfileTab />}
        {tab === "appearance" && <SettingsAppearanceTab />}
        {tab === "security" && <SettingsSecurityTab />}
        {tab === "notifications" && <SettingsNotificationsTab />}
        {tab === "integrations" && <SettingsIntegrationsTab />}
      </div>
    </>
  );
}
