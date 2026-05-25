"use client";

import { useState } from "react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { InstructorsTable } from "./components/instructors-table/instructors-table";
import { InstructorsClientHeader } from "./components/instructors-client-header";

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
      <InstructorsClientHeader total={allTotal} setExtra={setExtra} />
      <div className="m-page__body">
        <InstructorsTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
