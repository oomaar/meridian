import type { AdminStudentRow } from "@/fake-db/dashboards";
import { Dispatch, SetStateAction } from "react";
import { ImportRosterSheet } from "./sheets/import-roster/import-roster-sheet";
import { AddStudentSheet } from "./sheets/add-student-sheet/add-student-sheet";
import { ExportButton } from "@/components/export-button";

type StudentsClientHeaderProps = {
  total: number;
  setExtra: Dispatch<SetStateAction<AdminStudentRow[]>>;
};

export function StudentsClientHeader({
  total,
  setExtra,
}: StudentsClientHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Academics · Spring 2026</span>
        <h1 className="m-page__h">Students</h1>
        <p className="m-page__sub">
          {total.toLocaleString()} enrolled across 47 programs.
        </p>
      </div>
      <div className="m-page__actions">
        <ImportRosterSheet />
        <ExportButton />
        <AddStudentSheet onAdd={(row) => setExtra((prev) => [row, ...prev])} />
      </div>
    </div>
  );
}
