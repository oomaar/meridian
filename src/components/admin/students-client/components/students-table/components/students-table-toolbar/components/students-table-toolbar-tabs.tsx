import { Dispatch, SetStateAction } from "react";
import { StudentsTableTab } from "../../../types/StudentsTableTab";

type StudentsTableToolbarTabsProps = {
  activeTab: StudentsTableTab;
  setActiveTab: Dispatch<SetStateAction<StudentsTableTab>>;
};

export function StudentsTableToolbarTabs({
  activeTab,
  setActiveTab,
}: StudentsTableToolbarTabsProps) {
  return (
    <div className="m-seg">
      <button
        aria-pressed={activeTab === "roster"}
        onClick={() => setActiveTab("roster")}
      >
        Roster
      </button>
      <button
        aria-pressed={activeTab === "advisees"}
        onClick={() => setActiveTab("advisees")}
      >
        Advisees
      </button>
      <button
        aria-pressed={activeTab === "holds"}
        onClick={() => setActiveTab("holds")}
      >
        Holds
      </button>
    </div>
  );
}
