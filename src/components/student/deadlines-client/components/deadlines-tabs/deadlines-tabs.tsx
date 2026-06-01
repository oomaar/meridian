import { TABS } from "./data/TABS";
import type { Tab } from "./types/Tab";

type DeadlinesTabsProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  counts: Record<Tab, number>;
};

export function DeadlinesTabs({
  activeTab,
  onTabChange,
  counts,
}: DeadlinesTabsProps) {
  return (
    <div className="m-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          className="m-tab"
          aria-selected={activeTab === tab.id}
          data-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {counts[tab.id] > 0 && (
            <span className="m-tab__count">{counts[tab.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
