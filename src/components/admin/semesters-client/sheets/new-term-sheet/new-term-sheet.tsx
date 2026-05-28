"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { NewTermSheetDrawer } from "./new-term-sheet-drawer";
import type { AdminSemesterCard } from "@/fake-db/dashboards";

interface NewTermSheetProps {
  onAdd: (card: AdminSemesterCard) => void;
}

export function NewTermSheet({ onAdd }: NewTermSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn m-btn--primary" onClick={() => setOpen(true)}>
        <PlusIcon size={14} /> New term
      </button>

      {open && <NewTermSheetDrawer setOpen={setOpen} onAdd={onAdd} />}
    </>
  );
}
