"use client";

import { useState } from "react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { CoursesTable } from "./components/courses-table/courses-table";
import { NewCourseButton } from "./components/new-course-button";
import { SyncSISButton } from "./components/sync-sis-button";

type CoursesClientProps = {
  rows: AdminCourseRow[];
  total: number;
};

export function CoursesClient({ rows, total }: CoursesClientProps) {
  const [extra, setExtra] = useState<AdminCourseRow[]>([]);

  const allRows = [...extra, ...rows];
  const allTotal = total + extra.length;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academics</span>
          <h1 className="m-page__h">Courses</h1>
          <p className="m-page__sub">
            {allTotal.toLocaleString()} sections across 47 programs. Catalog
            locks Nov 28 for SP26.
          </p>
        </div>
        <div className="m-page__actions">
          <SyncSISButton />
          <NewCourseButton
            onAdd={(row) => setExtra((prev) => [row, ...prev])}
          />
        </div>
      </div>
      <div className="m-page__body">
        <CoursesTable rows={allRows} total={allTotal} />
      </div>
    </>
  );
}
