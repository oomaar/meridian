"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { InstructorOfficeHoursSlot } from "@/fake-db/dashboards";
import { OfficeHoursSheetDrawer } from "./office-hours-sheet-drawer";

type OfficeHoursSheetProps = {
  officeLocation: string;
  officeHours: InstructorOfficeHoursSlot[];
};

export function OfficeHoursSheet({
  officeLocation,
  officeHours,
}: OfficeHoursSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <CalendarIcon size={14} /> Office hours
      </button>
      {open && (
        <OfficeHoursSheetDrawer
          officeLocation={officeLocation}
          officeHours={officeHours}
          setOpen={setOpen}
        />
      )}
    </>
  );
}
