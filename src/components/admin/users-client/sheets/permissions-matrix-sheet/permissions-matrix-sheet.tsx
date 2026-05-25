"use client";

import { useState } from "react";
import { ShieldIcon } from "lucide-react";
import { PermissionsMatrixSheetDrawer } from "./permissions-matrix-sheet-drawer";

export function PermissionsMatrixSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <ShieldIcon size={14} /> Permissions matrix
      </button>
      {open && <PermissionsMatrixSheetDrawer setOpen={setOpen} />}
    </>
  );
}
