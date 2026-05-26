"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AdminStudentRow } from "@/fake-db/dashboards";
import type { StudentsTableFilters } from "../../types/StudentsTableFilters";
import { StudentTableToolbarFilters } from "./components/student-table-toolbar-filters";
import { StudentsTableToolbarTabs } from "./components/students-table-toolbar-tabs";
import type { StudentsTableTab } from "../../types/StudentsTableTab";
import { StudentsTableToolbarBulkActionBar } from "./components/students-table-toolbar-bulk-action-bar";
import { StudentsTableToolbarConfirmRemoveBar } from "./components/students-table-toolbar-confirm-remove-bar";

type StudentsTableToolbarProps = {
  filters: StudentsTableFilters;
  setFilters: Dispatch<SetStateAction<StudentsTableFilters>>;
  rows: AdminStudentRow[];
  handleRemoveConfirmed(): void;
  selected: Set<string>;
  activeTab: StudentsTableTab;
  setActiveTab: Dispatch<SetStateAction<StudentsTableTab>>;
};

export function StudentsTableToolbar({
  filters,
  setFilters,
  rows,
  handleRemoveConfirmed,
  selected,
  activeTab,
  setActiveTab,
}: StudentsTableToolbarProps) {
  const someChecked = selected.size > 0;
  const [confirmRemove, setConfirmRemove] = useState(false);

  function isRemoving() {
    if (confirmRemove) {
      return (
        <StudentsTableToolbarConfirmRemoveBar
          selected={selected}
          setConfirmRemove={setConfirmRemove}
          handleRemoveConfirmed={() => {
            handleRemoveConfirmed();
            setConfirmRemove(false);
          }}
        />
      );
    }

    return (
      <StudentsTableToolbarBulkActionBar
        selected={selected}
        setConfirmRemove={setConfirmRemove}
      />
    );
  }

  if (someChecked) {
    return (
      <div className="m-card__toolbar">
        <StudentTableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          rows={rows}
        />
        <div className="m-spacer" />
        {isRemoving()}
      </div>
    );
  }

  return (
    <div className="m-card__toolbar">
      <StudentTableToolbarFilters
        filters={filters}
        setFilters={setFilters}
        rows={rows}
      />
      <div className="m-spacer" />
      <StudentsTableToolbarTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
