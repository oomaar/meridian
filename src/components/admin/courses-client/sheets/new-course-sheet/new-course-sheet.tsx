"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import type { AdminCourseRow } from "@/fake-db/dashboards";
import { NewCourseSheetDrawer } from "./new-course-sheet-drawer";

type NewCourseSheetProps = { onAdd?: (row: AdminCourseRow) => void };

export function NewCourseSheet({ onAdd }: NewCourseSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> New course
      </button>

      {open && <NewCourseSheetDrawer setOpen={setOpen} onAdd={onAdd} />}
    </>
  );
}
