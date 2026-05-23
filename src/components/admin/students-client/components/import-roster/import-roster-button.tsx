"use client";

import { useState } from "react";
import { CheckIcon, UploadIcon } from "lucide-react";
import { ImportRosterDropzone } from "./components/import-roster-dropzone";
import { ImportRosterHeader } from "./components/import-roster-header";
import { ImportRosterFooter } from "./components/import-roster-footer";
import { ImportRosterNote } from "./components/import-roster-note";
import { ImportRosterUploadingState } from "./components/import-roaster-uploading-state";

export type ImportState = "idle" | "uploading" | "done";

export function ImportRosterButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ImportState>("idle");
  const [progress, setProgress] = useState(0);

  function handleClose() {
    if (state === "uploading") return;
    setOpen(false);
    setFile(null);
    setState("idle");
    setProgress(0);
  }

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <UploadIcon size={14} /> Import roster
      </button>
      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Import roster"
          >
            <ImportRosterHeader handleClose={handleClose} />
            <div className="m-sheet__body">
              {state === "done" ? (
                <div className="m-import-done">
                  <div className="m-import-done__icon">
                    <CheckIcon size={28} />
                  </div>
                  <p className="m-import-done__title">Roster imported</p>
                  <p className="m-import-done__sub">
                    {file?.name} was processed successfully.
                    <br />
                    New students will appear in the roster shortly.
                  </p>
                </div>
              ) : (
                <>
                  <ImportRosterDropzone file={file} setFile={setFile} />
                  <ImportRosterNote />
                  {state === "uploading" && (
                    <ImportRosterUploadingState progress={progress} />
                  )}
                </>
              )}
            </div>
            <ImportRosterFooter
              handleClose={handleClose}
              file={file}
              state={state}
              setState={setState}
              setProgress={setProgress}
            />
          </div>
        </>
      )}
    </>
  );
}
