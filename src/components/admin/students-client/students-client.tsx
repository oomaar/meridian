"use client";

import { useState } from "react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { StudentsTable } from "./components/students-table/students-table";
import { AddStudentButton } from "./components/add-student/add-student-button";
import { ImportRosterButton } from "./components/import-roster/import-roster-button";
import { ExportStudentsButton } from "./components/export-students-button";

type StudentsClientProps = {
  rows: AdminStudentRow[];
  total: number;
};

export function StudentsClient({ rows, total }: StudentsClientProps) {
  const [extra, setExtra] = useState<AdminStudentRow[]>([]);

  const allRows = [...extra, ...rows];
  const allTotal = total + extra.length;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics · Spring 2026</span>
          <h1 className="m-page__h">Students</h1>
          <p className="m-page__sub">
            {allTotal.toLocaleString()} enrolled across 47 programs.
          </p>
        </div>
        <div className="m-page__actions">
          <ImportRosterButton />
          <ExportStudentsButton />
          <AddStudentButton
            onAdd={(row) => setExtra((prev) => [row, ...prev])}
          />
        </div>
      </div>
      <div className="m-page__body">
        <StudentsTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
