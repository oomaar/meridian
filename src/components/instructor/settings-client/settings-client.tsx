"use client";

import { useState } from "react";
import { AppearanceTab } from "@/components/student/settings-client/tabs/apperance-tab/apperance-tab";
import { SettingsSecurityTab } from "@/components/admin/settings-client/tabs/settings-security-tab/settings-security-tab";
import { ProfileTab } from "./tabs/profile-tab/profile-tab";
import { NotificationsTab } from "./tabs/notifications-tab/notifications-tab";

type Tab = "profile" | "appearance" | "security" | "notifications";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
];

export function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <>
      <div className="m-page__header m-page__header--no-border">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Faculty · Account</span>
          <h1 className="m-page__h">Settings</h1>
        </div>
      </div>

      <div className="m-tabs m-settings-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className="m-tab"
            data-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="m-page__body">
        {tab === "profile" && <ProfileTab />}
        {tab === "appearance" && <AppearanceTab />}
        {tab === "security" && <SettingsSecurityTab />}
        {tab === "notifications" && <NotificationsTab />}
      </div>
    </>
  );
}
