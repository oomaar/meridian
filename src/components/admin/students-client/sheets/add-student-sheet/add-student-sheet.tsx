"use client";

import { useState } from "react";
import type { AdminStudentRow } from "@/fake-db/dashboards";
import { AddStudentSheetDrawer } from "./add-student-sheet-drawer";
import { PlusIcon } from "lucide-react";

type AddStudentSheetProps = { onAdd?: (row: AdminStudentRow) => void };

export function AddStudentSheet({ onAdd }: AddStudentSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> Add student
      </button>
      {open && <AddStudentSheetDrawer setOpen={setOpen} onAdd={onAdd} />}
    </>
  );
}
