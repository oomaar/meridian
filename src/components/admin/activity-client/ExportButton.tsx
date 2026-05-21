import { useState } from "react";
import { CheckIcon, DownloadIcon, Loader2Icon } from "lucide-react";

export function ExportButton() {
  const [state, setState] = useState<"idle" | "prep" | "ready">("idle");

  function handleExport() {
    if (state !== "idle") return;
    setState("prep");
    setTimeout(() => {
      window.print();
      setState("ready");
      setTimeout(() => setState("idle"), 2000);
    }, 800);
  }

  return (
    <button
      className="m-btn"
      onClick={handleExport}
      disabled={state === "prep"}
    >
      {state === "idle" && (
        <>
          <DownloadIcon size={14} /> Export audit log
        </>
      )}
      {state === "prep" && (
        <>
          <Loader2Icon size={14} className="m-spin" /> Preparing…
        </>
      )}
      {state === "ready" && (
        <>
          <CheckIcon size={14} /> Ready
        </>
      )}
    </button>
  );
}
