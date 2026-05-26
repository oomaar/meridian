"use client";

import { useState } from "react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { StudentsTable } from "./components/students-table/students-table";
import { StudentsClientHeader } from "./components/students-client-header";

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
      <StudentsClientHeader total={allTotal} setExtra={setExtra} />
      <div className="m-page__body">
        <StudentsTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
