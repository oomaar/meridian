"use client";

import { useState } from "react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { InstructorsTable } from "./components/instructors-table";
import { ExportStudentsButton } from "../students-client/components/export-students-button";
import { InviteInstructorButton } from "./components/invite-instructor-button";

export function InstructorsClient({
  rows,
  total,
}: {
  rows: AdminInstructorRow[];
  total: number;
}) {
  const [extra, setExtra] = useState<AdminInstructorRow[]>([]);

  const allRows = [...extra, ...rows];
  const allTotal = total + extra.length;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics · Spring 2026</span>
          <h1 className="m-page__h">Instructors</h1>
          <p className="m-page__sub">
            {allTotal.toLocaleString()} faculty across 15 departments.
          </p>
        </div>
        <div className="m-page__actions">
          <ExportStudentsButton />
          <InviteInstructorButton
            onAdd={(row) => setExtra((prev) => [row, ...prev])}
          />
        </div>
      </div>
      <div className="m-page__body">
        <InstructorsTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
