import { Loader2Icon, UploadIcon } from "lucide-react";
import { ImportState } from "../import-roster-button";
import { Dispatch, SetStateAction } from "react";

type ImportRosterFooterProps = {
  handleClose: () => void;
  file: File | null;
  state: ImportState;
  setState: Dispatch<SetStateAction<ImportState>>;
  setProgress: Dispatch<SetStateAction<number>>;
};

export function ImportRosterFooter({
  handleClose,
  file,
  state,
  setState,
  setProgress,
}: ImportRosterFooterProps) {
  function handleImport() {
    if (!file || state !== "idle") return;
    setState("uploading");
    setProgress(0);

    // simulate upload progress
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(tick);
          setState("done");
          return 100;
        }
        return p + Math.random() * 18 + 4;
      });
    }, 120);
  }

  return (
    <div className="m-sheet__foot">
      {state === "done" ? (
        <button className="m-btn m-btn--primary" onClick={handleClose}>
          Done
        </button>
      ) : (
        <>
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={state === "uploading"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!file || state !== "idle"}
            onClick={handleImport}
          >
            {state === "uploading" ? (
              <>
                <Loader2Icon size={13} className="m-spin" /> Importing…
              </>
            ) : (
              <>
                <UploadIcon size={13} /> Import
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
