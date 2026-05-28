"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { InviteInstructorSheetDrawer } from "./invite-instructor-sheet-drawer";

type InviteInstructorSheetProps = { onAdd?: (row: AdminInstructorRow) => void };

export function InviteInstructorSheet({
  onAdd,
}: InviteInstructorSheetProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <SendIcon size={13} /> Invite instructor
      </button>
      {open && <InviteInstructorSheetDrawer setOpen={setOpen} onAdd={onAdd} />}
    </>
  );
}
