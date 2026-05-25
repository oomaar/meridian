"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import type { AdminUserRow } from "@/fake-db/dashboards";
import { InviteUserSheetDrawer } from "./invite-user-sheet-drawer";

type InviteUserSheetProps = {
  onAdd: (row: AdminUserRow) => void;
};

export function InviteUserSheet({ onAdd }: InviteUserSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> Invite user
      </button>

      {open && <InviteUserSheetDrawer setOpen={setOpen} onAdd={onAdd} />}
    </>
  );
}
