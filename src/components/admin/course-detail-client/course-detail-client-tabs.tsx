import { AdminCourseModule, AdminCourseRosterRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import { Tab } from "./types/Tab";

type CourseDetailClientTabsProps = {
  modules: AdminCourseModule[];
  roster: AdminCourseRosterRow[];
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
};

export function CourseDetailClientTabs({
  modules,
  roster,
  tab,
  setTab,
}: CourseDetailClientTabsProps) {
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "modules", label: "Modules", count: modules.length },
    { id: "roster", label: "Roster", count: roster.length },
    { id: "grades", label: "Grades" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="m-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          className="m-tab"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
        >
          {t.label}
          {t.count != null && <span className="m-tab__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
