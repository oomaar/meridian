"use client";

import { useState } from "react";
import { CheckIcon, DownloadIcon, Loader2Icon } from "lucide-react";

type ExportState = "idle" | "preparing" | "done";

export function ExportStudentsButton() {
  const [state, setState] = useState<ExportState>("idle");

  function handleExport() {
    if (state !== "idle") return;
    setState("preparing");
    setTimeout(() => {
      setState("done");
      window.print();
      setTimeout(() => setState("idle"), 2000);
    }, 700);
  }

  return (
    <button
      className="m-btn"
      onClick={handleExport}
      disabled={state !== "idle"}
    >
      {state === "idle" && <><DownloadIcon size={14} /> Export</>}
      {state === "preparing" && <><Loader2Icon size={14} className="m-spin" /> Preparing…</>}
      {state === "done" && <><CheckIcon size={14} style={{ color: "var(--m-success)" }} /> Ready</>}
    </button>
  );
}
