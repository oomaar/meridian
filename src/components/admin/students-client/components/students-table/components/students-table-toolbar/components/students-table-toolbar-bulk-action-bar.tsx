"use client";

import {
  CheckIcon,
  DownloadIcon,
  InboxIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { BulkMessageSheet } from "../../../../../sheets/bulk-message-sheet/bulk-message-sheet";

type StudentsTableToolbarBulkActionBarProps = {
  selected: Set<string>;
  setConfirmRemove: Dispatch<SetStateAction<boolean>>;
};

export function StudentsTableToolbarBulkActionBar({
  selected,
  setConfirmRemove,
}: StudentsTableToolbarBulkActionBarProps) {
  const [msgOpen, setMsgOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">(
    "idle",
  );

  function handleExport() {
    if (exportState !== "idle") return;
    setExportState("exporting");
    setTimeout(() => {
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2000);
    }, 1300);
  }

  return (
    <>
      <div className="m-bulk-bar">
        <span className="m-bulk-bar__count">{selected.size} selected</span>
        <button className="m-btn m-btn--sm" onClick={() => setMsgOpen(true)}>
          <InboxIcon size={12} /> Message
        </button>
        <button
          className="m-btn m-btn--sm"
          disabled={exportState !== "idle"}
          onClick={handleExport}
        >
          {exportState === "idle" && (
            <>
              <DownloadIcon size={12} /> Export
            </>
          )}
          {exportState === "exporting" && (
            <>
              <Loader2Icon size={12} className="m-spin" /> Exporting…
            </>
          )}
          {exportState === "done" && (
            <>
              <CheckIcon size={12} /> Downloaded!
            </>
          )}
        </button>
        <button
          className="m-btn m-btn--sm m-btn--danger"
          onClick={() => setConfirmRemove(true)}
        >
          <Trash2Icon size={12} /> Remove
        </button>
      </div>
      {msgOpen && (
        <BulkMessageSheet
          count={selected.size}
          onClose={() => setMsgOpen(false)}
        />
      )}
    </>
  );
}
