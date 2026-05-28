"use client";

import { useState } from "react";
import { UploadIcon } from "lucide-react";
import { ImportRosterSheetDrawer } from "./import-roster-sheet-drawer";

export function ImportRosterSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <UploadIcon size={14} /> Import roster
      </button>
      {open && <ImportRosterSheetDrawer setOpen={setOpen} />}
    </>
  );
}
