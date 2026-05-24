import { Dispatch, SetStateAction } from "react";
import { TABS } from "../tabs/data/TABS";
import type { TabId } from "../tabs/types/TabId";

type SettingsClientTabsProps = {
  tab: TabId;
  setTab: Dispatch<SetStateAction<TabId>>;
};

export default function SettingsClientTabs({
  tab,
  setTab,
}: SettingsClientTabsProps) {
  return (
    <div className="m-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className="m-tab"
          data-selected={tab === t.id}
          onClick={() => setTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
