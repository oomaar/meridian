"use client";

import { useState } from "react";
import { CheckIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";

type SyncState = "idle" | "syncing" | "done";

export function SyncSISButton() {
  const [state, setState] = useState<SyncState>("idle");

  function handleSync() {
    if (state !== "idle") return;
    setState("syncing");
    setTimeout(() => {
      setState("done");
      setTimeout(() => setState("idle"), 2200);
    }, 1800);
  }

  return (
    <button className="m-btn" onClick={handleSync} disabled={state !== "idle"}>
      {state === "idle" && (
        <>
          <RefreshCwIcon size={14} /> Sync with SIS
        </>
      )}
      {state === "syncing" && (
        <>
          <Loader2Icon size={14} className="m-spin" /> Syncing…
        </>
      )}
      {state === "done" && (
        <>
          <CheckIcon size={14} style={{ color: "var(--m-success)" }} /> Synced
        </>
      )}
    </button>
  );
}
