"use client";

import { useState } from "react";
import { ProfileTab } from "./tabs/profile-tab/profile-tab";
import { AppearanceTab } from "./tabs/apperance-tab/apperance-tab";
import { SecurityTab } from "./tabs/security-tab/security-tab";
import { NotificationsTab } from "./tabs/notifications-tab/notifications-tab";

type SettingsTab = "profile" | "appearance" | "security" | "notifications";

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile" },
    { id: "appearance" as const, label: "Appearance" },
    { id: "security" as const, label: "Security" },
    { id: "notifications" as const, label: "Notifications" },
  ];

  return (
    <>
      <div className="m-page__header m-settings-header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Account</span>
          <h1 className="m-page__h">Settings</h1>
        </div>
      </div>

      <div className="m-tabs m-settings-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className="m-tab"
            aria-selected={activeTab === tab.id}
            data-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="m-page__body">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>
    </>
  );
}
