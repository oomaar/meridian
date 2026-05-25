"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { AdminSemesterCard } from "@/fake-db/dashboards";
import { AcademicCalendarDrawer } from "./academic-calendar-drawer";

type AcademicCalendarSheetProps = {
  semesters: AdminSemesterCard[];
};

export function AcademicCalendarSheet({
  semesters,
}: AcademicCalendarSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <CalendarIcon size={14} /> Academic calendar
      </button>
      {open && (
        <AcademicCalendarDrawer semesters={semesters} setOpen={setOpen} />
      )}
    </>
  );
}
