"use client";

import { CheckIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

type RosterHeaderProps = {
  title: string;
};

export function RosterHeader({ title }: RosterHeaderProps) {
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">(
    "idle",
  );

  function handleExport() {
    if (exportState !== "idle") return;

    setExportState("exporting");

    setTimeout(() => {
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2000);
    }, 1400);
  }

  return (
    <div className="m-card__head">
      <span className="m-card__title">{title}</span>
      <div className="m-spacer" />
      <button
        className="m-btn m-btn--sm"
        disabled={exportState === "exporting"}
        onClick={handleExport}
      >
        {exportState === "idle" && (
          <>
            <DownloadIcon size={12} /> Export CSV
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
    </div>
  );
}
