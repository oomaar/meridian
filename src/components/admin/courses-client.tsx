"use client";

import { useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { CoursesTable } from "./courses-table";
import { NewCourseButton } from "./new-course-button";
import { SyncSISButton } from "./sync-sis-button";

export function CoursesClient({
  rows,
  total,
}: {
  rows: AdminCourseRow[];
  total: number;
}) {
  const [extra, setExtra] = useState<AdminCourseRow[]>([]);

  const allRows  = [...extra, ...rows];
  const allTotal = total + extra.length;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics</span>
          <h1 className="m-page__h">Courses</h1>
          <p className="m-page__sub">
            {allTotal.toLocaleString()} sections across 47 programs. Catalog locks Nov 28 for SP26.
          </p>
        </div>
        <div className="m-page__actions">
          <SyncSISButton />
          <NewCourseButton onAdd={(row) => setExtra((prev) => [row, ...prev])} />
        </div>
      </div>

      <div className="m-page__body">
        <CoursesTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
